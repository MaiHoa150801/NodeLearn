const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, setDoc, doc } = require("firebase/firestore");

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

exports.mes_post = async function (req, res, next) {
  // get values to be submitted
  const timestamp = Date.now();
  const messageInput = req.body.message_content;

  console.log(messageInput);
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
