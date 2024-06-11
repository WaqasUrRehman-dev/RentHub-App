const { connect } = require("mongoose");

const connectDb = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database not connected");
    
  }
};

module.exports = connectDb;
