//require modules
import express from "express";
import {} from 'dotenv/config'          
import bodyParser from "body-parser";
import mongoose from "mongoose";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/auth-routes.js"
import operations from "./routes/operations.js"
import others from "./routes/others.js"
import {User} from "./models/user.js"
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import findOrCreate from "mongoose-findorcreate"

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
passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(null,user);
  });
});

 passport.use(new GoogleStrategy({
   clientID: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
   callbackURL: "http://localhost:7000/auth/google/CRUD",
   userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
 },
 function(accessToken, refreshToken, profile, cb) {
  console.log(profile)
   User.findOrCreate({ googleId: profile.id }, function (err, user) {
     return cb(err, user);
   });
 }));

 app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/CRUD', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/read');
  });

//listening app
app.listen(7000, (err) => {
  if (err) console.log(err);
  console.log("Server is up and listening on port 7000");
});
