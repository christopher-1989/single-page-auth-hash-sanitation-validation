const bcrypt = require("bcrypt");
const express = require("express");
const { User } = require("./userModel");
const router = express.Router();
const validator = require('validator');

const sanitizeInput = (req, res, next) => {
    const body = req.body;
    const sanitizedEmail = validator.escape(body.email);
    const sanitizedPassword = validator.escape(body.password);
    console.log(sanitizedEmail);
    console.log(sanitizedPassword);
    req.body = {email: sanitizedEmail, password: sanitizedPassword};
    next();
}

const validateEmail = (req, res, next) => {
    if (validator.isEmail(req.body.email) === true) {
        next();
    } else {
        //Don't need to respond in practice, but rather complete in client browser
        res.status(401).json({ error: "Please enter a valid email"})
        return;
    }
};

const passwordRequirements = (req, res, next) => {
    const requirements = { 
        minLength: 6, 
        minLowercase: 1, 
        minUppercase: 1, 
        minNumbers: 1, 
        minSymbols: 2, 
        returnScore: false, 
        pointsPerUnique: 1, 
        pointsPerRepeat: 0.5, 
        pointsForContainingLower: 10, 
        pointsForContainingUpper: 10, 
        pointsForContainingNumber: 10, 
        pointsForContainingSymbol: 10 
    }
    if(validator.isStrongPassword(req.body.password, requirements) === true) {
        next();
    } else {
        //Don't need to respond in practice, but rather complete in client browser
        res.status(401).json({ error: `Please enter a stronger password. Passwords should be at least ${requirements.minLength} characters long, have at least ${requirements.minLowercase} lowercase, ${requirements.minUppercase} uppercase, ${requirements.minNumbers} number, and ${requirements.minSymbols} symbol`})
        return;
    }
};

const userAlreadyExists = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        //Don't need to respond in practice, but rather complete in client browser
        res.status(401).json({ error: `User already exists`});
        return;
    } 
    next();
};

// signup route
router.post("/signup", sanitizeInput, validateEmail, passwordRequirements, userAlreadyExists, async (req, res) => {
  const body = req.body;
  if (!(body.email && body.password)) {
    return res.status(400).send({ error: "Data not formatted properly" });
  }
  // createing a new mongoose doc from user data
  const user = new User(body);
  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  user.password = await bcrypt.hash(user.password, salt);
  user.save().then((doc) => res.status(201).send(doc));
});

// login route
router.post("/login", sanitizeInput, validateEmail, passwordRequirements, async (req, res) => {
  const body = req.body;
  const user = await User.findOne({ email: body.email });
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
      res.status(200).json({ message: "Valid password" });
    } else {
      res.status(400).json({ error: "Invalid Password" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
});

module.exports = router;