const mongoose = require("mongoose");
const dotenv=require("dotenv")
require("dotenv").config()
const connection = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = { connection };
