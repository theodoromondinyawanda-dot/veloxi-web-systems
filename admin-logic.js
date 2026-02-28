/* VELOXI_ADMIN_CORE_v1.8
   PROTOCOL: ANALYTICS_INTEGRATED
   FEATURES: DATA_COUNTER, VALUE_TRACKING, WA_254_FIX
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

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
const db = getFirestore(app);

// --- 1. WHATSAPP_254_FORMATTER ---
function sanitizeForWhatsApp(phone) {
    let digits = phone.replace(/\D/g, ''); 
    if (digits.startsWith('0')) {
        digits = '254' + digits.substring(1);
    } else if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
        digits = '254' + digits;
    }
    return digits;
}

// --- 2. AUTH_PROTECTION ---
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "admin-login.html";
    } else {
        runMissionControl();
    }
});

// --- 3. ANALYTICS & DATA FEED ---
function runMissionControl() {
    const tableBody = document.getElementById('inquiryTableBody');
    const counterEl = document.getElementById('leadCounter');
    
    const q = query(collection(db, "inquiries"), orderBy("transmission_time", "desc"));
    
    onSnapshot(q, (snapshot) => {
        // A. ANALYTICS_CALCULATION
        const totalLeads = snapshot.size;
        if (counterEl) {
            counterEl.innerHTML = `
                <span style="color:#87CEEB;">ACTIVE_UPLINKS:</span> ${totalLeads} | 
                <span style="color:#87CEEB;">SYSTEM_STATUS:</span> OPERATIONAL
            `;
        }

        // B. TABLE_RE-RENDERING
        tableBody.innerHTML = ""; 

        snapshot.forEach((inquiryDoc) => {
            const data = inquiryDoc.data();
            const id = inquiryDoc.id;

            const timeStr = data.transmission_time 
                ? data.transmission_time.toDate().toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) 
                : "SYNCING...";

            const cleanNumber = sanitizeForWhatsApp(data.whatsapp_contact);

            const row = `
                <tr id="entry-${id}">
                    <td class="col-time">${timeStr}</td>
                    <td class="col-inst"><strong>${data.institution}</strong></td>
                    <td class="col-wa">
                        <a href="https://wa.me/${cleanNumber}" target="_blank" class="wa-link">
                            CONNECT_WA ↗
                        </a>
                    </td>
                    <td class="col-budg">
                        <span style="color: #87CEEB; font-weight: bold;">${data.budget_range}</span>
                    </td>
                    <td class="col-goal">
                        <div class="goal-text">${data.primary_goal}</div>
                    </td>
                    <td class="col-act">
                        <button class="action-btn delete-btn" onclick="purgeEntry('${id}')">PURGE</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    });
}

// --- 4. SYSTEM_COMMANDS ---
window.purgeEntry = async (id) => {
    if (confirm("CRITICAL: Authorize permanent deletion of this record?")) {
        try {
            await deleteDoc(doc(db, "inquiries", id));
        } catch (err) {
            console.error("Purge Error:", err);
        }
    }
};

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.onclick = () => signOut(auth);
}
