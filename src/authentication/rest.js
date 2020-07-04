import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'] }));

router.get('/google/callback', function () {
  passport.authenticate('google', {
    successRedirect: '/hello-world?status=200',
    failureRedirect: '/hello-world?status=400'
  });
});

router.get('/logout', async (req, res) => {
  req.logOut();
  res.redirect('/');
});

export default router;
