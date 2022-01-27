// var firebase = require('firebase/app');

// require('firebase/analytics');
// require('firebase/auth');
// require('https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js');
// var database = require('firebase/database');
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, setDoc, doc } = require("firebase/firestore");
// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgcOlP1Ywv_KY6utuQm8mKb-sB0xglsk4",
  authDomain: "chat-in-nodejs.firebaseapp.com",
  databaseURL:
    "https://chat-in-nodejs-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-in-nodejs",
  storageBucket: "chat-in-nodejs.appspot.com",
  messagingSenderId: "72205822306",
  appId: "1:72205822306:web:d0c544a94a54a8cfc4643b",
  measurementId: "G-1HGGL8VKMW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const mesCol = collection(db, "messages");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // initialize database
// var db = firebase.database();
// send message to db
exports.mes_post = async function (req, res, next) {
  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = req.body.message_content;

  // clear the input box
  // messageInput.value = "";
  console.log(messageInput);
  //auto scroll to bottom
  // document
  //   .getElementById("messages")
  //   .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

  // create db collection and send in the data
  // db.ref("messages/" + timestamp).set({
  //   username,
  //   message,
  // });

  // Add a new document in collection "cities"
  // const documents = snapshot.docs.map((doc) => ({
  //   ...doc.data(),
  //   id: doc.id,
  // }));
  await setDoc(doc(db, "messages/" + timestamp), {
    text: messageInput,
  });
  res.redirect("/chat");
};

// display the messages
// reference the collection created earlier
exports.mes_list = async function (req, res, next) {
  console.log("runn list message");
  const mesSnapshot = await getDocs(mesCol);
  const messages = mesSnapshot.docs.map((doc) => doc.data());
  console.log(messages);
  res.render("chat", { title: "Messages List", message_list: messages });
};
