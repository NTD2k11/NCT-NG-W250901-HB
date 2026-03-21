import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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

let allPosts = [];

function formatDate(t) {
  return t ? new Date(t).toLocaleDateString("vi-VN") : "Vừa xong";
}

function render(id, posts) {
  const box = document.getElementById(id);
  if (!box) return;

  box.innerHTML = posts.map(p => `
    <article class="blog-card" data-id="${p.id}">
      <div class="card-content">
        <span class="category">${p.category || "Khác"}</span>
        <h4>${p.title}</h4>
        <p>${(p.content || "").slice(0, 100)}...</p>
        <div class="stats">
          <span>👁️ ${p.views || 0}</span>
          <span>❤️ ${p.likes || 0}</span>
          <span>${formatDate(p.createdAt)}</span>
        </div>
      </div>
    </article>
  `).join("");
}

async function loadPosts() {
  const snap = await get(ref(db, "posts"));
  const data = snap.val();
  if (!data) return;

  const posts = Object.entries(data).map(([id, p]) => ({ ...p, id }));
  allPosts = posts;

  const latest = [...posts]
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .slice(0, 6);

  const popular = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6);

  const trending = [...posts]
    .sort((a, b) => ((b.likes || 0) * 2 + (b.views || 0)) -
                    ((a.likes || 0) * 2 + (a.views || 0)))
    .slice(0, 3);

  render("hotPosts", trending);
  render("popularPosts", popular);
  render("latestPosts", latest);
}

// SEARCH
function searchPosts(keyword) {
  keyword = keyword.toLowerCase().trim();

  if (!keyword) {
    loadPosts();
    return;
  }

  const result = allPosts.filter(p =>
    (p.title || "").toLowerCase().includes(keyword) ||
    (p.content || "").toLowerCase().includes(keyword)
  );

  render("latestPosts", result);
  document.getElementById("hotPosts").innerHTML = "";
  document.getElementById("popularPosts").innerHTML = "";
}

document.getElementById("searchInput")?.addEventListener("input", e => {
  searchPosts(e.target.value);
});

// MỞ BÀI
document.addEventListener("click", e => {
  const card = e.target.closest(".blog-card");
  if (card?.dataset.id) {
    window.location.href = `../Blog/post-detail.html?id=${card.dataset.id}`;
  }
});

// AUTH CHECK
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "../Login/login.html";
});

// LOGOUT
document.querySelector(".btn-logout")?.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
  localStorage.removeItem("user_email");
  window.location.href = "../Login/login.html";
});

loadPosts();
