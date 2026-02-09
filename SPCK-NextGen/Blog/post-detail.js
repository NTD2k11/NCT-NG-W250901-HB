import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
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

const elements = {
  image: document.getElementById("postImage"),
  category: document.getElementById("postCategory"),
  title: document.getElementById("postTitle"),
  author: document.getElementById("postAuthor"),
  date: document.getElementById("postDate"),
  views: document.getElementById("postViews"),
  likes: document.getElementById("postLikes"),
  content: document.getElementById("postContent"),
  empty: document.getElementById("postEmpty")
};

function formatDate(value) {
  if (!value) return "Vừa xong";
  if (typeof value === "number") {
    return new Date(value).toLocaleDateString("vi-VN");
  }
  if (typeof value === "string") return value;
  return "Vừa xong";
}

function normalizePost(post) {
  return {
    title: post?.title || "Bài viết",
    content: post?.content || post?.excerpt || "Chưa có nội dung.",
    imageUrl:
      post?.imageUrl ||
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=700&fit=crop",
    category: post?.category || "Khác",
    authorName: post?.authorName || post?.author || "Ẩn danh",
    createdAt: formatDate(post?.createdAt || post?.date),
    views: post?.views ?? 0,
    likes: post?.likes ?? 0
  };
}

function renderContent(text) {
  elements.content.innerHTML = "";
  const parts = String(text || "").split(/\n+/).filter(Boolean);
  if (!parts.length) {
    const p = document.createElement("p");
    p.textContent = "Chưa có nội dung.";
    elements.content.appendChild(p);
    return;
  }
  parts.forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line.trim();
    elements.content.appendChild(p);
  });
}

function renderPost(raw) {
  const post = normalizePost(raw);
  elements.image.src = post.imageUrl;
  elements.category.textContent = post.category;
  elements.title.textContent = post.title;
  elements.author.textContent = post.authorName;
  elements.date.textContent = post.createdAt;
  elements.views.textContent = post.views;
  elements.likes.textContent = post.likes;
  renderContent(post.content);
  elements.empty.hidden = true;
}

async function loadPostById(postId) {
  try {
    const snap = await get(ref(db, `posts/${postId}`));
    const data = snap.val();
    if (!data) {
      elements.empty.hidden = false;
      return;
    }
    renderPost(data);
  } catch (err) {
    console.error("Load post failed:", err);
    elements.empty.hidden = false;
  }
}

function loadFromCache() {
  const cached = sessionStorage.getItem("postDetailData");
  if (!cached) return false;
  try {
    const data = JSON.parse(cached);
    renderPost(data);
    return true;
  } catch (err) {
    return false;
  }
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../login.html";
  }
});

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

const hasCache = loadFromCache();
if (postId) {
  loadPostById(postId);
} else if (!hasCache) {
  elements.empty.hidden = false;
}
