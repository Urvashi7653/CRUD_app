import mongoose from "mongoose"
 
export const itemsSchema = {
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

  //Creating model
export const Item = new mongoose.model("Item", itemsSchema);


export default {Item}
  