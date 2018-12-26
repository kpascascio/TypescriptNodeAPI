import { Response, Request, NextFunction } from 'express';
import db from '../db/models';
import { AccountUserAttributes, AccountUserModel, AccountUserInstance } from '../db/models/AccountUser';
const AccountUser = db.AccountUser;
import bcrypt from 'bcrypt-nodejs';
import { createToken } from '../lib/helpers';
import HttpExcetion from '../exceptions/httpException';
import passport = require('passport');
import { IVerifyOptions } from 'passport-local';
import '../config/passport';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userObj: AccountUserAttributes = req.body;
        userObj.password = bcrypt.hashSync(userObj.password, bcrypt.genSaltSync(10));
        const createdUser = await AccountUser.create(userObj);
        createdUser.token = createToken({ id: createdUser.phoneNumber });

        if (createdUser.error) { next(new HttpExcetion(500, 'user not created')); }

        const { accountVerified, token, phoneNumber } = createdUser;
        res.status(200).send({
            msg: 'user was created', data: {
                accountVerified,
                phoneNumber,
                token
            }
        });

    } catch (e) {
        return next(new HttpExcetion(200, 'user not created'));
    }
};

export const token = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: AccountUserInstance, info: IVerifyOptions) => {
        if (err) { return next(err); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.status(200).send({token: createToken({id: user.uid}), date: Date.now()});
        });
    })(req, res, next);
};