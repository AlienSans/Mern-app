const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/userModel");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("OK");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const userDoc = await User.create({
    name,
    email,
    password: bcrypt.hashSync(password, bcryptSalt),
  });
  try {
    res.status(201).json({
      status: "success",
      data: {
        data: userDoc,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        process.env.JWT_SECRET,
        {},
        (error, token) => {
          if (error) throw error;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(400).json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

module.exports = app;
