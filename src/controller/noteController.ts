import { Request, Response, NextFunction } from "express";
import { ZodError, z } from "zod";
import { AuthenticatedRequest } from "../../express";
import path from "node:path";
import {
  getNotesById,
  getUserById,
  createNote,
  getNotesByAuthorId,
  updateNotesById,
  getRestaurantByName,
  RestaurantModel,
  deleteNotesById,
} from "../../schema/noteDB";
import { notesInterface, userInterface } from "../../schema/noteDB";
/* GET ALL NOTES listing (HOMEPAGE). */

export async function getNoteFunction(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
  } catch (error) {
    res.render("notes", { error }); // Render an error message
  }
}

/* GET ALL NOTES listing (HOMEPAGE). */

export async function getIndividualNoteFunction(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
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
    console.log("extractNoteId", extractNoteId);
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
      const createNewNote = await createNote(noteObject);
      res.redirect("/notes/dashboard");
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
  res: Response,
  next: NextFunction
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
  res: Response,
  next: NextFunction
) {
  try {
    const { noteId } = req.body;
    console.log("noteId", noteId);
    const deleteNote = await deleteNotesById(noteId);
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
  } catch (error) {
    res.render("dashboard", { deletingError: error }); // Render an error message
  }
}
