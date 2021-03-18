require("dotenv").config();

const admin = require("firebase-admin");
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");

const express = require("express");

//express setup
const app = express();
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

//firebase config settings
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "test-a962c.firebaseapp.com",
  projectId: "test-a962c",
  storageBucket: "test-a962c.appspot.com",
  messagingSenderId: "93593806224",
  appId: "1:93593806224:web:e21b489a6b4c3759483f15",
  measurementId: "G-YH3292Y9HH",
};

//setup firebase instance & connections
firebase.initializeApp(firebaseConfig);

app.post("/login", async (req, res) => {
  let formSub = req.body;

  const userObj = await firebase
    .auth()
    .signInWithEmailAndPassword(formSub.email, formSub.password)
    .catch((err) => {
      if (err) {
        res.send(err.message);
      }
    });

  if (userObj) {
    res.redirect("/dashboard");
  }
});

app.get("/dashboard", (req, res) => {
  if (firebase.auth().currentUser) {
    res.send(`Welcome back ${firebase.auth().currentUser.email}!`);
  } else {
    res.redirect("/");
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
