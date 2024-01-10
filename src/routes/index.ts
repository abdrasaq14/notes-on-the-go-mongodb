import express from "express";
import { getNoteFunction } from "../controller/noteController";
import { Response, Request } from "express";

// implementation start here
const router = express.Router();


/* GET home page. */
router.get('/', (req:Request, res:Response)=>{
    res.render("index", {})
});

export default router;
