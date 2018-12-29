import { Request, Response, NextFunction } from 'express';
import db from '../db/models';
import { AccountUserSwipeAttributes } from '../db/models/AccountUserSwipe';
import HttpException from '../exceptions/httpException';
const { AccountUserSwipe, AccountUser } = db;

export const userSwipeAction = async (req: Request, res: Response, next: NextFunction) => {
    // get current, add the user id that they swiped on return success.
    const user = req.user.uid;
    const swipeDetails: AccountUserSwipeAttributes = req.body;

    try {
        const createdSwipeAction = await AccountUserSwipe.create(swipeDetails, { include: [AccountUser] });

        if (!createdSwipeAction) { next(new HttpException(500, 'something went wrong')); }

        res.status(200).send({ msg: 'swipe successful' });
    } catch (e) {
        next(new HttpException(500, 'something went really wrong'));
    }
};

// export const getAllUserSwipes