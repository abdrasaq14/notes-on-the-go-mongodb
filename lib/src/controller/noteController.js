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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteFunction = exports.putNewNoteFunction = exports.createNewNoteFunction = exports.getIndividualNoteFunction = exports.getNoteFunction = void 0;
const zod_1 = require("zod");
const noteDB_1 = require("../../schema/noteDB");
/* GET ALL NOTES listing (HOMEPAGE). */
function getNoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT * FROM Notes`;
        try {
            // const notes = await new Promise<any[]>((resolve, reject) => {
            //   db.all(sql, function (err: Error, notes: any[]) {
            //     if (err) {
            //       reject(err); // Reject with the error
            //     } else {
            //       resolve(notes); // Resolve with the data
            //     }
            //   });
            // });
            //res.render("notes", { notes });
        }
        catch (error) {
            res.render("notes", { error }); // Render an error message
        }
    });
}
exports.getNoteFunction = getNoteFunction;
/* GET ALL NOTES listing (HOMEPAGE). */
function getIndividualNoteFunction(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = (_a = req.user) !== null && _a !== void 0 ? _a : "";
            const individualNotes = yield (0, noteDB_1.getNotesByAuthorId)(userId);
            const userDetail = yield (0, noteDB_1.getUserById)(userId);
            const extractNoteId = individualNotes.map((note) => {
                var _a;
                const noteid = ((_a = note._id) !== null && _a !== void 0 ? _a : "").toString();
                const _b = note.toObject(), { _id } = _b, rest = __rest(_b, ["_id"]); // Use toObject() to convert Mongoose document to plain JavaScript object
                return Object.assign(Object.assign({ _id }, rest), { noteid });
            });
            console.log("extractNoteId", extractNoteId);
            res.render("dashboard", {
                individualNotes,
                userDetail,
            });
        }
        catch (error) {
            console.log("error", error);
        }
    });
}
exports.getIndividualNoteFunction = getIndividualNoteFunction;
// zod to validate new input
const notesObjectSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        required_error: "Title needs to be provided",
        invalid_type_error: "Title needs to be a string",
    })
        .trim()
        .min(2, "Title need to have a min length of 2")
        .max(200, "Title need to have a max length of 200"),
    description: zod_1.z.string(),
    due_date: zod_1.z.string().trim(),
    status: zod_1.z
        .string({
        required_error: "kindly indicate the status",
    })
        .max(14),
});
const strictNoteObjectSchema = notesObjectSchema.strict();
// new note middle control
const createNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = strictNoteObjectSchema.parse(req.body);
        const { title, description, due_date, status } = validation;
        const userId = req.user;
        console.log("userId", userId);
        if (userId === undefined) {
            const undefinedUserId = `userId undefined, I don't know how you get here`;
            res.json({ message: undefinedUserId });
        }
        else {
            const noteObject = {
                title,
                description,
                due_date,
                status,
                author: userId,
            };
            const createNewNote = yield (0, noteDB_1.createNote)(noteObject);
            res.redirect("/notes/dashboard");
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const zodErrorMessage = error.issues.map((issue) => issue.message);
        }
        else if (error) {
        }
    }
});
exports.createNewNoteFunction = createNewNoteFunction;
// zod to validate new input
const putNotesObjectSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        required_error: "Title needs to be provided",
        invalid_type_error: "Title needs to be a string",
    })
        .trim()
        .min(2, "Title need to have a min length of 2")
        .max(200, "Title need to have a max length of 200"),
    description: zod_1.z.string(),
    due_date: zod_1.z.string().trim(),
    status: zod_1.z
        .string({
        required_error: "kindly indicate the status",
    })
        .max(14),
});
//const strictPutNotesObjectSchema = putNotesObjectSchema.strict();
// new note middle control
const putNewNoteFunction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = putNotesObjectSchema.parse(req.body);
        const { title, description, due_date, status } = validation;
        const noteId = req.body.noteId;
        const updateNotesObject = {
            title,
            description,
            due_date,
            status,
        };
        const editNote = yield (0, noteDB_1.updateNotesById)(noteId, updateNotesObject);
        console.log("editNote", editNote);
        res.redirect("/notes/dashboard");
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            console.log("1. error", error);
            const zodErrorMessage = error.issues.map((issue) => issue.message);
            res.render("dashboard", { zodError: zodErrorMessage });
        }
        else if (error) {
            console.log("2. error", error);
            res.render("dashboard", { error });
        }
    }
});
exports.putNewNoteFunction = putNewNoteFunction;
function deleteNoteFunction(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { noteId } = req.body;
            console.log("noteId", noteId);
            const deleteNote = yield (0, noteDB_1.deleteNotesById)(noteId);
            const sql = `DELETE FROM Notes WHERE NoteCode = ?`;
            // const deletedNotes = await new Promise((resolve, reject) => {
            //   db.run(sql, [noteId], function (err: Error) {
            //     if (err) {
            //       reject(err); // Reject with the error
            //     } else {
            //       resolve(`note with ${noteId} deleted successfully`); // Resolve with the data
            //     }
            //   });
            // });
            //res.render("dashboard", { deletedNote: deletedNotes });
            // Attach the user to the request for further use
        }
        catch (error) {
            res.render("dashboard", { deletingError: error }); // Render an error message
        }
    });
}
exports.deleteNoteFunction = deleteNoteFunction;
