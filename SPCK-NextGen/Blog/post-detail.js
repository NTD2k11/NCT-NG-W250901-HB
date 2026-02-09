import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// ===== Firebase =====
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
const db = getDatabase(app);

// ===== Lấy ID bài viết từ URL =====
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

// ===== DOM =====
const titleEl = document.getElementById("postTitle");
const contentEl = document.getElementById("postContent");
const authorEl = document.getElementById("postAuthor");
const dateEl = document.getElementById("postDate");
const viewsEl = document.getElementById("postViews");
const likesEl = document.getElementById("postLikes");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

// ===== Format ngày =====
function formatDate(t) {
  return t ? new Date(t).toLocaleDateString("vi-VN") : "Vừa xong";
}

// ===== Tăng view =====
async function increaseViews() {
  const snap = await get(ref(db, `posts/${postId}/views`));
  const current = snap.val() || 0;
  await update(ref(db, `posts/${postId}`), { views: current + 1 });
  viewsEl.textContent = current + 1;
}

// ===== Load Like =====
async function loadLikes() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const likes = snap.val() || 0;
  likeCount.textContent = likes;
  likesEl.textContent = likes;
}

// ===== Toggle Like =====
async function toggleLike() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const current = snap.val() || 0;

  const newLikes = likeBtn.classList.contains("liked") ? current - 1 : current + 1;
  await update(ref(db, `posts/${postId}`), { likes: newLikes });

  likeBtn.classList.toggle("liked");
  likeCount.textContent = newLikes;
  likesEl.textContent = newLikes;
}

// ===== Load bài viết =====
async function loadPost() {
  if (!postId) return;

  const snap = await get(ref(db, `posts/${postId}`));
  const post = snap.val();

  if (!post) {
    document.getElementById("postEmpty").hidden = false;
    return;
  }

  titleEl.textContent = post.title;
  contentEl.innerHTML = post.content.replace(/\n/g, "<p></p>");
  authorEl.textContent = post.authorName || "Ẩn danh";
  dateEl.textContent = formatDate(post.createdAt);

  await increaseViews();
  await loadLikes();
}

// ===== Events =====
likeBtn?.addEventListener("click", toggleLike);

document.getElementById("shareBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Đã copy link bài viết!");
});

loadPost();
