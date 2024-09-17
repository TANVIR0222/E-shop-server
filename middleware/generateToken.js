const jwt = require("jsonwebtoken");
const User = require("../model/users.model");

const jwt_secret = process.env.JWT;

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    const token = jwt.sign(
      { userId: user._id, role: user._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );
    return token;
  } catch (error) {
    console.log("Error generate Token");
    throw error;
  }
};

module.exports = generateToken;
