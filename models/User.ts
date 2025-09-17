import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

//interaface to define type for user model 
export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

//hash password before saving user document. Pre hooks are executed before db calls
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//written conditionally because of how Next.js hot-reloads.In development, Next.js reloads files multiple times.checks if User model is already compiled in mongoose.models. If it exists, reuse it (so you don’t redefine the model).If it doesn’t exist, define a new one

const User = models?.User || model<IUser>("User", userSchema);

export default User;