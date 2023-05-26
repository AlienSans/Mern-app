const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose.set("strictQuery", false);

// const DB =process.env.DATABASE_LOCAL;

const DB = process.env.DATABASE_ATLAS.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connection successful"))
  .catch((error) => {
    console.log(error);
  });

// START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
