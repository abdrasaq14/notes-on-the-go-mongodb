import { Request, Response } from "express";

export function displayIndex(req: Request, res: Response) {
	res.render("index", {});
}