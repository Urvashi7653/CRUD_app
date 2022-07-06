import { Item } from "../../models/item.js";

export const deleteItem = function (req, res) {
  const ItemId = req.body.deleteButton;
  Item.findByIdAndRemove(ItemId, function (err) {
    if (!err) {
      console.log(ItemId);
    }
    res.redirect("/read");
  });
};
