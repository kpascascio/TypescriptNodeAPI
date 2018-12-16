import express from 'express';
import compression from 'compression';  // compresses requests
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import expressValidator from 'express-validator';

dotenv.config({ path: '.env' });
import db from './db/models';

import * as apiController from './controllers/api';
import * as accountUserController from './controllers/accountUserController';

// API keys and Passport configuration
import * as passportConfig from './config/passport';

db.sequelize.sync(
  // {force: true}
);

// Create Express server
const app = express();


// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.use(passport.initialize());

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.post('/api/account/createuser', accountUserController.createUser);



/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

export default app;