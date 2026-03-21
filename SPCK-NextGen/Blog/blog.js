import { auth, db } from "../Login/auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const listEl = document.querySelector(".blog-list");


function showPosts(posts) {
  listEl.innerHTML = "";

  if (posts.length === 0) {
    listEl.innerHTML = "<p>Chưa có bài viết</p>";
    return;
  }

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "blog-card";

    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content.slice(0, 100)}...</p>
      <button class="edit-btn" data-id="${post.id}">Sửa</button>
      <button class="delete-btn" data-id="${post.id}">Xóa</button>
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
      window.location.href = "create.html?id=" + id;
    });
  });
}


onAuthStateChanged(auth, (user) => {
  if (!user) {
    showPosts([]);
    window.location.href = "../Login/login.html";
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
