import passport from 'passport';
import { Strategy as OAuth2Strategy } from 'passport-google-oauth20';

import { AUTH } from '../env';
// import app from '../app';

passport.use(new OAuth2Strategy({
  clientID: AUTH.GOOGLE.clientID,
  clientSecret: AUTH.GOOGLE.clientSecret,
  callbackURL: AUTH.GOOGLE.redirectURL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile, accessToken, refreshToken);
      // await <find user in DB>
      // generate new token
      // insert new token into DB
      // return token with success bool
      return done(null, profile)
    } catch (error) {
      return done(error);
    }
  }
));

export default passport;
