const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const {
  User,
  validateSigup,
  validateSignin
} = require("../models/user");
const _ = require("lodash");
const isLogedIn = require("../middleware/auth");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

//------------------------------------------------------------------------------------------------------
//User Signup
router.post("/signup", async (req, res) => {
  //check if the input from the signup form is currect (using JOI), if not it put it inside a error var.
  const {
    error
  } = validateSigup(req.body);
  if (error)
    return (
      res.status(400).send(error.details[0].message) &&
      console.log(error.details[0].message)
    );
  //check if user is exist by the email.
  let user = await User.findOne({
    email: req.body.email,
  });
  if (user)
    return (
      res.status(400).send("User already exist") &&
      console.log("User already exist")
    );
  //if the async function gets to this stage it save the user.
  user = new User(req.body);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  //Send mail to user
  transporter.sendMail({
      from: "alex131986@gmail.com",
      to: user.email,
      subject: "Angular App Signup Successfuly",
      text: "You are Successfuly Signed up to Angular App",
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info);
      }
    }
  );
  //Send user info
  res.send(_.pick(user, ["_id", "name", "email"]));
});

//------------------------------------------------------------------------------------------------------
//User Signin
router.post("/signin", async (req, res) => {
  //Checking if the input from the login form is currect.
  const {
    error
  } = validateSignin(req.body);
  if (error) return res.status(400).send("invalid email or password");

  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("invalid email or password");

  res.json({
    token: user.generateAuthToken(),
    _id: user._id,
  });
});

//---------------------------------------------------------------------------------------------------------
//Get user Profile Page
router.get("/user-profile/:id", isLogedIn, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400) && console.log("User not found");
  res.send(user);
});
//---------------------------------------------------------------------------------------------------------

//uptade user info (image)
router.patch("/user-profile/:id", (req, res, next) => {
  User.findByIdAndUpdate(
    req.params.id, {
      image: req.body.image,
    },
    (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.json(data);
        console.log("image updated successfully");
      }
    }
  );
});

//-----------------------------------------------------------------------------------------------------------

//Authenticate user Singin
router.post("/authUser", isLogedIn, async (req, res) => {
  const user = await await User.findById(req.user._id).select("-password");
  if (!user) return res.status(400).send("User not found");
  res.send(user);
});

//--------------------------------------------------------------------------------------------------------------
//Send mail config from nodemailer when signup successfuly
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "587",
  secure: false,
  auth: {
    user: "alex131986@gmail.com",
    pass: "0545715942",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
//-------------------------------------------------------------------------------------------------------------

//File Upload Config
const PATH = "../server/public/uploads/images";
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + ".jpeg");
  },
});
let upload = multer({
  storage: storage,
});
//File upload Route
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("No file is available!");
    return res.send({
      success: false,
    });
  } else {
    console.log("File is available!" + req.file.filename);
    return res.send(req.file.filename);
  }
});

//------------------------------------------------------------------------------------------------------
module.exports = router;
