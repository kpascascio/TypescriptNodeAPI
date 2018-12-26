import { Request, Response, NextFunction } from 'express';
import db from '../db/models';
const { AccountUser, AccountUserLocation } = db;

export const findUsersInRadius = async ( req: Request, res: Response, next: NextFunction) => {
    const user = req.user.uid;
};