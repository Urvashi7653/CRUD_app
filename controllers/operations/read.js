import { Item } from "../../models/item.js";

export const read = function (req, res) {
  if (req.isAuthenticated()) {
    Item.find({ userID: req.user._id }, function (err, foundItems) {
      res.render("read", {
        listItems: foundItems,
      });
    });
  } else {
    res.redirect("/login");
    console.log("Not registered");
  }
};
