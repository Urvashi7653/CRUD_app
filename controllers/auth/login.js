import { User } from "../../models/user.js";
import passport from "passport";

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = (req, res) => {
  const user = new User({
    username: req.body.username,
    passport: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/read");
        console.log(user.username);
      });
    }
  });
};
