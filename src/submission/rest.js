import { Router } from 'express';
import moment from 'moment';

import { returnError } from '../shared/util';
import { getRound } from '../core/config';

const router = Router();

router.post('/', async(req, res) => {
  const pool = req.app.get('poolClient');

  const name =
    req.body.name
      .trim()
      .toLowerCase()
      .replace(/ /g, "") || "";

  const token = req.headers.authorization;
  const currentRound = getRound();

  if (currentRound >= 0 && name !== "") {
    pool.query(
      "SELECT * FROM users WHERE token = $1",
      [token],
      (error, response) => {
        if (error || response.rowCount === 0) {
          returnError(res, 401, "Invalid credentials");
        } else {
          pool.query(
            "SELECT * FROM answers WHERE email=$1 and round=$2",
            [response.rows[0].email, currentRound],
            (subError, result) => {
              if (subError) {
                returnError(res, 401, "database error code:SFL");
              } else if (result.rowCount === 0) {
                pool.query(
                  "INSERT INTO answers (email, round, answer, count, time) VALUES ($1, $2, $3, $4, $5)",
                  [
                    response.rows[0].email,
                    currentRound,
                    name,
                    1,
                    moment().format("YYYY-MM-DD HH:mm:ss")
                  ],
                  (subError1) => {
                    if (subError1) {
                      returnError(res, 401, "database error code:SSL");
                    } else {
                      res.json({ data: { count: 1 }, success: true });
                    }
                  }
                );
              } else if (result.rows[0] && result.rows[0].count >= 3) {
                res.json({
                  data: { count: 3, message: "Maximum limit reached" },
                  success: false
                });
              } else {
                pool.query(
                  "UPDATE answers SET answer=$1, count=$2, time=$3 WHERE email=$4 and round=$5",
                  [
                    name,
                    (result.rows[0] && result.rows[0].count + 1) || 1,
                    moment().format("YYYY-MM-DD HH:mm:ss"),
                    response.rows[0].email,
                    currentRound
                  ],
                  (subError1) => {
                    if (subError1) {
                      returnError(res, 401, "database error code:SSL");
                    } else {
                      res.json({
                        data: { count: result.rows[0].count + 1 },
                        success: true
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else if (name === "") {
    returnError(res, 200, "Input cannot be empty");
  } else {
    returnError(res, 401, "not allowed");
  }
});

export default router;
