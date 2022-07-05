export const logout =(req, res, next)=> {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.render("home_log_out");
    });
  };