const Product = require("../model/product.model");
const Reviews = require("../model/reviews.model");

const review = async (req, res) => {
  try {
    const { comment, rating, userId, productId } = req.body;

    if (!comment || !rating || !userId || !productId) {
      return res.status(404).json({ message: "All fileds are required" });
    }
    const existingReview = await Reviews.findOne({ userId, productId });

    if (existingReview) {
      // update reviews
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Reviews({ comment, rating, userId, productId });
      await newReview.save();
    }

    //cal avarage rating
    const reviews = await Reviews.find({ productId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      const product = await Product.findById(productId);
      if (product) {
        product.averageRating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else {
        return res.status(404).json({ message: "Product Not Found" });
      }
    }
    return res.status(201).json({ message: "Review Processed successfull" });
  } catch (error) {
    console.log("Error post reviews", error);
    res.status(404).json({ message: "Error post reviews" });
  }
};

// get all reviews with count
const getReviews = async (req, res) => {
  try {
    const totalReview = await Reviews.countDocuments({});
    res.send({ totalReview });
  } catch (error) {
    console.log("Error total reviews", error);
    res.status(404).json({ message: "Error total reviews" });
  }
};

const getReviewsById = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({ message: "User ID is required" });
  }
  try {
    const reviews = await Reviews.find({ userId }).sort({createdAt : -1});
    if(reviews.length === 0){
        return res.status(404).json({ message: "No reviews found" });
    }
    res.json(reviews);
  } catch (error) {
    console.log("Error total reviews", error);
    res.status(404).json({ message: "Error total reviews" });
  }
};

module.exports = { review, getReviews, getReviewsById };
