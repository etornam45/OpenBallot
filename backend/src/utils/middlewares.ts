import type { NextFunction, Request, Response } from "express";


export function auth_middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies["auth-token"]
    console.log(token)
    next()
}

export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
}