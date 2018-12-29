import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/HttpException';

export function errorMiddleware( error: HttpException, req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.log('test');
    return res.status(status).json({message});
}