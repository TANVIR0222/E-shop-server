const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    profileImage: {
      type: String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },

    bio: {
      type: String,
      maxlength: 500,
    },
    profession: String,
  },
  { timestamps: true }
);

// hash pass
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const hashPass = await bcrypt.hash(user.password, 10);
  user.password = hashPass;

  next();
});

// match password
userSchema.methods.comparePassword = function (userPass) {
  return bcrypt.compare(userPass, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
