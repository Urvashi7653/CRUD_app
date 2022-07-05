import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose";

export const userSchema = new mongoose.Schema({
    email: String,
    password: String,
  });

userSchema.plugin(passportLocalMongoose);
  
export const User = new mongoose.model("User", userSchema);

export default {User}
  