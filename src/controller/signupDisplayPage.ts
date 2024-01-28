import { Request, Response} from "express";

export default function signupPage(
	req: Request,
	res: Response,
) {
	res.render("signup", {});
}
