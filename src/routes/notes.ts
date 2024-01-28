import express from "express";
import { isAuthenticated } from "../middleware/jwtAuthenticate";
import {
	getIndividualNoteFunction,
	createNewNoteFunction,
	deleteNoteFunction,
	putNewNoteFunction,
	getAllNotesFunction,
} from "../controller/noteController";
import { noCache } from "../middleware/no-catching";

// implementation start here
const router = express.Router();

/* GET NOTES listing. */
router.get("/", getAllNotesFunction);

router.use(isAuthenticated);
router.get("/dashboard", noCache, getIndividualNoteFunction);
router.post("/dashboard", getIndividualNoteFunction);
router.post("/dashboard/edit", putNewNoteFunction);
router.post("/dashboard/add-new-note", createNewNoteFunction);
router.post("/dashboard/delete-note", deleteNoteFunction);
// updating new notes
export default router;
