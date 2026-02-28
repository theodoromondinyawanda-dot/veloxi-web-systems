/* VELOXI CORE ARCHITECTURE v2.5
    OPERATIONAL_ID: 254116350415
    PROTOCOL: WHATSAPP_REDIRECT_INTEGRATION
    SECURITY_LAYER: FIREBASE_SILENCER_ENABLED
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// --- SYSTEM SILENCER (Hides 'Firebase' fingerprints from Console) ---
(function() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = function(...args) {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('Firebase') || args[0].includes('FIREBASE'))) return;
        originalLog.apply(console, args);
    };
    console.warn = function(...args) {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('Firebase') || args[0].includes('FIREBASE'))) return;
        originalWarn.apply(console, args);
    };
    console.info = function(...args) {
        if (args[0] && typeof args[0] === 'string' && (args[0].includes('Firebase') || args[0].includes('FIREBASE'))) return;
        originalInfo.apply(console, args);
    };
    
    originalLog("%c VELOXI_SYSTEM_STABLE ", "color: #87CEEB; background: #000; font-weight: 900; border: 1px solid #87CEEB; padding: 5px;");
})();

// --- INSTITUTIONAL CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCkwKkXz46evbOSmdJUQah3F7Ot8mIKKZI",
    authDomain: "veloxi-web-systems.firebaseapp.com",
    projectId: "veloxi-web-systems",
    storageBucket: "veloxi-web-systems.firebasestorage.app",
    messagingSenderId: "498794362582",
    appId: "1:498794362582:web:38f2c8a2522d51f601fb77"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- UI UTILITY FUNCTIONS ---

/**
 * Custom Notification Trigger
 * Replaces default browser alerts for institutional branding.
 */
function showVeloxiStatus(message, isError = false) {
    const notify = document.getElementById('veloxiNotify');
    const msgEl = document.getElementById('notifyMsg');
    
    if (notify && msgEl) {
        msgEl.innerText = message;
        msgEl.style.color = isError ? "#ff4444" : "#87CEEB";
        
        notify.classList.add('active');
        setTimeout(function() {
            notify.classList.remove('active');
        }, 4000);
    }
}

// --- NAVIGATION & MENU CONTROL ---
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuToggle');
    const navOverlay = document.getElementById('navOverlay');
    const links = document.querySelectorAll('.kinetic-links a');

    if (menuBtn && navOverlay) {
        menuBtn.onclick = function() {
            navOverlay.classList.toggle('active');
            document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : 'auto';
        };
    }

    links.forEach(function(link) {
        link.onclick = function() {
            navOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    });
});

// --- PROJECT DISCOVERY UPLINK (The Form Engine) ---
const inquiryForm = document.getElementById('veloxiInquiry');

if (inquiryForm) {
    inquiryForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // CAPTURE DATA FROM INSTITUTIONAL FIELDS
        const payload = {
            institution: document.getElementById('clientName').value,
            whatsapp_contact: document.getElementById('clientPhone').value,
            budget_range: document.getElementById('budgetRange').value,
            admin_architecture: document.getElementById('adminNeeds').value,
            primary_goal: document.getElementById('clientGoal').value,
            transmission_time: serverTimestamp(),
            status: "LOGGED_UPLINK"
        };

        try {
            // STEP 1: FIREBASE DATA SYNC
            // This happens silently. No "Firebase" logs will appear.
            await addDoc(collection(db, "inquiries"), payload);

            // STEP 2: ACTIVATE PROCESSING MODAL
            const modal = document.getElementById('processingModal');
            if (modal) {
                modal.style.display = 'flex';
            }

            // STEP 3: PREPARE WHATSAPP HANDSHAKE
            // Targeted Number: 0116350415
            const targetNumber = "254116350415"; 
            const encryptedMessage = encodeURIComponent(
                `*⚡ VELOXI_SYSTEM_UPLINK*\n` +
                `--------------------------------\n` +
                `*Institution:* ${payload.institution}\n` +
                `*Client WhatsApp:* ${payload.whatsapp_contact}\n` +
                `*Budget:* ${payload.budget_range}\n` +
                `*Admin Needs:* ${payload.admin_architecture}\n` +
                `*Primary Goal:* ${payload.primary_goal}\n` +
                `--------------------------------\n` +
                `_Sent via Veloxi Institutional Portal_`
            );

            // STEP 4: DELAYED REDIRECT (For technical weight and UX)
            setTimeout(function() {
                showVeloxiStatus("UPLINK_SUCCESS: INITIALIZING_WHATSAPP");
                
                // Hide modal and open WhatsApp
                if (modal) modal.style.display = 'none';
                
                window.location.href = `https://wa.me/${targetNumber}?text=${encryptedMessage}`;
                
                inquiryForm.reset();
            }, 2500);

        } catch (error) {
            console.error("SYSTEM_ERROR: UPLINK_FAILURE", error);
            showVeloxiStatus("CRITICAL_ERROR: PROTOCOL_INTERRUPTED", true);
            
            const modal = document.getElementById('processingModal');
            if (modal) modal.style.display = 'none';
        }
    });
}
