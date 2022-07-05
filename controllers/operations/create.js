import { Item } from "../../models/item.js";
import { validationResult} from "express-validator";

export const getCreate =(req, res) =>{
    if (req.isAuthenticated()) {
      const message = req.flash("flashmessage");
      res.render("create", { message });
    } else {
      res.redirect("/login");
    }
  };

  export const postCreate = 
//   [
//     check("listTitle", "Title can have maximum 15 characters.").isLength({
//       max: 15,
//     }),
//     check("listTitle", "Title must be present.").notEmpty(),
//     check("listDesc", "Description must be present").notEmpty(),
//   ],
 async function (req, res) {
    const errors = validationResult(req);
    const alert = errors.array();
    const a = await Item.findOne({ title: req.body.listTitle });

    if (a) {
      console.log(alert);
      return res.render("create", { alert: [{ msg: "Title already exists" }] });
    }
    if (!errors.isEmpty()) {
      console.log(alert);
      return res.render("create", { alert });
    }

    if (errors.isEmpty()) {
      const newItem = new Item({
        title: req.body.listTitle,
        description: req.body.listDesc,
        status: req.body.listStatus,
      });

      newItem.save();
    }
    req.flash("flashmessage", "Successfully added to database!");
    res.redirect("/create");
  }
;
