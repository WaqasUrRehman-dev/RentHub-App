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

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDocs));
app.use("/api", user_Route);
app.use("/api", product_Route);

app.listen(port, () => {
  connectDB(process.env.MONGO_URL)
    .then(() => {
      console.log(`DB Connected Succesffuly - App listening on port ${port}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
