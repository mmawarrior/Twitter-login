import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

document.getElementById('MainForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('emailInp').value;
    const password = document.getElementById('passwordInp').value;
    const firstName = document.getElementById('fnameInp').value;
    const lastName = document.getElementById('lnameInp').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const fullName = `${firstName} ${lastName}`;
            const handle = email.split('@')[0];

            // Update the user's profile
            return updateProfile(user, {
                displayName: fullName
            }).then(() => {
                // Save additional user info in the database
                return set(ref(db, 'Users/' + user.uid), {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    fullName: fullName,
                    handle: handle
                });
            });
        })
        .then(() => {
            // Save user data to sessionStorage
            sessionStorage.setItem('userFullName', `${firstName} ${lastName}`);
            sessionStorage.setItem('userHandle', email.split('@')[0]);

            window.location.href = 'upload.html';
        })
        .catch((error) => {
            console.error('Error creating new user:', error);
            alert('Error creating new user: ' + error.message);
        });
});
