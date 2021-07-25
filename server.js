// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const userRoutes = require("./userRoutes");

// // to parse json data from request object
// app.use(express.json())

// app.use('/auth', userRoutes);


// mongoose.connect("mongodb://localhost:27010/demo", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   })
//   .then(() => console.log("Connected to DB"))
//   .catch (console.error);

// app.listen(3000, () => console.log("Running on port 3000"))
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./userRoutes");

const app = express();

const db = mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then((_) => console.log("Connected to DB"))
  .catch((err) => console.error("error", err));

app.use(express.json());
// here we want express to use userRoutes for all requests coming at /auth like /auth/login
app.use("/auth", userRoutes);

app.listen(3000, () => console.log("Running on port 3000"));