import { auth, db } from "../auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

/* ========= LAY INPUT ========= */
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const publishBtn = document.getElementById("btnPublish");
const draftBtn = document.getElementById("btnSave");
const previewBtn = document.getElementById("btnPreview");

const recentPostsDiv = document.getElementById("recentPosts");

/* ========= LUU BAI ========= */
async function savePost(status) {
  const user = auth.currentUser;
  if (!user) return alert("Ban chua dang nhap!");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return alert("Thieu tieu de hoac noi dung");

  const post = {
    title,
    content,
    status,
    createdAt: Date.now(),
    authorId: user.uid,
    authorName: user.displayName || "Nguoi dung"
  };

  try {
    await push(ref(db, "posts"), post);
    alert(status === "draft" ? "Da luu ban nhap!" : "Dang bai thanh cong!");

    if (status === "published") {
      window.location.href = "../Home/home-modern.html";
    }

  } catch (err) {
    alert("Loi: " + err.message);
  }
}

/* ========= NUT ========= */
publishBtn?.addEventListener("click", () => savePost("published"));
draftBtn?.addEventListener("click", () => savePost("draft"));

/* ========= PREVIEW ========= */
previewBtn?.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) return alert("Viet gi do truoc da");

  const previewWindow = window.open("", "_blank");
  previewWindow.document.write(`<h1>${title}</h1><p>${content.replace(/\n/g, "<br>")}</p>`);
});

/* ========= LOAD BAI CUA USER ========= */
onAuthStateChanged(auth, (user) => {
  if (!user) return;
  if (!recentPostsDiv) return;

  const postsRef = ref(db, "posts");

  onValue(postsRef, (snapshot) => {
    const data = snapshot.val() || {};
    recentPostsDiv.innerHTML = "";

    let hasPost = false;

    for (let id in data) {
      const post = data[id];
      if (post.authorId === user.uid) {
        hasPost = true;

        recentPostsDiv.innerHTML += `
          <div style="padding:10px;border-bottom:1px solid #ccc;">
            <b>${post.title}</b> - ${post.status}
          </div>
        `;
      }
    }

    if (!hasPost) {
      recentPostsDiv.innerHTML = "<p>Tai khoan moi chua co bai viet.</p>";
    }
  });
});
