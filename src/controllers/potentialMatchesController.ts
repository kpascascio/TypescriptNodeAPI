import { Request, Response, NextFunction } from 'express';
import db from '../db/models';
import HttpExcetion from '../exceptions/httpException';
const { AccountUser, AccountUserLocation } = db;

export const findUsersInRadius = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const userLocation = await AccountUserLocation.findOne({ where: { userUid: req.user.uid } });
        if (!userLocation) { return next(new HttpExcetion(500, 'nope nope nope')); }

        // console.log(userLocation.longitude, userLocation.latitude);
        // TODO: finish this logic
        res.send(userLocation);
    } catch (e) {
        next(new HttpExcetion(500, e));
    }
};

// TODO Refactor alert!
export const getAllUserLocations = async (req: Request, res: Response, next: NextFunction) => {
    const locations = await AccountUserLocation.findAll();
    res.send(locations);
};