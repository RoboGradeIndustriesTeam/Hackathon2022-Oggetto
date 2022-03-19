import mongoose from "mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

const eventSchema = new mongoose.Schema({
  title: { type: String },
  desc: { type: String },
  date: { type: String },
  link: { type: String },
  organizator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    autopopulate: true,
  },
  isSecret: { type: Boolean },
  showOnlyFor: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user", autopopulate: true },
  ],
  tags: [{ type: String }],
});

eventSchema.plugin(mongooseAutoPopulate);

const event = mongoose.model("event", eventSchema);

export default event;
