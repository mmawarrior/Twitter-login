import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

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

function loadUserDetails() {
    const user = auth.currentUser;
    if (user) {
        const userRef = ref(db, 'Users/' + user.uid);
        onValue(userRef, (snapshot) => {
            const userData = snapshot.val();
            if (userData) {
                document.querySelector('.profile-details #fullName').innerText = userData.fullName;
                document.querySelector('.profile-details #userHandleDisplay').innerText = `@${userData.handle}`;
                sessionStorage.setItem('userFullName', userData.fullName);
                sessionStorage.setItem('userHandle', userData.handle);
            } else {
                console.error('No user data found in database.');
            }
        });
    }
}

function loadProfileImage() {
    const user = auth.currentUser;
    if (user) {
        const userImagesRef = ref(db, `Users/${user.uid}/ProfilePicture`);
        onValue(userImagesRef, (snapshot) => {
            const imageUrl = snapshot.val().ImgUrl;
            document.getElementById('profilePicture').src = imageUrl;
            sessionStorage.setItem('profilePicture', imageUrl); // Save to sessionStorage
        });
    }
}

function loadTweets() {
    const tweetFeed = document.getElementById('tweet-feed');
    tweetFeed.innerHTML = ''; // Clear the feed to avoid duplicates

    const tweetsRef = ref(db, 'tweets');
    onValue(tweetsRef, (snapshot) => {
        tweetFeed.innerHTML = ''; // Clear the feed again to avoid duplicates
        snapshot.forEach((childSnapshot) => {
            const tweet = childSnapshot.val();
            const tweetElement = document.createElement('div');
            tweetElement.className = 'tweet';
            tweetElement.innerHTML = `
                <img src="${tweet.profilePicture}" alt="Profile Picture">
                <div class="tweet-content">
                    <div class="tweet-header">${tweet.userFullName}</div>
                    <div class="tweet-body">${tweet.content}</div>
                    <button class="delete-tweet-btn" data-tweet-id="${childSnapshot.key}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            tweetFeed.appendChild(tweetElement);
        });

        // Add event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-tweet-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tweetId = e.currentTarget.getAttribute('data-tweet-id');
                deleteTweet(tweetId);
            });
        });
    });
}

function deleteTweet(tweetId) {
    const tweetRef = ref(db, 'tweets/' + tweetId);
    remove(tweetRef)
        .then(() => {
            console.log('Tweet deleted successfully');
            loadTweets();
        })
        .catch((error) => {
            console.error('Error deleting tweet:', error);
        });
}

// Event listener for posting a tweet
document.getElementById('post-tweet-btn').addEventListener('click', () => {
    const tweetContent = document.getElementById('tweet').value;
    if (tweetContent) {
        postTweet(tweetContent);
    } else {
        alert('Please write something to tweet.');
    }
});

function postTweet(tweetContent) {
    const user = auth.currentUser;
    if (user) {
        const tweetRef = push(ref(db, 'tweets'));
        const userFullName = sessionStorage.getItem('userFullName');
        const profilePicture = sessionStorage.getItem('profilePicture');

        set(tweetRef, {
            userId: user.uid,
            content: tweetContent,
            timestamp: Date.now(),
            userFullName: userFullName,
            profilePicture: profilePicture
        }).then(() => {
            document.getElementById('tweet').value = '';
            loadTweets();
        }).catch((error) => {
            console.error('Error posting tweet:', error);
        });
    } else {
        console.error('User not authenticated');
    }
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        loadUserDetails();
        loadProfileImage();
        loadTweets();
    } else {
        console.log('User is signed out');
        window.location.href = 'login.html';
    }
});
