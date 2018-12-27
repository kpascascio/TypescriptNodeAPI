import { Request, Response, NextFunction } from 'express';
import db from '../db/models';
import HttpExcetion from '../exceptions/httpException';
const { AccountUser, AccountUserLocation } = db;

export const findUsersInRadius = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = await AccountUser.findById(req.user.uid);
        const userLocations = await user.getLocations();
        if (!userLocations) { return next(new HttpExcetion(500, 'nope nope nope')); }

        console.log('user location', userLocations);

        // TODO: finish this logic
        res.send(userLocations);
    } catch (e) {
        next(new HttpExcetion(500, e));
    }
};

export const getAllUserLocations = async (req: Request, res: Response, next: NextFunction) => {
    const locations = await AccountUserLocation.findAll();
    res.send(locations);
};