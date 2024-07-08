const express = require("express");
require("dotenv").config();
const connectDB = require("./model/database");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./Swagger/api.yaml");
const app = express();
const port = process.env.SERVER_PORT || 3000;
const user_Route = require("./Users/router");
const product_Route = require("./products/router");
const message_Route = require("./message/router");
const booking_Route = require("./reservationSystem/router");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));
app.use("/api", user_Route);
app.use("/api", product_Route);
app.use("/api", message_Route);
app.use("/api", booking_Route);

app.get("/", (req, res) => {
  res.send("Welcome to Our RentHub App");
});

//Server
app.listen(port, () => {
  connectDB(process.env.MONGO_URL)
    .then(() => {
      console.log(`App listening on port ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
