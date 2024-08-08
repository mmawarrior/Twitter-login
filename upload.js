import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const storage = getStorage(app);
const realdb = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    var files = [];
    var reader = new FileReader();

    var myimg = document.getElementById('myimg');
    var proglab = document.getElementById('upprogress');
    var SelBtn = document.getElementById('selbtn');
    var UpBtn = document.getElementById('upbtn');
    var ContinueBtnContainer = document.getElementById('continueBtnContainer');
    var ContinueBtn = document.getElementById('continueBtn');

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;
        reader.readAsDataURL(files[0]);
    }

    reader.onload = function () {
        myimg.src = reader.result;
    }

    SelBtn.onclick = function () {
        input.click();
    }

    async function UploadProcess() {
        var ImgToUpload = files[0];

        if (!ImgToUpload) {
            alert('No image selected');
            return;
        }

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const metaDeta = {
                    contentType: ImgToUpload.type
                };

                const storageRef = sRef(storage, "profilePictures/" + user.uid);
                const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaDeta);

                UploadTask.on('state_changed', (snapshot) => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        proglab.innerHTML = "Upload " + progress + "%";
                        console.log('Upload is ' + progress + '% done');
                    },
                    (error) => {
                        console.error("Error during upload:", error);
                        alert("Error: Image not uploaded");
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(UploadTask.snapshot.ref);
                        await SaveURLtoRealTimeDB(downloadURL, user.uid);

                        // Get user data and save to sessionStorage
                        const userRef = ref(realdb, 'Users/' + user.uid);
                        const snapshot = await get(userRef);
                        if (snapshot.exists()) {
                            const userData = snapshot.val();
                            sessionStorage.setItem('userFullName', userData.fullName);
                            sessionStorage.setItem('userHandle', userData.handle);
                        }
                    }
                );
            } else {
                alert('User is not authenticated. Please sign in.');
            }
        });
    }

    function SaveURLtoRealTimeDB(URL, uid) {
        set(ref(realdb, "Users/" + uid + "/ProfilePicture"), {
            ImgUrl: URL
        }).then(() => {
            alert('Image URL saved to database');
            console.log('Image URL saved to database:', URL);
            sessionStorage.setItem('profilePicture', URL);
            ContinueBtnContainer.classList.remove('d-none');
        }).catch((error) => {
            console.error('Error saving URL to database:', error);
            alert('Error saving URL to database');
        });
    }

    UpBtn.onclick = UploadProcess;
    ContinueBtn.onclick = () => {
        window.location.href = 'main.html';
    };
});
