import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import { error } from "console";
import { Session, SessionData } from "express-session";
import jwt from "jsonwebtoken";
import path from "node:path";
import { AuthenticatedRequest } from "../../express";
import { getUserByEmail } from "../../schema/noteDB";
import { hashPaswordAndConfirm, random } from "../middleware/hashPasword";

// Zod to validate
const userSchema = z.object({
  email: z
    .string({
      required_error: "email needs to be provided",
      invalid_type_error: "email needs to be a string",
    })
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
  next: NextFunction
) {
  try {
    const validation = strictNewUserSchema.parse(req.body);
    const { email, password } = validation;
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.render("login", {
        noSuchUserError: `User with email ${email} does not exist,`,
      });
    } else {
      const expectedPassword = user.authentication!.password
        ? hashPaswordAndConfirm(user.authentication!.salt ?? "", password)
        : "";
      console.log("expectedPassword", expectedPassword);
      if (expectedPassword !== user.authentication?.password) {
        return res.render("login", {
          invalidPassword: `Invalid password, kindly try again`,
        });
      } else {
        const salt = random();
        if (user.authentication) {
          user.authentication.sessionToken = hashPaswordAndConfirm(
            salt,
            user._id.toString()
          );
          const token: string = user.authentication.sessionToken;
          req.session.token = token;
        }
        await user.save();
        res.redirect("/notes/dashboard");
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
      res.render("login", { zodError: zodErrorMessage });
    } else if (error) {
      res.render("login", { error });
    }
  }
}
