import express from "express";
import { read } from "../controllers/operations/read.js";
import { getCreate, postCreate } from "../controllers/operations/create.js";
import { getUpdate, postUpdate } from "../controllers/operations/update.js";
import { deleteItem } from "../controllers/operations/delete.js";
import { check} from "express-validator";

const router = express.Router();

router.get("/read", read);
router.get("/create", getCreate);
router.get("/update/:id", getUpdate);
router.post(
  "/create",
  [
    check("listTitle", "Title can have maximum 15 characters.").isLength({
      max: 15,
    }),
    check("listTitle", "Title must be present.").notEmpty(),
    check("listDesc", "Description must be present").notEmpty(),
  ],
  postCreate
);
router.post("/update/:id", postUpdate);
router.post("/delete", deleteItem);

export default router;
