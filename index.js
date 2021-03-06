const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.static("build"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

var productRouter = require("./routes/products");
var passwordRouter = require("./routes/password");
var orderRouter = require("./routes/order");
var userRouter = require("./routes/login");
var loginRouter = require("./auth/auth");

app.use("/api/products", productRouter);
app.use("/api/password", passwordRouter);
app.use("/api/order", orderRouter);
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
