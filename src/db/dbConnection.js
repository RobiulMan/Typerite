require("dotenv").config();

console.log("process env", process.env.DB_URI);
const uri = process.env.DB_URI || "mongodb://localhost:27017/mydatabas";
console.log("url", uri);
const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnection;
