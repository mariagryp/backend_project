// server
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path"); //path module get a path to the static folder(.html etc)

// import Routers
const userRouter = require("./api/user");
const productRouter = require("./api/product");
const orderRouter = require("./api/order");

// config method - development env vars
require("dotenv").config();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
// static folder for serving html
app.use(express.static(path.join(__dirname, "client")));


// connection to Database
mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true },
    () => console.log("Connection to Database successfull")
);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

