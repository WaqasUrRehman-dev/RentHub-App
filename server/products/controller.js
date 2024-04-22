const productSchema = require("./schema");

const addProduct = async (req, res) => {
  const { name, price, category, description, image } = req.body;

  if (!name && !price && !category && !description && !image) {
    res.status(400).json({ message: "invalid Payload" });
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

const updateProduct = (req, res) => {
  res.send("Update Product");
};

const deleteProduct = (req, res) => {
  res.send("Delete Product");
};

const getProducts = (req, res) => {
  res.send("Get Products");
};

module.exports = { addProduct, updateProduct, deleteProduct, getProducts };
