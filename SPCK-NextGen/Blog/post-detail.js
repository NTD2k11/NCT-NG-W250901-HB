import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, get, update, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

// Firebase
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

// Lấy ID bài viết từ URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const currentUserId = localStorage.getItem("user_id");

// DOM
const titleEl = document.getElementById("postTitle");
const contentEl = document.getElementById("postContent");
const authorEl = document.getElementById("postAuthor");
const dateEl = document.getElementById("postDate");
const viewsEl = document.getElementById("postViews");
const likesEl = document.getElementById("postLikes");
const likeBtn = document.getElementById("likeBtn");
const likeCount = document.getElementById("likeCount");

// Format ngày
function formatDate(t) {
  return t ? new Date(t).toLocaleDateString("vi-VN") : "Vừa xong";
}

// Tăng view
async function increaseViews() {
  const snap = await get(ref(db, `posts/${postId}/views`));
  const current = snap.val() || 0;
  await update(ref(db, `posts/${postId}`), { views: current + 1 });
  viewsEl.textContent = current + 1;
}

// Load Like
async function loadLikes() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const likes = snap.val() || 0;
  likeCount.textContent = likes;
  likesEl.textContent = likes;
}

// Toggle Like
async function toggleLike() {
  const snap = await get(ref(db, `posts/${postId}/likes`));
  const current = snap.val() || 0;

  const newLikes = likeBtn.classList.contains("liked") ? current - 1 : current + 1;
  await update(ref(db, `posts/${postId}`), { likes: newLikes });

  likeBtn.classList.toggle("liked");
  likeCount.textContent = newLikes;
  likesEl.textContent = newLikes;
}

// Load bài viết
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

// Events
likeBtn?.addEventListener("click", toggleLike);

document.getElementById("shareBtn")?.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
  alert("Đã copy link bài viết!");
});

loadPost();

// Comments
if (postId) {
    const commentsRef = ref(db, `comments/${postId}`);

    onValue(commentsRef, (snapshot) => {
        renderCommentList(snapshot);
    }, (err) => console.error("Loi onValue comments:", err));

    const submitBtn = document.getElementById("submit-comment");
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            const txtEl = document.getElementById("comment-text");
            const text = txtEl?.value.trim();
            if (!text) {
              alert("Vui long nhap noi dung binh luan.");
              location.href = "/SPCK-NextGen/Login.html?id=" + postId;
              return;
            }

            if (!currentUserId) {
                if (confirm("Ban can dang nhap de gui binh luan. Dieu huong toi trang dang nhap?")) {
                    window.location.href = "./login.html";
                }
                return;
            }

            const username = localStorage.getItem("username") || "Nguoi dung";
            const newComment = { userId: currentUserId, username, text, timestamp: Date.now() };

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


function renderCommentList(snapshot) {
    const listEl = document.getElementById('comments-list');
    listEl.innerHTML = '';
    if (!snapshot || !snapshot.exists()) {
        listEl.innerHTML = '<p>Chưa có bình luận nào.</p>';
        return;
    }

    const data = snapshot.val();
    const entries = Object.entries(data).sort((a, b) => {
        const ta = a[1].timestamp || 0;
        const tb = b[1].timestamp || 0;
        return tb - ta;
    });


    entries.forEach(([cid, c]) => {
        const item = document.createElement('div');
        item.className = 'comment-item';

        const meta = document.createElement('div');
        meta.className = 'comment-meta';
        const name = c.username || (c.userId ? 'Người dùng' : 'Khách');
        const time = c.timestamp ? new Date(c.timestamp).toLocaleString() : '';
        meta.textContent = `${name} • ${time}${c.edited ? ' • đã chỉnh sửa' : ''}`;

        const textWrap = document.createElement('div');
        textWrap.className = 'comment-text';
        textWrap.textContent = c.text;

        const actions = document.createElement('div');
        actions.className = 'comment-actions-small';

        if (currentUserId && c.userId === currentUserId) {
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Chỉnh sửa';
            btnEdit.className = 'btn-comment-edit';

            const btnDelete = document.createElement('button');
            btnDelete.textContent = 'Xóa';
            btnDelete.className = 'btn-comment-delete';

            actions.appendChild(btnEdit);
            actions.appendChild(btnDelete);

            btnDelete.addEventListener('click', async () => {
                if (!confirm('Xác nhận xóa bình luận này?')) return;
                try {
                    await remove(ref(db, `comments/${postId}/${cid}`));
                } catch (err) {
                    console.error('Xóa bình luận lỗi:', err);
                    alert('Xóa thất bại.');
                }
            });

            btnEdit.addEventListener('click', () => {
                const ta = document.createElement('textarea');
                ta.value = c.text;
                ta.rows = 3;
                ta.style.width = '100%';
                const btnSave = document.createElement('button');
                btnSave.textContent = 'Lưu';
                btnSave.className = 'btn-comment-save';
                const btnCancel = document.createElement('button');
                btnCancel.textContent = 'Hủy';
                btnCancel.className = 'btn-comment-cancel';
                textWrap.style.display = 'none';
                actions.style.display = 'none';

                item.appendChild(ta);
                item.appendChild(btnSave);
                item.appendChild(btnCancel);

                btnCancel.addEventListener('click', () => {
                    ta.remove();
                    btnSave.remove();
                    btnCancel.remove();
                    textWrap.style.display = '';
                    actions.style.display = '';
                });

                btnSave.addEventListener('click', async () => {
                    const newText = ta.value.trim();
                    if (!newText) return alert('Nội dung rỗng.');
                    try {
                        await update(ref(db, `comments/${postId}/${cid}`), {
                            text: newText,
                            edited: true,
                            editedAt: Date.now()
                        });
                    } catch (err) {
                        console.error('Cập nhật bình luận lỗi:', err);
                        alert('Cập nhật thất bại.');
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
