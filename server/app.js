const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());

app.get("/", (req, res) => {
  res.json("Okeh");
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  res.json({ name, email, password });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
