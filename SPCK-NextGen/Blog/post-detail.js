import { auth, db, syncAuthLocalState } from "../Login/auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { ref, get, update, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

let currentUserId = null;
let currentUsername = "Nguoi dung";

const titleEl = document.getElementById("postTitle");
const contentEl = document.getElementById("postContent");
const authorEl = document.getElementById("postAuthor");
const dateEl = document.getElementById("postDate");
const viewsEl = document.getElementById("postViews");
const likesEl = document.getElementById("postLikes");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

function formatDate(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleDateString("vi-VN") : "Vua xong";
}

onAuthStateChanged(auth, (user) => {
  syncAuthLocalState(user);
  currentUserId = user?.uid || null;
  currentUsername = user?.displayName || localStorage.getItem("username") || "Nguoi dung";
});

async function increaseViews() {
  const snap = await get(ref(db, `posts/${postId}/views`));
  const current = snap.val() || 0;
  await update(ref(db, `posts/${postId}`), { views: current + 1 });
  viewsEl.textContent = current + 1;
}

async function loadLikes() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const likes = snap.val() || 0;
  likeCount.textContent = likes;
  likesEl.textContent = likes;
}

async function toggleLike() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const current = snap.val() || 0;
  const newLikes = likeBtn.classList.contains("liked") ? current - 1 : current + 1;

  await update(ref(db, `posts/${postId}`), { likes: newLikes });

  likeBtn.classList.toggle("liked");
  likeCount.textContent = newLikes;
  likesEl.textContent = newLikes;
}

async function loadPost() {
  if (!postId) return;

  const snap = await get(ref(db, `posts/${postId}`));
  const post = snap.val();

  if (!post) {
    document.getElementById("postEmpty").hidden = false;
    return;
  }

  titleEl.textContent = post.title;
  contentEl.innerHTML = (post.content || "").replace(/\n/g, "<p></p>");
  authorEl.textContent = post.authorName || "An danh";
  dateEl.textContent = formatDate(post.createdAt);

  await increaseViews();
  await loadLikes();
}

function renderCommentList(snapshot) {
  const listEl = document.getElementById("comments-list");
  listEl.innerHTML = "";

  if (!snapshot || !snapshot.exists()) {
    listEl.innerHTML = "<p>Chua co binh luan nao.</p>";
    return;
  }

  const data = snapshot.val();
  const entries = Object.entries(data).sort((a, b) => {
    const ta = a[1].timestamp || 0;
    const tb = b[1].timestamp || 0;
    return tb - ta;
  });

  entries.forEach(([cid, comment]) => {
    const item = document.createElement("div");
    item.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";
    const name = comment.username || (comment.userId ? "Nguoi dung" : "Khach");
    const time = comment.timestamp ? new Date(comment.timestamp).toLocaleString() : "";
    meta.textContent = `${name} • ${time}${comment.edited ? " • da chinh sua" : ""}`;

    const textWrap = document.createElement("div");
    textWrap.className = "comment-text";
    textWrap.textContent = comment.text;

    const actions = document.createElement("div");
    actions.className = "comment-actions-small";

    if (currentUserId && comment.userId === currentUserId) {
      const btnEdit = document.createElement("button");
      btnEdit.textContent = "Chinh sua";
      btnEdit.className = "btn-comment-edit";

      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Xoa";
      btnDelete.className = "btn-comment-delete";

      actions.appendChild(btnEdit);
      actions.appendChild(btnDelete);

      btnDelete.addEventListener("click", async () => {
        if (!confirm("Xac nhan xoa binh luan nay?")) return;

        try {
          await remove(ref(db, `comments/${postId}/${cid}`));
        } catch (err) {
          console.error("Xoa binh luan loi:", err);
          alert("Xoa that bai.");
        }
      });

      btnEdit.addEventListener("click", () => {
        const textarea = document.createElement("textarea");
        textarea.value = comment.text;
        textarea.rows = 3;
        textarea.style.width = "100%";

        const btnSave = document.createElement("button");
        btnSave.textContent = "Luu";
        btnSave.className = "btn-comment-save";

        const btnCancel = document.createElement("button");
        btnCancel.textContent = "Huy";
        btnCancel.className = "btn-comment-cancel";

        textWrap.style.display = "none";
        actions.style.display = "none";

        item.appendChild(textarea);
        item.appendChild(btnSave);
        item.appendChild(btnCancel);

        btnCancel.addEventListener("click", () => {
          textarea.remove();
          btnSave.remove();
          btnCancel.remove();
          textWrap.style.display = "";
          actions.style.display = "";
        });

        btnSave.addEventListener("click", async () => {
          const newText = textarea.value.trim();
          if (!newText) {
            alert("Noi dung rong.");
            return;
          }

          try {
            await update(ref(db, `comments/${postId}/${cid}`), {
              text: newText,
              edited: true,
              editedAt: Date.now()
            });
          } catch (err) {
            console.error("Cap nhat binh luan loi:", err);
            alert("Cap nhat that bai.");
          }
        });
      });
    }

    item.appendChild(meta);
    item.appendChild(textWrap);
    item.appendChild(actions);
    listEl.appendChild(item);
  });
}

likeBtn?.addEventListener("click", toggleLike);

document.getElementById("shareBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Da copy link bai viet!");
});

loadPost();

if (postId) {
  const commentsRef = ref(db, `comments/${postId}`);

  onValue(
    commentsRef,
    (snapshot) => {
      renderCommentList(snapshot);
    },
    (err) => console.error("Loi onValue comments:", err)
  );

  const submitBtn = document.getElementById("submit-comment");
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const txtEl = document.getElementById("comment-text");
      const text = txtEl?.value.trim();

      if (!text) {
        alert("Vui long nhap noi dung binh luan.");
        return;
      }

      if (!currentUserId) {
        if (confirm("Ban can dang nhap de gui binh luan. Dieu huong toi trang dang nhap?")) {
          window.location.href = "../Login/login.html";
        }
        return;
      }

      const newComment = {
        userId: currentUserId,
        username: currentUsername,
        text,
        timestamp: Date.now()
      };

      try {
        await push(ref(db, `comments/${postId}`), newComment);
        txtEl.value = "";
      } catch (err) {
        console.error("Loi khi gui binh luan:", err);
        alert("Gui binh luan that bai.");
      }
    });
  } else {
    console.warn("Khong tim thay nut #submit-comment tren trang.");
  }
} else {
  console.warn("Khong co post id trong URL, comments se khong duoc tai.");
}
