import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
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

function formatDate(value) {
  if (!value) return "Vừa xong";
  if (typeof value === "number") {
    return new Date(value).toLocaleDateString("vi-VN");
  }
  if (typeof value === "string") return value;
  return "Vừa xong";
}

function renderHotPosts(posts) {
  const container = document.getElementById("hotPosts");
  if (!container) return;

  if (!posts.length) {
    container.innerHTML = "<p>Chưa có bài viết nào.</p>";
    return;
  }

  container.innerHTML = posts
    .map((post) => {
      const title = post.title || "Bài viết chưa có tiêu đề";
      const excerpt = post.content
        ? post.content.slice(0, 120) + (post.content.length > 120 ? "..." : "")
        : "Chưa có mô tả.";
      const image =
        post.imageUrl ||
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop";
      const category = post.category || "Khác";
      const author = post.authorName || "Ẩn danh";
      const date = formatDate(post.createdAt);
      const views = post.views ?? 0;
      const likes = post.likes ?? 0;
      const postId = post.id || "";

      return `
        <article class="blog-card featured" data-id="${postId}">
          <div class="card-image">
            <img src="${image}" alt="">
            <span class="badge">🔥 HOT</span>
          </div>
          <div class="card-content">
            <span class="category">${category}</span>
            <h4>${title}</h4>
            <p>${excerpt}</p>
            <div class="card-footer">
              <div class="author-info">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(
                  author
                )}&size=32&background=7b8cff&color=fff" alt="">
                <div>
                  <p class="author">${author}</p>
                  <p class="date">${date}</p>
                </div>
              </div>
              <div class="stats">
                <span>👁️ ${views}</span>
                <span>❤️ ${likes}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadHotPosts() {
  try {
    const snap = await get(ref(db, "posts"));
    const data = snap.val();
    if (!data) {
      renderHotPosts([]);
      return;
    }

    const posts = Object.entries(data)
      .map(([id, post]) => ({
        ...post,
        id
      }))
      .filter((p) => p && (p.isHot === true || p.featured === true || p.hot === true))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      .slice(0, 3);

    renderHotPosts(posts);
  } catch (err) {
    console.error("Load hot posts failed:", err);
    renderHotPosts([]);
  }
}

function extractCardData(card) {
  const title = card.querySelector("h4")?.textContent?.trim() || "";
  const excerpt = card.querySelector(".card-content p")?.textContent?.trim() || "";
  const category = card.querySelector(".category")?.textContent?.trim() || "";
  const image = card.querySelector(".card-image img")?.getAttribute("src") || "";
  const author =
    card.querySelector(".author")?.textContent?.trim() ||
    card.querySelector(".author-info-small span")?.textContent?.trim() ||
    "";
  const date =
    card.querySelector(".date")?.textContent?.trim() ||
    card.querySelector(".date-small")?.textContent?.trim() ||
    "";

  return {
    title,
    content: excerpt,
    imageUrl: image,
    category,
    authorName: author,
    createdAt: date
  };
}

function handleCardClick(event) {
  const card = event.target.closest(".blog-card");
  if (!card) return;

  const payload = extractCardData(card);
  if (payload.title || payload.content) {
    sessionStorage.setItem("postDetailData", JSON.stringify(payload));
  }

  const postId = card.getAttribute("data-id");
  let url = "../Blog/post-detail.html";
  if (postId) {
    url += `?id=${encodeURIComponent(postId)}`;
  }

  window.location.href = url;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../login.html";
  }
});

loadHotPosts();

const logoutBtn = document.querySelector(".btn-logout");
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "../login.html";
  } catch (err) {
    console.error("Logout failed:", err);
    alert("Đăng xuất thất bại. Vui lòng thử lại.");
  }
});

document.addEventListener("click", handleCardClick);
