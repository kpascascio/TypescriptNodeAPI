import { Response, Request } from 'express';
import db from '../db/models';
import { AccountUserAttributes } from '../db/models/AccountUser';
const AccountUser = db.AccountUser;
import bcrypt from 'bcrypt-nodejs';
import { createToken, serviceDatabaseErrorHandler } from '../lib/helpers';

export const createUser = async (req: Request, res: Response) => {
    try {
        const userObj: AccountUserAttributes = req.body;
        userObj.password = bcrypt.hashSync(userObj.password, bcrypt.genSaltSync(10));
        const createdUser = await AccountUser.create(userObj);
        createdUser.token = createToken({ id: createdUser.phoneNumber });

        if (createdUser.error) { return res.status(500).send({ msg: 'There was an error' }); }

        const { accountVerified, token, phoneNumber } = createdUser;
        res.status(200).send({
            msg: 'user was created', data: {
                accountVerified,
                phoneNumber,
                token
            }
        });

    } catch (e) {
        return serviceDatabaseErrorHandler(e);
    }
};