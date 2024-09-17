const Product = require("../model/product.model");
const Reviews = require("../model/reviews.model");

const createProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body });
    const saveProduct = await product.save();

    // reviews calculate
    const reviews = Reviews.find({ productId: saveProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const avarageRating = totalRating / reviews.length;
      saveProduct.rating = avarageRating;
      await saveProduct.save();
    }

    res.status(201).json(saveProduct);
  } catch (error) {
    console.log(" Error Product post  faild :", error);
    res.status(404).send({ message: "Error Product post  faild " });
  }
};

// get all product and filteing
const getAllProduct = async (req, res) => {
  try {
    const {
      category,
      color,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    //
    let filter = {};

    if (category && category !== "alll") {
      filter.category = category;
    }

    if (color && color !== "all") {
      filter.color = color;
    }

    // price calculate min & max
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);

      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $get: min, $let: max };
      }
    }
    // bortomane kon page asche & ar ar kon kon data bad dite hobe ict
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // data base theke filtering anujayi product gonona kore/ product dekhay
    const totalProducct = await Product.countDocuments(filter);
    // ati page sngkhan gonona kore and kon page kot gula product dekhte hobe ta nidarot kore and 45 / 10 is 4.5, which Math.ceil() rounds up to 5 pages.
    const totalpage = Math.ceil(totalProducct / parseInt(limit));

    const product = await Product.find(filter)
      .skip(skip) // pagination -> jodi 2 page a thake tahole 1 page data skip kore felbe
      .limit(parseInt(limit)) // proti page a  nidist puronsokha dekhabe
      .populate("author", "email")
      .sort({ createdAt: -1 });

    // const allProuduct = await Product.find({}, "name category");
    res.status(201).json(product, totalpage, totalProducct);
  } catch (error) {
    console.log(" Error get All product faild :", error);
    res.status(404).send({ message: "Error get All product faild " });
  }
};

// get single product
const getSingleProducr = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "author",
      "email username"
    );

    if (!product) {
      res.status(404).send({ message: "Error Product Not Found " });
    }

    const reviews = await Reviews.find({ productId }).populate(
      "userId",
      "username email"
    );
    res.status(201).send({ product, reviews });
  } catch (error) {
    console.log(" Error get single  Product  faild :", error);
    res.status(404).send({ message: "Error get single  Product  faild " });
  }
};

// const update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );
    if (!updateProduct) {
      res.status(404).send({ message: "Error Product Not Found " });
    }

    res.status(201).send({ message: "update success full", updateProduct });
  } catch (error) {
    console.log(" Error update  Product  faild :", error);
    res.status(404).send({ message: "Error update  Product  faild " });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await Product.findByIdAndDelete(productId);
    if (!deleteProduct) {
      res.status(404).send({ message: "Error Product Not Found " });
    }

    // delete reviews related to product
    await Reviews.deleteMany({ productId: productId });

    res.status(201).send({ message: "delete success full", deleteProduct });
  } catch (error) {
    console.log(" Error delete  Product  faild :", error);
    res.status(404).send({ message: "Error delete  Product  faild " });
  }
};

// related  product
const relatedProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(404).send({ message: " Product Id is required " });
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).send({ message: "Error Product Not Found " });
    }

    //
    const titleRegex = new RegExp( // 1 word ar sathe onnow 1 word ar kicu mit khuje berkra 
      product.name
        .split(" ") //  product.name is "Red Apple Juice", the result of .split(" ") would be: ["Red", "Apple", "Juice"]
        .filter((word) => word.length > 1)
        .join("|"), // alada alada word ke ak sathe  ["Red", "Apple", "Juice"] becomes "Red|Apple|Juice"
      "i" // the end
    );

    const relatedProduct = await Product.find({
      _id: { $ne: id }, // $ne is a MongoDB query operator meaning "not equal." & ai id chara annow relatibe  id gula ke khuje 
      $or: [{ name: { $regex: titleRegex } }, { category: product.category }], // name and category uopre nirbor kore khuje 
    }); 

    res.status(201).send(relatedProduct);
  } catch (error) {
    console.log(" Error Related  Product  faild :", error);
    res.status(404).send({ message: "Error Related  Product  faild " });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  getSingleProducr,
  updateProduct,
  deleteProduct,
  relatedProduct,
};
