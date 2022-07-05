import { Item } from "../../models/item.js";

//creating default list items
const item1 = new Item({
  title: "Coding hour",
  description: "Practice coding",
  status: "In progress",
});

const item2 = new Item({
  title: "Yoga class",
  description: "Practice in morning",
  status: "Done",
});

const item3 = new Item({
  title: "Sleep",
  description: "Sleep atleast 8 hours",
  status: "Not started",
});

const defaultItems = [item1, item2, item3];

export const read =function (req, res) {
    if (req.isAuthenticated()) {
      Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
          Item.insertMany(defaultItems, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log("Default items added");
            }
            return res.redirect("/read");
          });
        } else {
          res.render("read", {
            listItems: foundItems,
          });
        }
      });
    } else {
      res.redirect("/login");
      console.log("Not registered");
    }
  };
  