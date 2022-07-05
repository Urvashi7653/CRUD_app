import express from "express"
import { homePage } from "../controllers/others/home.js"
import { about } from "../controllers/others/about.js"

const router = express.Router();

router.get("/", homePage);
router.get("/about", about);

export default router;