require("dotenv").config();
const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnection;
