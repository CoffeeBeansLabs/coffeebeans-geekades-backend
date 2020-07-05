import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

import { GOOGLE_OAUTH2_URL } from '../core/config';
import { returnError } from '../shared/util';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    if (req.body.token) {
      // requesting google for data
      const response = await fetch(
        GOOGLE_OAUTH2_URL + req.body.token
      );

      // checking google response
      if (!response.email) returnError(res, 401, "Invalid credentials & no email");

      // check organization domain
      if (response.hd !== "coffeebeans.io") {
        returnError(res, 401, "Unauthorized");
      }
      const token = uuidv4();
      console.log("login -> " + response.name);
      // checking database for user

      const pool = req.app.get('poolClient');

      return await pool.query(
        "INSERT INTO users (email, name, avatar, token) VALUES ($1, $2, $3, $4)",
        [response.email, response.name, response.picture, token],
        (error) => {
          if (error) {
            return returnError(res, 400, "database error code:CIU");
          }
          return res.json({ data: { token }, success: true });
        }
      );
    }
    return returnError(res, 401, "Invalid credentials & no token");
  } catch (error) {
    return returnError(res, 401, "Invalid credentials");
  }
});

// router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'] }));

// router.get('/google/callback', () => {
//   passport.authenticate('google', {
//     successRedirect: '/hello-world?status=200',
//     failureRedirect: '/hello-world?status=400'
//   });
// });

router.get('/logout', async (req, res) => {
  const token = req.headers.authorization;

  const pool = req.app.get('poolClient');

  pool.query("DELETE FROM users WHERE token = $1", [token], (error) => {
    if (error) {
      returnError(res, 401, "database error code:CIU");
    } else {
      res.json({ success: true });
    }
  });
});

export default router;
