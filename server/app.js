const express = require("express");
const fs = require("fs");
const alur = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const vehicleRouter = require("./routes/vehicleRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const globalErrorHandling = require("./controllers/errorController");

const app = express();

app.use("/uploads", express.static(alur.join(__dirname, "uploads")));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = `photo${Date.now()}.jpg`;
  await imageDownloader.image({
    url: link,
    dest: `${__dirname}/uploads${newName}`,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = `${path}.${ext}`;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

// MOUNTING ROUTES
app.use("/api/v1/vehicles", vehicleRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);

// MIDDLEWARE HANDLING ERROR FOR ALL ROUTES
app.all("*", (req, res, next) => {
  next(new Error(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandling);

module.exports = app;
