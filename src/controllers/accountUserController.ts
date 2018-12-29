import { Response, Request, NextFunction } from 'express';
import db from '../db/models';
import { AccountUserAttributes, AccountUserInstance } from '../db/models/AccountUser';
const { AccountUser, AccountUserLocation } = db;
import bcrypt from 'bcrypt-nodejs';
import { createToken } from '../lib/helpers';
import HttpException from '../exceptions/HttpException';
import passport = require('passport');
import { IVerifyOptions } from 'passport-local';
import '../config/passport';
import { AccountUserLocationAttributes } from '../db/models/AccountUserLocation';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userObj: AccountUserAttributes = req.body;
        userObj.password = bcrypt.hashSync(userObj.password, bcrypt.genSaltSync(10));
        const createdUser = await AccountUser.create(userObj);
        createdUser.token = createToken({ id: createdUser.phoneNumber });

        if (createdUser.error) { next(new HttpException(500, 'user not created')); }

        const { accountVerified, token, phoneNumber } = createdUser;
        res.status(200).send({
            msg: 'user was created', data: {
                accountVerified,
                phoneNumber,
                token
            }
        });

    } catch (e) {
        return next(new HttpException(500, 'user not created'));
    }
};

export const token = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: Error, user: AccountUserInstance, info: IVerifyOptions) => {
        if (err) { return next(err); }

        req.logIn(user, (err) => {
            if (err) { return next(err); }
            res.status(200).send({ token: createToken({ id: user.uid }), date: Date.now() });
        });
    })(req, res, next);
};

export const addUserLocation = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user.uid;
    const locationFromRequest: AccountUserLocationAttributes = req.body;

    try {
        const createdUserLocation = await AccountUserLocation.create(locationFromRequest, { include: [AccountUser] });

        if (!createdUserLocation) { next(new HttpException(500, 'something went slightly wrong')); }

        res.status(201).send({ msg: 'ok' });
    } catch (e) {
        return next(new HttpException(500, 'something went wrong'));
    }
};