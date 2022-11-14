import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String },
  id: { type: String },
  picture: { type: String },
  folderId: { type: String },
  uploads: [
    {
      fileId: { type: String },
      name: { type: String },
      uploadedAt: { type: Date, default: Date.now },
      fileSize: { type: String },
      type: { type: String },
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
