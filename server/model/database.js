const { connect } = require("mongoose");

const connectDb = async () => {
  await connect(process.env.MONGO_URL);
  console.log("Database connected");
};

module.exports = connectDb;
