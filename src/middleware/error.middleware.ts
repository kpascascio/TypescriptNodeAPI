import { Request, Response, NextFunction } from 'express';
import HttpExcetion from '../exceptions/httpException';

export function errorMiddleware( error: HttpExcetion, req: Request, res: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    console.log('test');
    return res.status(status).json({message});
}