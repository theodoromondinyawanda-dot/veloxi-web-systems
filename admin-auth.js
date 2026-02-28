/* VELOXI_ADMIN_AUTHENTICATOR v1.0
   PROTOCOL: IDENTITY_VERIFICATION
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCkwKkXz46evbOSmdJUQah3F7Ot8mIKKZI",
    authDomain: "veloxi-web-systems.firebaseapp.com",
    projectId: "veloxi-web-systems",
    storageBucket: "veloxi-web-systems.firebasestorage.app",
    messagingSenderId: "498794362582",
    appId: "1:498794362582:web:38f2c8a2522d51f601fb77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('authError');

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const pass = document.getElementById('adminPass').value;
        const btn = loginForm.querySelector('button');

        btn.innerText = "AUTHORIZING_ACCESS...";

        signInWithEmailAndPassword(auth, email, pass)
            .then(() => {
                // SUCCESS: Proceed to Dashboard
                window.location.href = "admin.html";
            })
            .catch((error) => {
                // FAILURE: Lockout & Error
                errorMsg.style.display = "block";
                errorMsg.innerText = "ACCESS_DENIED: INVALID_CREDENTIALS";
                btn.innerText = "RETRY_UPLINK";
                console.error("Auth_Error:", error.code);
            });
    });
}
