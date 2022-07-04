//require modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { validationResult, check, body } = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const port = process.env.PORT || 7000;
const app = express();

//use modules
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(flash());
app.use(
  session({
    secret: "ThisIsUrvashi'sSecret",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//make connection to mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB");

//Creating schema for user and list item
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const itemsSchema = {
  title: {
    type: String,
    required: [true, "Must add title"],
  },
  description: {
    type: String,
    required: [true, "Must describe"],
  },
  status: {
    type: String,
    enum: ["In progress", "Not started", "Done"],
    required: [true, "What is the status"],
  },
};


userSchema.plugin(passportLocalMongoose);

//Creating model
const Item = new mongoose.model("Item", itemsSchema);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

/**************************MAKING GET REQUESTS****************************************/
//Home page
app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
  res.render("home_log_in");
  }else{
    res.render("home_log_out");
  }
});

//Login page
app.get("/login", function (req, res) {
  res.render("login");
});

//Register page
app.get("/register", function (req, res) {
  res.render("register");
});

//Read page
app.get("/read", function (req, res) {
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
});

//Create page
app.get("/create", function (req, res) {
  if (req.isAuthenticated()) {
    const message = req.flash("flashmessage");
    res.render("create", { message });
  } else {
    res.redirect("/login");
  }
});

//Update page
app.get("/update/:id", async function (req, res) {
  const item = await Item.findById({ _id: req.params.id });
  res.render("update", { item: item });
});

//About page
app.get("/about", function (req, res) {
  if (req.isAuthenticated()){
  res.render("about_log_in");
  }else{
    res.render("about_log_out");
  }
});

//For logging out
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("home_log_out");
  });
});

/**********************************MAKING POSTS REQUESTS*********************************/

//For registration
app.post("/register", function (req, res) {
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
});


//For login
app.post("/login", function (req, res) {
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
      });
    }
  });
});


//For creation
app.post(
  "/create",
  [
    check("listTitle", "Title can have maximum 15 characters.").isLength({
      max: 15,
    }),
    check("listTitle", "Title must be present.").notEmpty(),
    check("listDesc", "Description must be present").notEmpty(),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    const alert = errors.array();
    const a = await Item.findOne({ title: req.body.listTitle });

    if (a) {
      console.log(alert);
      return res.render("create", { alert: [{ msg: "Title already exists" }] });
    }
    if (!errors.isEmpty()) {
      console.log(alert);
      return res.render("create", { alert });
    }

    if (errors.isEmpty()) {
      const newItem = new Item({
        title: req.body.listTitle,
        description: req.body.listDesc,
        status: req.body.listStatus,
      });

      newItem.save();
    }
    req.flash("flashmessage", "Successfully added to database!");
    res.redirect("/create");
  }
);


//For updating
app.post(
  "/update/:id",
  [
    check("listTitle", "Title can have maximum 15 characters.").isLength({
      max: 15,
    }),
    body("listTitle", "Title must be present.").notEmpty(),
    check("listDesc", "Description must be present").notEmpty(),
  ],
  function (req, res) {
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
  }
);


//For deleting
app.post("/delete", function (req, res) {
  const ItemId = req.body.deleteButton;
  Item.findByIdAndRemove(ItemId, function (err) {
    if (!err) {
      console.log(ItemId);
    }
    res.redirect("/read");
  });
});


//listening app
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server is up and listening on", port);
});
