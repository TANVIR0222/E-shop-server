const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();

// middleware setup
dotenv.config();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({limite: '25mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 
const port = process.env.PORT || 3000;
const connectDB = require("./db/connectDB");

// all router 
const authRouter = require("./router/user.route");
const prodoctRouter = require("./router/product.route");
const reviewRouter = require("./router/reviews.route");




app.use('/api/auth' , authRouter)
app.use('/api/products', prodoctRouter)
app.use('/api/reviews', reviewRouter)


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
