import express from "express";
import { getLogin, postLogin } from "../controllers/auth/login.js";
import { getRegister, postRegister } from "../controllers/auth/register.js";
import { logout } from "../controllers/auth/logout.js";
//import {googleLoginPage} from "../controllers/auth/googleLoginPage.js"
//import {googleAuth} from "../controllers/auth/googleAuth.js"

const router = express.Router();

router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout", logout);
router.post("/login", postLogin);
router.post("/register", postRegister);
//router.get('/auth/google',googleLoginPage);
//router.get('/auth/google/CRUD',googleAuth)

export default router;
