import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDTrQz4NrZIR4gPHq8ZoSuF6JLy11qMsG4",
    authDomain: "chat-5373e.firebaseapp.com",
    databaseURL: "https://chat-5373e-default-rtdb.firebaseio.com",
    projectId: "chat-5373e",
    storageBucket: "chat-5373e.appspot.com",
    messagingSenderId: "366393039973",
    appId: "1:366393039973:web:3497a4c430da2500963a8c",
    measurementId: "G-03MEDHVD53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const storage = getStorage(app);

export { app, db, auth, storage };