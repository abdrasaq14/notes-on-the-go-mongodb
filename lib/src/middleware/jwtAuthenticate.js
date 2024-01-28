"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const noteDB_1 = require("../../schema/noteDB");
function isAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            console.log("token", token);
            if (!token) {
                return res.redirect("/users/login");
            }
            else {
                const existingUser = yield (0, noteDB_1.getUserBySessionToken)(token);
                req.user = existingUser === null || existingUser === void 0 ? void 0 : existingUser._id.toString();
                next();
            }
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized" });
        }
    });
}
exports.isAuthenticated = isAuthenticated;
