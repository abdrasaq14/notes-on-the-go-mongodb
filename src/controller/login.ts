import { type Response } from "express";
import { ZodError, z } from "zod";

import { type AuthenticatedRequest } from "../../express";
import { getUserByEmail } from "../../schema/noteDB";
import { hashPaswordAndConfirm, random } from "../middleware/hashPasword";

// Zod to validate
const userSchema = z.object({
	email: z
		.string({
			required_error: "email needs to be provided",
			invalid_type_error: "email needs to be a string",
		})
		.toLowerCase()
		.email(),
	password: z
		.string({
			required_error: "password needs to be provided",
			invalid_type_error: "password needs to be a string",
		})
		.min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = userSchema.strict();
export async function handleUserLogin(
	req: AuthenticatedRequest,
	res: Response,
) {
	try {
		const validation = strictNewUserSchema.parse(req.body);
		const { email, password } = validation;
		const user = await getUserByEmail(email).select(
			"+authentication.salt +authentication.password"
		);

		if (!user) {
			return res.json({
				noSuchUserError: `User with email ${email} does not exist`,
			});
		} else {
			const expectedPassword = user.authentication!.password
				? hashPaswordAndConfirm(user.authentication!.salt ?? "", password)
				: "";

			if (expectedPassword !== user.authentication?.password) {
				const invalidPassword = "Invalid password, kindly try again";
				res.json({ invalidPassword: invalidPassword });
			} else {
				const salt = random();
				if (user.authentication) {
					user.authentication.sessionToken = hashPaswordAndConfirm(
						salt,
						user._id.toString()
					);
					const token: string = user.authentication.sessionToken;
					res.cookie("token", token);
					// req.session.token = token;
				}
				await user.save();
				res.json({ loginSuccessful: "login successful" });
			}
		}
	} catch (error) {
		if (error instanceof ZodError) {
			const zodErrorMessage = error.issues.map((issue) => issue.message);
			res.json({ zodErrorMessage });
		} else if (error) {
			res.json({ unknownError: "Internal server error" });
		}
	}
}
