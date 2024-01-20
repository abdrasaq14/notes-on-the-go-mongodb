import express, { Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../middleware/jwtAuthenticate";
import {
  getIndividualNoteFunction,
  createNewNoteFunction,
  deleteNoteFunction,
  putNewNoteFunction,
} from "../controller/noteController";
import { noCache } from "../middleware/no-catching";

// implementation start here
const router = express.Router();

/* GET NOTES listing. */
//router.get("/", getNoteFunction);

// router.get("/login", getNoteFunction);
router.get("/dashboard", isAuthenticated, noCache, getIndividualNoteFunction);
router.post("/dashboard", isAuthenticated, getIndividualNoteFunction);
router.post("/dashboard/edit", isAuthenticated, putNewNoteFunction);
router.post("/dashboard/add-new-note", isAuthenticated, createNewNoteFunction);
router.post("/dashboard/delete-note", isAuthenticated, deleteNoteFunction);
// updating new notes
export default router;
