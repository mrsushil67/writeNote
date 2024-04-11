const mongoose = require("mongoose")

const URL = "mongodb://127.0.0.1:27017/notesApp";

//establish connection to mongodb  database using mongoose
const db = mongoose
  .connect(URL)
  //if connection success display the success messages
  .then(() => {
    console.log("Connected with MongoDB");
  })
  //if there is a error on connecting show display the error message
  .catch((err) => {
    console.log("Application has Following Errors:  \n" + err);
  });

module.exports = db