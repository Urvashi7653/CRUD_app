import express from "express"
import {getLogin,postLogin} from "../controllers/auth/login.js"
import {getRegister,postRegister } from "../controllers/auth/register.js"
import {logout} from "../controllers/auth/logout.js"


const router = express.Router();

router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout",logout);
router.post("/login", postLogin);
router.post("/register", postRegister);

export default router;
