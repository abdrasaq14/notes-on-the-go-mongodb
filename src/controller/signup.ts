import createError from "http-errors";
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
    .min(2, "fullname need to have a min length of 2")
    .max(50, "fullname need to have a max length of 50"),
  email: z
    .string({
      required_error: "email needs to be provided",
      invalid_type_error: "email needs to be a string",
    })
    .email(),
  gender: z.string().max(1),
  phone_no: z.string().max(14),
  address: z.string().min(10).max(100),
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
    const { fullname, gender, email, phone_no, address, password } = validation;
    const existingUser = await getUserByEmail(email);
    
    //checking if the email already exists
    if (existingUser && existingUser.email === email) {
      res.render("signup", {
        EmailExistError: `User with ${email} already exist`,
      });
    } else {
      // Encrypt password
      const salt = random();
      const user = await createUser({
        fullname,
        email,
        address,
        phone_no,
        gender,
        authentication: {
          salt,
          password: hashPaswordAndConfirm(salt, password),
        },
      });
      if (user) {
        res.render("signup", {
          insertUserDetailIntoDatabase: `user with email ${email} has been created successfully`,
        });
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
      res.render("signup", { zodError: zodErrorMessage });
    } else if (error) {
      res.render("signup", { databaseError: error });
    }
  }
}
