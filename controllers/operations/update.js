import { Item } from "../../models/item.js";
import { validationResult } from "express-validator";

export const getUpdate = async function (req, res) {
  const item = await Item.findById({ _id: req.params.id });
  res.render("update", { item: item });
};

export const postUpdate = async function (req, res) {
  const item_id = req.params.id;
  const item = await Item.findById({ _id:item_id });
  const errors = validationResult(req);
  const alert = errors.array();

  if (!errors.isEmpty()) {
    console.log(alert);
    return res.render("update",{item,alert});
  }

  if (errors.isEmpty()){
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
}};
