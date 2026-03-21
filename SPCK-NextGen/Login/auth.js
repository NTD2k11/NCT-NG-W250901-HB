import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import {
  getDatabase,
  ref,
  set
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

function syncAuthLocalState(user) {
  if (!user) {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("user_email");
    return;
  }

  localStorage.setItem("user_id", user.uid);
  localStorage.setItem("username", user.displayName || "");
  localStorage.setItem("user_email", user.email || "");
}

export { auth, db, syncAuthLocalState };

// ================= SIGNUP =================
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  const fullnameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!fullname || !email || password.length < 6) {
      return alert("Thong tin khong hop le");
    }

    if (password !== confirmPassword) {
      return alert("Mat khau xac nhan khong khop");
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(cred.user, { displayName: fullname });
      syncAuthLocalState({ ...cred.user, displayName: fullname });

      await set(ref(db, "users/" + cred.user.uid), {
        name: fullname,
        fullname,
        email,
        createdAt: new Date().toISOString(),
      });

      alert("Dang ky thanh cong!");
      window.location.href = "login.html";

    } catch (err) {
      alert(err.message);
    }
  });
}

// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) return alert("Nhap day du thong tin");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      syncAuthLocalState(cred.user);
      alert("Dang nhap thanh cong!");
      window.location.href = "../Home/Dashboard/dashboard.html";
    } catch (err) {
      alert(err.message);
    }
  });
}

// ================= AUTO REDIRECT IF LOGGED IN =================
onAuthStateChanged(auth, (user) => {
  syncAuthLocalState(user);

  if (user && (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html"))) {
    window.location.href = "../Home/Dashboard/dashboard.html";
  }
});
