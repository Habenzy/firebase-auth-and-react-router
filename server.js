require("dotenv").config();
const path = require('path')
const express = require("express");

//express setup
const app = express();
app.use(express.static("./client/public"));
app.use(express.urlencoded({ extended: true }));

//To host live serve from 'build' instead of 'public', and don't forget to add the build script to package.json
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client/public/index.html'))
})

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
