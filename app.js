const express = require("express");
const path = require("path");
require("dotenv").config();
const config = require("./config")
const PORT = config.port || 5001;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect } = require("./db/connectDB");
const { NotFoundError } = require("./middlewares/apiError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const { baseUrl } = require("./config")

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve("./assets")));

connect();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    },
    servers: [
      {
        url: baseUrl,
      },
    ],
  },
  apis: ["./routes/v1/*.js", "./routes/v1/schemas/*.js"],
};

const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const routes=require('./routes/v1/index');

app.use("/api/v1", routes);

app.all("*", (req, res, next) => next(new NotFoundError()));

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
