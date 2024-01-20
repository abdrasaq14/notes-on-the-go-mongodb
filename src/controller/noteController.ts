import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AuthenticatedRequest } from "../../express";

import {
  getUserById,
  createNote,
  getNotesByAuthorId,
  updateNotesById,
  deleteNotesById,
} from "../../schema/noteDB";

export async function getIndividualNoteFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user ?? "";
    const individualNotes = await getNotesByAuthorId(userId);
    const userDetail = await getUserById(userId);
    const extractNoteId = individualNotes.map((note) => {
      const noteid = (note._id ?? "").toString();
      const { _id, ...rest } = note.toObject(); // Use toObject() to convert Mongoose document to plain JavaScript object
      return { _id, ...rest, noteid };
    });

    res.render("dashboard", {
      individualNotes,
      userDetail,
    });
  } catch (error) {
    console.log("error", error);
  }
}

// zod to validate new input
const notesObjectSchema = z.object({
  title: z
    .string({
      required_error: "Title needs to be provided",
      invalid_type_error: "Title needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "Title need to have a max length of 200"),
  description: z.string(),
  due_date: z.string().trim(),
  status: z
    .string({
      required_error: "kindly indicate the status",
    })
    .max(14),
});
const strictNoteObjectSchema = notesObjectSchema.strict();

// new note middle control
export const createNewNoteFunction = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = strictNoteObjectSchema.parse(req.body);
    const { title, description, due_date, status } = validation;
    const userId = req.user;
    console.log("userId", userId);
    if (userId === undefined) {
      const undefinedUserId = `userId undefined, I don't know how you get here`;
      res.json({ message: undefinedUserId });
    } else {
      const noteObject = {
        title,
        description,
        due_date,
        status,
        author: userId,
      };
      await createNote(noteObject);
      res.json({ createNewNote: "new note created" });
      // res.redirect("/notes/dashboard");
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const zodErrorMessage = error.issues.map((issue) => issue.message);
    } else if (error) {
    }
  }
};

// zod to validate new input
const putNotesObjectSchema = z.object({
  title: z
    .string({
      required_error: "Title needs to be provided",
      invalid_type_error: "Title needs to be a string",
    })
    .trim()
    .min(2, "Title need to have a min length of 2")
    .max(200, "Title need to have a max length of 200"),
  description: z.string(),
  due_date: z.string().trim(),
  status: z
    .string({
      required_error: "kindly indicate the status",
    })
    .max(14),
});
//const strictPutNotesObjectSchema = putNotesObjectSchema.strict();

// new note middle control
export const putNewNoteFunction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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
    const editNote = await updateNotesById(noteId, updateNotesObject);
    console.log("editNote", editNote);
    res.redirect("/notes/dashboard");
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("1. error", error);
      const zodErrorMessage = error.issues.map((issue) => issue.message);
      res.render("dashboard", { zodError: zodErrorMessage });
    } else if (error) {
      console.log("2. error", error);
      res.render("dashboard", { error });
    }
  }
};

export async function deleteNoteFunction(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { noteid } = req.body;
    console.log("noteId", noteid);
    const deleteNote = await deleteNotesById(noteid);
    console.log("deleteNote", deleteNote);
    res.redirect("/notes/dashboard");
  } catch (error) {
    res.render("dashboard", { deletingError: error }); // Render an error message
  }
}
