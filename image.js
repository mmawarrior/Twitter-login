import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
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
    //--- Variables and references ----//
    var files = [];
    var reader = new FileReader();

    var namebox = document.getElementById('namebox');
    var extlab = document.getElementById('extlab');
    var myimg = document.getElementById('myimg');
    var proglab = document.getElementById('upprogress');
    var SelBtn = document.getElementById('selbtn');
    var UpBtn = document.getElementById('upbtn');
    var DownBtn = document.getElementById('downbtn');
    var ContinueBtnContainer = document.getElementById('continueBtnContainer');
    var ContinueBtn = document.getElementById('continueBtn');

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;

        var extension = GetFileExt(files[0]);
        var name = GetFileName(files[0]);

        namebox.value = name;
        extlab.innerHTML = extension;

        reader.readAsDataURL(files[0]);
    }

    reader.onload = function () {
        myimg.src = reader.result;
    }

    // Selection //
    SelBtn.onclick = function () {
        input.click();
    }

    function GetFileExt(file) {
        var temp = file.name.split('.');
        var ext = temp.slice(-1)[0];
        return '.' + ext;
    }

    function GetFileName(file) {
        var temp = file.name.split('.');
        var fname = temp.slice(0, -1).join('.');
        return fname;
    }

    function ValidateName() {
        var regex = /[\.#$\[\]]/;
        return !regex.test(namebox.value);
    }

    // -- UPLOAD PROCES -- //
    async function UploadProcess() {
        var ImgToUpload = files[0];

        if (!ImgToUpload) {
            alert('No image selected');
            return;
        }

        var ImgName = namebox.value + extlab.innerHTML;

        if (!ValidateName()) {
            alert('Invalid name...');
            return;
        }

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is authenticated:", user);
                const metaDeta = {
                    contentType: ImgToUpload.type
                };

                const storageRef = sRef(storage, "images/" + user.uid + "/" + ImgName);
                const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaDeta);

                UploadTask.on('state_changed', (snapshot) => {
                        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        proglab.innerHTML = "Upload " + progress + "%";
                        console.log("Upload progress:", progress + "%");
                    },
                    (error) => {
                        alert("Error: Image not uploaded");
                        console.error("Upload error:", error);
                    },
                    () => {
                        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                            console.log("File available at:", downloadURL);
                            SaveURLtoRealTimeDB(downloadURL, user.uid);
                        });
                    }
                );
            } else {
                alert('User is not authenticated. Please sign in.');
                console.error("User is not authenticated. Please sign in.");
            }
        });
    }

    // Functions for realtime database //
    function SaveURLtoRealTimeDB(URL, uid) {
        var name = namebox.value;
        var ext = extlab.innerHTML;

        set(ref(realdb, "Users/" + uid + "/ProfilePicture"), {
            ImageName: name + ext,
            ImgUrl: URL
        }).then(() => {
            alert('Image URL saved to database');
            console.log("Image URL saved to database");
            ContinueBtnContainer.classList.remove('d-none');
        }).catch((error) => {
            alert('Error saving URL to database');
            console.error("Database error:", error);
            console.error(error.code, error.message); // Extra log voor meer details
        });
    }

    UpBtn.onclick = UploadProcess;
    ContinueBtn.onclick = () => {
        window.location.href = 'main.html';
    };
});
