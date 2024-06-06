const productSchema = require("./schema");
const userSchema = require("../Users/schema");

const addProduct = async (req, res) => {
  const { name, price, category, description, location, type, images } =
    req.body;

  try {
    if (
      name &&
      price &&
      category &&
      description &&
      location &&
      type &&
      images
    ) {
      const checkProduct = await productSchema.exists({ name });

      if (checkProduct) {
        res.status(400).json({ message: "Product already exists" });
      } else {
        const createProduct = await productSchema.create({
          name,
          price,
          category,
          description,
          location,
          type,
          images,
        });

        console.log(createProduct);

        return res.status(201).json({
          message: "Product created Successfully",
          createProduct,
        });
      }
    } else {
      res.status(422).json({ message: "Required Field Missing" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const yourPost = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (user) {
      const allProducts = await productSchema.find();
      res.status(200).json({ message: "Your Post", allProducts });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { _id, name, price, description, category, image1 } = req.body;
  try {
    const filter = { _id };
    const update = { name, price, description, category, image1 };
    const updatedProduct = await productSchema.findOneAndUpdate(
      filter,
      update,
      { new: true }
    );
    if (updatedProduct) {
      res
        .status(201)
        .json({ message: "Product Updated Successfully", updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    res.status(404).json({ message: "Product not found" });
  } else {
    try {
      await productSchema.findOneAndDelete({ _id });
      const allProducts = await productSchema.find();
      res.status(201).json({
        message: "Product Deleted Successfully",
        Products: allProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await productSchema.find();
    res.status(200).json({ Products: products });
    if (!products) {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchProduct = async (req, res) => {
  const { name, category, location } = req.query;
  console.log(category, location, name);

  try {
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    } else if (category) {
      filter.category = { $regex: category, $options: "i" };
    } else if (location) {
      filter.location = { $regex: location, $options: "i" };
    } else {
      res.status(404).json({ message: "Product not found" });
    }

    // Check if the filter is empty
    if (Object.keys(filter).length === 0) {
      return res.status(400).json({ message: "No search parameters provided" });
    }

    const findProduct = await productSchema.find(filter);

    if (findProduct.length > 0) {
      return res.status(200).json({ Products: findProduct });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  allProducts,
  searchProduct,
  yourPost,
};
