import { Request, Response } from "express";
import { ZodError, z } from "zod";
import { createUser, getUserByEmail } from "../../schema/noteDB";
import { random } from "../middleware/hashPasword";
import { hashPaswordAndConfirm } from "../middleware/hashPasword";

// new user schema
const newUserSchema = z.object({
	fullname: z
		.string({
			required_error: "fullname needs to be provided",
			invalid_type_error: "fullname needs to be a string",
		})
		.trim()
		.toUpperCase()
		.min(2, "fullname need to have a min length of 2")
		.max(50, "fullname need to have a max length of 50"),
	email: z
		.string({
			required_error: "email needs to be provided",
			invalid_type_error: "email needs to be a string",
		})
		.toLowerCase()
		.email(),

	phone_no: z.string().max(14),

	password: z
		.string({
			required_error: "password needs to be provided",
			invalid_type_error: "pass needs to be a string",
		})
		.min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = newUserSchema.strict();

export async function signupUserFunction(req: Request, res: Response) {
	try {
		const validation = strictNewUserSchema.parse(req.body);
		const { fullname, email, phone_no, password } = validation;
		const existingUser = await getUserByEmail(email);

		//checking if the email already exists
		if (existingUser && existingUser.email === email) {
			res.json({
				EmailExistError: "User with email already exist",
			});
		} else {
			const salt = random();
			const user = await createUser({
				fullname,
				email,
				phone_no,
				authentication: {
					salt,
					password: hashPaswordAndConfirm(salt, password),
				},
			});
			if (user) {
				res.json({
					insertUserDetailIntoDatabase: "Account created successfully",
				});
			} else {
				res.json({
					unableToSignYouUp: "Unable to signup you now, try again",
				});
			}
		}
	} catch (error) {
		console.log("error", error);

		if (error instanceof ZodError) {
			const zodErrorMessage = error.issues.map((issue) => issue.message);
			res.json({ zodErrorMessage });
		} else if (error) {
			res.json({ unknownError: "Internal server error" });
		}
	}
}
