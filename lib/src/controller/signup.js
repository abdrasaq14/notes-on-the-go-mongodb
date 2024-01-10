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
exports.signupUserFunction = void 0;
const zod_1 = require("zod");
const noteDB_1 = require("../../schema/noteDB");
const hashPasword_1 = require("../middleware/hashPasword");
const hashPasword_2 = require("../middleware/hashPasword");
// new user schema
const newUserSchema = zod_1.z.object({
    fullname: zod_1.z
        .string({
        required_error: "fullname needs to be provided",
        invalid_type_error: "fullname needs to be a string",
    })
        .trim()
        .min(2, "fullname need to have a min length of 2")
        .max(50, "fullname need to have a max length of 50"),
    email: zod_1.z
        .string({
        required_error: "email needs to be provided",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    gender: zod_1.z.string().max(1),
    phone_no: zod_1.z.string().max(14),
    address: zod_1.z.string().min(10).max(100),
    password: zod_1.z
        .string({
        required_error: "password needs to be provided",
        invalid_type_error: "pass needs to be a string",
    })
        .min(6, "password must be at least 6 characters"),
});
const strictNewUserSchema = newUserSchema.strict();
function signupUserFunction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = strictNewUserSchema.parse(req.body);
            const { fullname, gender, email, phone_no, address, password } = validation;
            const existingUser = yield (0, noteDB_1.getUserByEmail)(email);
            //checking if the email already exists
            if (existingUser && existingUser.email === email) {
                res.render("signup", {
                    EmailExistError: `User with ${email} already exist`,
                });
            }
            else {
                // Encrypt password
                const salt = (0, hashPasword_1.random)();
                const user = yield (0, noteDB_1.createUser)({
                    fullname,
                    email,
                    address,
                    phone_no,
                    gender,
                    authentication: {
                        salt,
                        password: (0, hashPasword_2.hashPaswordAndConfirm)(salt, password),
                    },
                });
                if (user) {
                    res.render("signup", {
                        insertUserDetailIntoDatabase: `user with email ${email} has been created successfully`,
                    });
                }
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const zodErrorMessage = error.issues.map((issue) => issue.message);
                res.render("signup", { zodError: zodErrorMessage });
            }
            else if (error) {
                res.render("signup", { databaseError: error });
            }
        }
    });
}
exports.signupUserFunction = signupUserFunction;
