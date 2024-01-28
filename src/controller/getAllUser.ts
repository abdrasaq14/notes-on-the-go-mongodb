import { type Request, type Response } from "express";
import sqlite3 from "sqlite3";
import path from "node:path";

// my database
sqlite3.verbose();
const mydbPath = path.resolve(__dirname, "../", "usersAndNote.db");
const db = new sqlite3.Database(mydbPath, sqlite3.OPEN_READWRITE, (err: Error | null) => {
	if (err) {
		console.error(err.message);
	}
	console.log("Connected to the usersAndNote database.");
});

export function getAllUserDetail(
	req: Request,
	res: Response,
) {
	const sql = "SELECT * FROM Users";

	db.all(sql, function (err: Error, users: Record<string, string | number> []) {
		if (err) {
			console.error("Error in database operation:", err);
			return res.status(500).json({
				status: 500,
				success: false,
				error: err.message, // Provide the error message for better debugging
			});
		} else {
			console.log("All users detail gotten");
			return res.send(JSON.stringify(users, null, 2));
		}
	});
}

