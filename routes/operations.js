import express from "express";
import { read } from "../controllers/operations/read.js";
import { getCreate, postCreate } from "../controllers/operations/create.js";
import { getUpdate, postUpdate } from "../controllers/operations/update.js";
import { deleteItem } from "../controllers/operations/delete.js";
import { body} from "express-validator";
import { Item} from "../models/item.js"

const router = express.Router();

router.get("/read", read);
router.get("/create", getCreate);
router.get("/update/:id",getUpdate);
router.post(
  "/create",
  [
    body("listTitle", "Title can have maximum 15 characters.").isLength({
      max: 15,
    }),
    body("listTitle", "Title must be present.").notEmpty(),
    body("listDesc", "Description must be present").notEmpty(),
  ],
  postCreate
);
router.post("/update/:id",  [
  body("listTitle", "Title can have maximum 15 characters.").isLength({
    max: 15,
  }),
  body("listTitle", "Title must be present.").notEmpty(),
  body("listDesc", "Description must be present").notEmpty(),
  body("listTitle").custom(value=>{
    return Item.findOne({listTitle:value})
    .then(listItem =>{
      if(!listItem){
        return Promise.reject("Title already in use")
      }
    })
  })
] ,postUpdate);
router.post("/delete", deleteItem);

export default router;