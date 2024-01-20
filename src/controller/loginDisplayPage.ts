import express, { Request, Response, NextFunction } from "express";

export function loginDisplayPage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render("login", {});
}
