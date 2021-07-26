const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./userRoutes");
const session = require('express-session');

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESS_NAME = 'sid',
  SESS_SECRET = '1NcM8XBdaoM',
  SESSION_LIFETIME = TWO_HOURS,
} = process.env;

const IN_PROD = NODE_ENV === 'production';


const app = express();

const db = mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then((_) => console.log("Connected to DB"))
  .catch((err) => console.error("error", err));

app.use(express.json());

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
      maxAge: SESSION_LIFETIME,
      sameSite: true, //strict
      secure: IN_PROD,
  }
}))

// here we want express to use userRoutes for all requests coming at /auth like /auth/login
app.use("/auth", userRoutes);

app.listen(PORT, () => console.log("Running on port 3000"));