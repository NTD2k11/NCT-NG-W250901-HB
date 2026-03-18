import { auth, db } from "./auth.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const listEl = document.querySelector(".posts-grid");

const colorPalette = [
  "#ffb4a2",
  "#ffd6a5",
  "#fdffb6",
  "#caffbf",
  "#9bf6ff",
  "#a0c4ff",
  "#bdb2ff",
  "#ffc6ff",
  "#f1f7ff",
  "#d8f3dc"
];

function pickColor(seed) {
  const str = String(seed || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return colorPalette[hash % colorPalette.length];
}

function showPosts(posts) {
  listEl.innerHTML = "";

  if (posts.length === 0) {
    listEl.innerHTML = "<p>Chưa có bài viết</p>";
    return;
  }

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post-card";

    // lấy mô tả ngắn
    const preview = post.content?.slice(0, 120) || "";
    const date = new Date(post.createdAt || Date.now()).toLocaleDateString("vi-VN");

    const thumbColor = pickColor(post.id || post.title);

    div.innerHTML = `
      <div class="post-thumb" style="background:${thumbColor}"></div>
      
      <div class="post-body">
        <span class="post-tag">${post.tag || "Chưa phân loại"}</span>

        <h2 class="post-title">${post.title}</h2>

        <p class="post-desc">${preview}${post.content.length > 120 ? "..." : ""}</p>

        <div class="post-meta">
          <span>📅 ${date}</span>
          <span>👁️ ${post.views || 0} lượt xem</span>
        </div>

        <div class="post-actions">
          <button class="edit-btn" data-id="${post.id}">Sửa</button>
          <button class="delete-btn" data-id="${post.id}">Xóa</button>
        </div>
      </div>
    `;

    listEl.appendChild(div);
  });

  addEvents();
}


function addEvents() {
  const deleteBtns = document.querySelectorAll(".delete-btn");
  const editBtns = document.querySelectorAll(".edit-btn");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const ok = confirm("Xóa bài này?");
      if (!ok) return;
      await remove(ref(db, "posts/" + id));
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      window.location.href = "../../Blog/create.html?id=" + id;
    });
  });
}



onAuthStateChanged(auth, (user) => {
  if (!user) {
    showPosts([]);
    return;
  }

  const postsRef = ref(db, "posts");

  onValue(postsRef, (snap) => {
    const data = snap.val() || {};
    const posts = [];

    for (const id in data) {
      const post = data[id];
      if (post.authorId === user.uid) {
        posts.push({ id, ...post });
      }
    }

    showPosts(posts);
  });
});


let name = document.querySelector("#name")
let gmail = document.querySelector("#gmail")
let welcomeName = document.querySelector("#welcome-name")
onAuthStateChanged(auth, (user) => {
  if (user) {
    name.innerText = user.displayName
    gmail.innerText = user.email
    welcomeName.innerText = user.displayName
  } else {  
    name.innerText = "Người dùng"
  } 
});




const logoutBtn = document.querySelector(".btn-logout");
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../../Login/login.html";
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Đăng xuất thất bại. Vui lòng thử lại.");
  }
});

