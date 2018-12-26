import express from 'express';
import compression from 'compression';  // compresses requests
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import expressValidator from 'express-validator';

dotenv.config({ path: '.env' });
import db from './db/models';

import * as accountUserController from './controllers/accountUserController';
import * as uploadController from './controllers/uploadController';
import * as accountSwipeController from './controllers/accountUserSwipeController';

// API keys and Passport configuration
import * as passportConfig from './config/passport';
import { errorMiddleware } from './middleware/error.middleware';

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
app.use(errorMiddleware);


app.use(passport.initialize());
app.use(passport.session());


app.post('/api/account/createuser', accountUserController.createUser);
app.post('/api/token', accountUserController.token);
app.post('/api/imageupload', passportConfig.isAuthorized, uploadController.imageUpload);

app.post('/api/userswipe', passportConfig.isAuthorized, accountSwipeController.userSwipeAction);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

export default app;