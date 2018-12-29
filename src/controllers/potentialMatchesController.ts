import { Request, Response, NextFunction } from 'express';
import db from '../db/models';
import HttpException from '../exceptions/httpException';
const { AccountUser, AccountUserLocation } = db;

export const findUsersInRadius = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userLocation = await AccountUserLocation.findOne({ where: { userUid: req.user.uid } });
        if (!userLocation) { return next(new HttpException(500, 'nope nope nope')); }

        const similarUsersWithLocation = await AccountUserLocation.findAndCountAll({
            where: { city: userLocation.city, state: userLocation.state },
            include: [{ model: AccountUser, as: 'user' }]
        });

        // TODO: check for the case if the user is matching their own gender.
        const matchedGenderUsersArray = similarUsersWithLocation.rows.filter(locationRecord => locationRecord.user.matchGender == req.user.matchGender);
        // TODO: Needs more error checking
        res.send({rows: matchedGenderUsersArray, count: matchedGenderUsersArray.length});
    } catch (e) {
        next(new HttpException(500, e));
    }
};

// TODO Refactor alert!
export const getAllUserLocations = async (req: Request, res: Response, next: NextFunction) => {
    const locations = await AccountUserLocation.findAll();
    res.send(locations);
};