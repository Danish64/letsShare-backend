const mongoose = require("mongoose");
const debug = require("debug")("app:db");
module.exports = function () {
  //Connecting to Database
  mongoose
    .connect(
      "mongodb+srv://danish:danish13@letsshare.vks9c.mongodb.net/letsShare?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    )
    .then(() => {
      debug("Connected to MongoDb");
    });
};
