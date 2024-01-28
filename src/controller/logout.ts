import { Request, Response } from "express";



export function clearCookieOnLogout(req:Request, res:Response){

	res.clearCookie("token");
	res.redirect("/");
}