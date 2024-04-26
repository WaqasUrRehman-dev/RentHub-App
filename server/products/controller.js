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

const updateProduct = async (req, res) => {
  const { name, price, description, category, image } = req.body;
  try {
    const filter = { name };
    const update = { price, description, category, image };

    const updatedProduct = await productSchema.findOneAndUpdate(
      filter,
      update,
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Product Updated Successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    res.status(400).json({ message: "Invalid request" });
  } else {
    try {
      await productSchema.findIdAndDelete({ _id });
      const allProducts = await productSchema.find();
      res.status(200).json({
        message: "Product Deleted Successfully",
        Products: allProducts,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getProducts = (req, res) => {
  res.send("Get Products");
};

module.exports = { addProduct, updateProduct, deleteProduct, getProducts };
