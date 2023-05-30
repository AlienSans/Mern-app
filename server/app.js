const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const User = require("./models/userModel");
const Vehicle = require("./models/vehicleModel");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/vehicles", (req, res) => {
  const { token } = req.cookies;
  const {
    name,
    type,
    address,
    feature,
    addedPhotos,
    description,
    checkIn,
    checkOut,
    maxGuests,
    extraInfo,
  } = req.body;

  console.log(req.body);

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const vehicleDoc = await Vechile.create({
      owner: userData.id,
      name,
      type,
      address,
      feature,
      photos: addedPhotos,
      description,
      checkIn,
      checkOut,
      maxGuests,
      extraInfo,
    });
    res.json(vehicleDoc);
  });
});

app.get("/vehicles", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Vehicle.find({ owner: id }));
  });
});

app.get("/vehicles/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Vehicle.findById(id));
});

app.put("/places/:id", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    name,
    type,
    address,
    feature,
    addedPhotos,
    description,
    checkIn,
    checkOut,
    maxGuests,
    extraInfo,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    const vehicleDoc = await Vehicle.findById(id);
    if (userData.id === vehicleDoc.owner.toString()) {
      vehicleDoc.set({
        name,
        type,
        address,
        feature,
        photos: addedPhotos,
        description,
        checkIn,
        checkOut,
        maxGuests,
        extraInfo,
      });
      await vehicleDoc.save();
      res.json("ok");
    }
  });
});

module.exports = app;
