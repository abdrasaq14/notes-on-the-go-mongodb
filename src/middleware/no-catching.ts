import { type AuthenticatedRequest } from "../../express"; 
import {  Response, NextFunction } from "express";


export function noCache(req:AuthenticatedRequest, res:Response, next:NextFunction) {
	res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
	next();
}