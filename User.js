import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  UserHighScore: {
    type: [Number],
    required: false,
    default: [0, 0, 0],
  },
  ComputerHighScore: {
    type: [Number],
    required: false,
    default: [0, 0, 0],
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
