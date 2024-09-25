const express = require("express");
const {
  createProduct,
  getAllProduct,
  getSingleProducr,
  updateProduct,
  deleteProduct,
  relatedProduct,
} = require("../controllers/product.controller");
const veryfyAdmin = require("../middleware/veryfiAdmin");
const router = express.Router();

router.post("/create-product", createProduct);
router.get("/", getAllProduct);
router.get("/:id", getSingleProducr);
router.patch("/update-product/:id", veryfyAdmin, updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.get("/related/:id", relatedProduct);

module.exports = router;
