import { type Response, type Request} from "express";

export function loginDisplayPage(req: Request, res: Response) {
	res.render("login", {});
}
