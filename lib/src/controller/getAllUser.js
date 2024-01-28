"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserDetail = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const node_path_1 = __importDefault(require("node:path"));
// my database
sqlite3_1.default.verbose();
const mydbPath = node_path_1.default.resolve(__dirname, "../", "usersAndNote.db");
const db = new sqlite3_1.default.Database(mydbPath, sqlite3_1.default.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the usersAndNote database.");
});
function getAllUserDetail(req, res) {
    const sql = "SELECT * FROM Users";
    db.all(sql, function (err, users) {
        if (err) {
            console.error("Error in database operation:", err);
            return res.status(500).json({
                status: 500,
                success: false,
                error: err.message, // Provide the error message for better debugging
            });
        }
        else {
            console.log("All users detail gotten");
            return res.send(JSON.stringify(users, null, 2));
        }
    });
}
exports.getAllUserDetail = getAllUserDetail;
