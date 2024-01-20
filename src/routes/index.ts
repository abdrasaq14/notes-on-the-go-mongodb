import express from "express";
import { displayIndex } from "../controller/indexDisplay";
// implementation start here
const router = express.Router();

/* GET home page. */
router.get("/", displayIndex);

export default router;
