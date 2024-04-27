const productSchema = require("./schema");

const addProduct = async (req, res) => {
  const { name, price, category, description, image } = req.body;

  if (!name && !price && !category && !description && !image) {
    res.status(422).json({ message: "Required Field Missing" });
  } else {
    try {
      const checkProduct = await productSchema.exists({ name });
      if (checkProduct) {
        res.status(400).json({ message: "Product already exists" });
      } else {
        const createProduct = await productSchema.create({
          name,
          price,
          category,
          description,
          image,
        });
        res
          .status(201)
          .json({ message: "Product created Successfully", createProduct });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateProduct = async (req, res) => {
  const { _id, name, price, description, category, image } = req.body;
  try {
    const filter = { _id };
    const update = { name, price, description, category, image };
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

const getProducts = async (req, res) => {
  try {
    const allProducts = await productSchema.find();
    res.status(200).json({ Products: allProducts });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const findByName = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    res.status(404).json({ message: "Product not found" });
  } else {
    try {
      const findProduct = await productSchema.findOne({ name });
      res.status(200).json({ Product: findProduct });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const findByCategory = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    res.status(404).json({ message: "Product not found" });
  } else {
    try {
      const findProduct = await productSchema.findOne({ category });
      res.status(200).json({ Product: findProduct });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  findByName,
  findByCategory,
};
