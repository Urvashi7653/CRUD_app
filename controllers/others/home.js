export const homePage = function (req, res) {
    if (req.isAuthenticated()) {
    res.render("home_log_in");
    }else{
      res.render("home_log_out");
    }
  };