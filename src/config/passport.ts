import passport from 'passport';
import passportLocal from 'passport-local';
import passportFacebook, { StrategyOption } from 'passport-facebook';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback,
  StrategyOptions
} from 'passport-jwt';
import _ from 'lodash';
import db from '../db/models';
const AccountUser = db.AccountUser;
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt-nodejs';
const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;

passport.serializeUser<any, any>((user, done) => {
  if (!user.uid) {
    return done(undefined, user.id);
  }
  return done(undefined, user.uid);
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
      const user = await AccountUser.findOne({ where: { phoneNumber } });

      bcrypt.compare(password, user.password, async (err, res) => {
        if (err) { return done(err, false); }
        return await done(false, user);
      });
    } catch (e) {
      console.log(e);
      // error logger;
    }
  })
);

const jwtOptions: StrategyOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new JwtStrategy(jwtOptions, async (payload: any, done: VerifiedCallback) => {

  const user = await AccountUser.findOne({ where: { uid: payload.id } });
  // TODO handle is error
  if (!user) { return done(true, undefined, 'error was thrown'); }

  return done(false, user);
}));

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['email', 'link', 'locale', 'timezone', 'first_name', 'gender', 'location', 'last_name', 'displayName'],
  passReqToCallback: true
}, async (req: any, accessToken, refreshToken, profile, done) => {
  console.log({accessToken, refreshToken, profile});
  console.log({user: req.user});
  return done(false, profile);

  // const findOrCreatedUser = await AccountUser.findOrCreate({where: { }});
  // if (req.user) {

    // look to see if the user has already signed up with their facebook account.

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
  // } else {
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
  // }
}));

export let isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

export const requireSignin = passport.authenticate('local');
export const isAuthorized = passport.authenticate('jwt');