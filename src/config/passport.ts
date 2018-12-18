import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook from 'passport-facebook';
import _ from 'lodash';
import db from '../db/models';
const AccountUser = db.AccountUser;
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt-nodejs';
const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user, done) => {
  console.log(user.uid);
  done(undefined, user.uid);
});

passport.deserializeUser((id, done) => {
  AccountUser.findOne({ where: { uid: id } })
    .then((user: any) => { done(undefined, user); })
    .catch((err) => { done(true, err); });
});

passport.use(new LocalStrategy(
  { usernameField: 'phoneNumber' },
  async (phoneNumber, password, done) => {
    try {
      console.log('here');
      const user = await AccountUser.findOne({ where: { phoneNumber } });

      bcrypt.compare(password, user.password, async (err, res) => {
        if (err) { return done(err, false); }
        return await done(false, user);
      });
    } catch (e) {
      // console.log('ergbelisgblsebrgljbh', e);
      // error logger;
    }
  })
);

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['name', 'email', 'link', 'locale', 'timezone'],
  passReqToCallback: true
}, (req: any, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    // AccountUserfindOne({ facebook: profile.id }, (err: any, existingUser: any) => {
    //   if (err) { return done(err); }
    //   if (existingUser) {
    //     req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
    //     done(err);
    //   } else {
    //     AccountUserfindById(req.user.id, (err: any, user: any) => {
    //       if (err) { return done(err); }
    //       user.facebook = profile.id;
    //       user.tokens.push({ kind: 'facebook', accessToken });
    //       user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
    //       user.profile.gender = user.profile.gender || profile._json.gender;
    //       user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
    //       user.save((err: Error) => {
    //         req.flash('info', { msg: 'Facebook account has been linked.' });
    //         done(err, user);
    //       });
    //     });
    //   }
    // });
  } else {
    // AccountUserfindOne({ facebook: profile.id }, (err: any, existingUser: any) => {
    //   if (err) { return done(err); }
    //   if (existingUser) {
    //     return done(undefined, existingUser);
    //   }
    //   AccountUserfindOne({ email: profile._json.email }, (err: any, existingEmailUser: any) => {
    //     if (err) { return done(err); }
    //     if (existingEmailUser) {
    //       req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
    //       done(err);
    //     } else {
    //       const user: any = new User();
    //       user.email = profile._json.email;
    //       user.facebook = profile.id;
    //       user.tokens.push({ kind: 'facebook', accessToken });
    //       user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
    //       user.profile.gender = profile._json.gender;
    //       user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
    //       user.profile.location = (profile._json.location) ? profile._json.location.name : '';
    //       user.save((err: Error) => {
    //         done(err, user);
    //       });
    //     }
    //   });
    // });
  }
}));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split('/').slice(-1)[0];

  if (_.find(req.user.tokens, { kind: provider })) {
    next();
  } else {
    res.redirect(`/auth/${provider}`);
  }
};

export const requireSignin = passport.authenticate('local');