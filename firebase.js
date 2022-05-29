// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDoo_1Ldn_W7KcAJHePTR-AB7jxq8p5Y4",
  authDomain: "micro-app-exp.firebaseapp.com",
  databaseURL: "https://micro-app-exp-default-rtdb.firebaseio.com",
  projectId: "micro-app-exp",
  storageBucket: "micro-app-exp.appspot.com",
  messagingSenderId: "891144990607",
  appId: "1:891144990607:web:d89fc818d008a9481465fa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

module.exports = database;