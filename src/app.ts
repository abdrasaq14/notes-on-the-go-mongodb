import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import notesRouter from "./routes/notes";

import mongoose from "mongoose";
import dotenv from "dotenv";
interface CustomeCookieParserOptions extends cookieParser.CookieParseOptions { 
  httpOnly?: boolean;
  secure?: boolean;
}

const app = express();
dotenv.config();

const connection = process.env.MONGODB_URI as string;
mongoose
	.connect(connection)
	.then(() => console.log("connected to mongodb"))
	.catch((err: Error) => console.log(err));


// view engine setup
app.set("views", path.join(__dirname, "../../", "views"));
app.set("view engine", "ejs");
// Specify the type explicitly for the options object


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cookieParser("your-secret-key",{
		httpOnly: true,
		secure: true,
	} as CustomeCookieParserOptions) 
);
app.use(express.static(path.join(__dirname, "../../", "public")));

app.use("/", indexRouter);

// this is where cookie comes handy, kindly search how to automatically login after signup

app.use("/users", usersRouter);

app.use("/notes", notesRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(500);
//   res.send(err);
// });

module.exports = app;
