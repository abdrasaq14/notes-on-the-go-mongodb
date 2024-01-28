import { AuthenticatedRequest } from "../../express";
import { type Response, type NextFunction } from "express";
import { getUserBySessionToken } from "../../schema/noteDB";

export async function isAuthenticated(
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) {
	try {
		const token = req.cookies.token;
		console.log("token", token);
		if (!token) {
			return res.redirect("/users/login");
		} else {
			const existingUser = await getUserBySessionToken(token);
			req.user = existingUser?._id.toString();
			next();
		}
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Unauthorized" });
	}
}
