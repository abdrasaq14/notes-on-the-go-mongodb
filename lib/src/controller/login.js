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
exports.handleUserLogin = void 0;
const zod_1 = require("zod");
const noteDB_1 = require("../../schema/noteDB");
const hashPasword_1 = require("../middleware/hashPasword");
// Zod to validate
const userSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    password: zod_1.z
        .string({
        required_error: "password needs to be provided",
        invalid_type_error: "password needs to be a string",
    })
        .min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = userSchema.strict();
function handleUserLogin(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = strictNewUserSchema.parse(req.body);
            const { email, password } = validation;
            const user = yield (0, noteDB_1.getUserByEmail)(email).select("+authentication.salt +authentication.password");
            if (!user) {
                return res.json({
                    noSuchUserError: `User with email ${email} does not exist`,
                });
            }
            else {
                const expectedPassword = user.authentication.password
                    ? (0, hashPasword_1.hashPaswordAndConfirm)((_a = user.authentication.salt) !== null && _a !== void 0 ? _a : "", password)
                    : "";
                if (expectedPassword !== ((_b = user.authentication) === null || _b === void 0 ? void 0 : _b.password)) {
                    const invalidPassword = `Invalid password, kindly try again`;
                    res.json({ invalidPassword: invalidPassword });
                }
                else {
                    const salt = (0, hashPasword_1.random)();
                    if (user.authentication) {
                        user.authentication.sessionToken = (0, hashPasword_1.hashPaswordAndConfirm)(salt, user._id.toString());
                        const token = user.authentication.sessionToken;
                        req.session.token = token;
                    }
                    yield user.save();
                    res.json({ loginSuccessful: "login successful" });
                }
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const zodErrorMessage = error.issues.map((issue) => issue.message);
                res.render("login", { zodError: zodErrorMessage });
            }
            else if (error) {
                res.render("login", { error });
            }
        }
    });
}
exports.handleUserLogin = handleUserLogin;
