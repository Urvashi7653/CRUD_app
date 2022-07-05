import { User } from "../../models/user.js";
import passport from "passport";

export const getRegister = (req, res)=> {
    res.render("register");
  };

export const postRegister = (req, res) => {
    User.register(
      { username: req.body.username },
      req.body.password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function () {
            res.redirect("/read");
          });
        }
      }
    );
  };