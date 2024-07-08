const productSchema = require("./schema");
const userschema = require("../Users/schema");

const addProduct = async (req, res) => {
  const { name, price, category, description, location, type, images } =
    req.body;
  const createdBy = req.user.id;

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
      const user = await userschema.findById(createdBy).select("-password");
      if (!user) {
        return res.status(400).json({ message: "UnAuthorized User" });
      } else {
        const createProduct = await productSchema.create({
          createdBy: user,
          name,
          price,
          category,
          description,
          location,
          type,
          images,
        });

        return res.status(201).json({
          message: "Product created Successfully",
          createProduct,
        });
      }
    } else {
      return res.status(422).json({ message: "Required Field Missing" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const yourPost = async (req, res) => {
  const createdBy = req.user.id;
  try {
    const allProducts = await productSchema.find({ createdBy });

    return res.status(200).json({ message: "Your Post", allProducts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { _id, name, price, description, category, images } = req.body;
  const createdBy = req.user.id;
  try {
    const filter = { _id };
    const update = { name, price, description, category, images };
    const updatedProduct = await productSchema.findOneAndUpdate(
      filter,
      update,
      { new: true }
    );
    if (updatedProduct) {
      return res.status(201).json({
        message: "Product Updated Successfully",
        createdBy,
        updatedProduct,
      });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  const { _id } = req.body;
  const createdBy = req.user.id;
  if (!_id) {
    res.status(404).json({ message: "Product not found" });
  } else {
    try {
      await productSchema.findOneAndDelete({ _id });
      const allProducts = await productSchema.find();
      return res.status(201).json({
        message: "Product Deleted Successfully",
        Products: allProducts,
        CreatedBy: createdBy,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const allProducts = async (req, res) => {
  try {
    const products = await productSchema.find();
    res.status(200).json({ Products: products });
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchProduct = async (req, res) => {
  const { name, category, location } = req.query;

  try {
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    } else if (category) {
      filter.category = { $regex: category, $options: "i" };
    } else if (location) {
      filter.location = { $regex: location, $options: "i" };
    } else {
      return res.status(404).json({ message: "Product not found" });
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
    return res.status(500).json({ message: "Internal Server Error" });
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
