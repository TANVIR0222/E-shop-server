const mongoose = require("mongoose");

const connectDB = () => {
  try {
    mongoose
      .connect( process.env.DB)
      .then(() => console.log("connect mongoose "));
  } catch (error) {
    console.log("connect failed mongoose ");
  }
};

module.exports = connectDB;
