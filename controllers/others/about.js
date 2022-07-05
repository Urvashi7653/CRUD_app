export const about = function (req, res) {
    if (req.isAuthenticated()){
    res.render("about_log_in");
    }else{
      res.render("about_log_out");
    }
  };
  