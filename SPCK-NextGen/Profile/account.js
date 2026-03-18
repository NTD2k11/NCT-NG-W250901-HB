import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  get, 
  update 
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyRkCG8hgpUIBM7qh5_XO7L6wvwtjX99E",
  authDomain: "nct-ng-w250901-hb.firebaseapp.com",
  databaseURL: "https://nct-ng-w250901-hb-default-rtdb.firebaseio.com",
  projectId: "nct-ng-w250901-hb",
  storageBucket: "nct-ng-w250901-hb.firebasestorage.app",
  messagingSenderId: "793564168858",
  appId: "1:793564168858:web:41331b7dc1019a3368d523"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser;

// ===== Auth check =====
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../Login/login.html";
    return;
  }
  currentUser = user;
  loadProfile(user.uid);
});

async function loadProfile(uid) {
  const user = auth.currentUser;
  const snap = await get(ref(db, `users/${uid}`));
  const data = snap.val() || {};

  const name = data.name || user.displayName || "";
  const email = user.email || "";

  document.querySelector('input[placeholder="Nhập họ và tên"]').value = name;
  document.querySelector('input[type="email"]').value = email;
  document.querySelector('input[type="tel"]').value = data.phone || "";
  document.querySelector('textarea').value = data.bio || "";
  document.querySelector('input[placeholder="Thành phố, Quốc gia"]').value = data.location || "";
  document.querySelector('input[type="url"]').value = data.website || "";

let nameUser = document.querySelector("#profile-name")
let gmailUser = document.querySelector(".username")
let dateUser = document.querySelector(".member-since")
onAuthStateChanged(auth, (user) => {
  if (user) {
    nameUser.innerText = user.displayName
    gmailUser.innerText = user.email
    dateUser.innerText = "Thành viên từ " + new Date(user.metadata.creationTime).toLocaleDateString("vi-VN")
  } else {  
    nameUser.innerText = "Người dùng"
  } 
});


  if (!data.name && user.displayName) {
    await update(ref(db, `users/${uid}`), {
      name: user.displayName,
      email: user.email,
      createdAt: Date.now()
    });
  }
}


// ===== Save profile =====
document.querySelector('.btn-primary')?.addEventListener('click', async () => {
  if (!currentUser) return;

  const profileData = {
    name: document.querySelector('input[placeholder="Nhập họ và tên"]').value,
    phone: document.querySelector('input[type="tel"]').value,
    bio: document.querySelector('textarea').value,
    location: document.querySelector('input[placeholder="Thành phố, Quốc gia"]').value,
    website: document.querySelector('input[type="url"]').value,
    updatedAt: Date.now()
  };

  await update(ref(db, `users/${currentUser.uid}`), profileData);
  alert("✅ Đã lưu thông tin!");
});

// ===== Logout =====
document.querySelector('.btn-logout')?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = "../Login/login.html";
});

// ===== Tab switching =====
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    const tabName = this.getAttribute('data-tab');

    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });

    document.querySelectorAll('.menu-item').forEach(menu => {
      menu.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    this.classList.add('active');
  });
});
