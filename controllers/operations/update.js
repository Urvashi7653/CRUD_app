
import { Item } from "../../models/item.js";
import { validationResult} from "express-validator";

export const getUpdate =async function (req, res) {
    const item = await Item.findById({ _id: req.params.id });
    res.render("update", { item: item });
  };

export const postUpdate =  (req, res) => {
    const errors = validationResult(req);
    const alert = errors.array();
    const item = req.params.id;
    if (!errors.isEmpty()) {
      console.log(alert);
      return res.render("update/:id", { item, alert });
    }

    Item.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.listTitle,
        description: req.body.listDesc,
        status: req.body.listStatus,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log(docs);
        }
      }
    );
    res.redirect("/read");
  };