import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getDatabase(app);

document.getElementById('LoginForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('emailInp').value;
    const password = document.getElementById('passwordInp').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const userRef = ref(db, 'Users/' + user.uid);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                sessionStorage.setItem('userFullName', userData.fullName);
                sessionStorage.setItem('userHandle', userData.handle);
            }
            alert('User signed in successfully');
            window.location.href = 'main.html';
        })
        .catch((error) => {
            alert('Error signing in: ' + error.message);
            console.error(error);
        });
});
