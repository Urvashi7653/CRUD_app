//require modules
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth-routes.js"
import operations from "./routes/operations.js"
import others from "./routes/others.js"
import {User} from "./models/user.js"

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
app.use(passport.initialize());            //initialising passport
app.use(passport.session());
app.use("",authRoutes);
app.use("",operations);
app.use("",others);


//make connection to mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//listening app
app.listen(7000, (err) => {
  if (err) console.log(err);
  console.log("Server is up and listening on port 7000");
});
