# 🗺️ SPCK-NextGen Navigation Map

## ✅ Navigation Links - Đã Cập Nhật

### 📑 Trang Chủ & Dự Án
- **`index.html`** - Trang chủ dự án
  - ✅ Dashboard → `dashboard.html`
  - ✅ Trang chủ blog → `Home/home.html`
  - ✅ Bài viết của tôi → `Blog/blog.html`
  - ✅ Cài đặt → `Settings/settings.html`
  - ✅ Về chúng tôi → `About/about.html`
  - ✅ Liên hệ → `Contact/contact.html`
  - ✅ Đăng nhập → `login.html`
  - ✅ Đăng ký → `signup.html`

### 🔐 Xác Thực & Đăng Ký
- **`login.html`** - Trang đăng nhập
  - ✅ Đăng ký → `signup.html`
  - ✅ Quay lại → `index.html`
  - ✅ Dashboard → `dashboard.html`

- **`signup.html`** - Trang đăng ký
  - ✅ Đăng nhập → `login.html`
  - ✅ Quay lại → `index.html`
  - ✅ Dashboard → `dashboard.html`

### 📊 Dashboard & Trang Chính
- **`dashboard.html`** - Bảng điều khiển chính
  - ✅ Dashboard (active)
  - ✅ Khám phá → `explore.html` (sắp tạo)
  - ✅ Thông báo → `notifications.html` (sắp tạo)
  - ✅ Hồ sơ → `profile.html` (sắp tạo)
  - ✅ Bài viết → `Blog/blog.html`
  - ✅ Search, Theme, Logout (sẵn HTML)

- **`Home/home.html`** - Trang chủ blog
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ (active)
  - ✅ Bài viết của tôi → `../Blog/blog.html`
  - ✅ Cài đặt → `../Settings/settings.html`
  - ✅ Về chúng tôi → `../About/about.html`
  - ✅ Liên hệ → `../Contact/contact.html`

### 📚 Blog Section
- **`Blog/blog.html`** - Danh sách bài viết
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ → `../Home/home.html`
  - ✅ Tạo bài viết → `create.html`
  - ✅ Bài viết của tôi (active)
  - ✅ Thông tin → `info.html`
  - ✅ Cài đặt → `../Settings/settings.html`
  - ✅ Về chúng tôi → `../About/about.html`

- **`Blog/create.html`** - Tạo bài viết mới
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ → `../Home/home.html`
  - ✅ Tạo bài viết (active)
  - ✅ Blog của tôi → `blog.html`
  - ✅ Cài đặt → `../Settings/settings.html`

- **`Blog/info.html`** - Thông tin blog
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ → `../Home/home.html`
  - ✅ Tạo bài viết → `create.html`
  - ✅ Bài viết của tôi → `blog.html`
  - ✅ Thông tin (active)
  - ✅ Cài đặt → `../Settings/settings.html`
  - ✅ Về chúng tôi → `../About/about.html`

- **`Blog/post.html`** - Chi tiết bài viết
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ → `../Home/home.html`
  - ✅ Tạo bài viết → `create.html`
  - ✅ Bài viết của tôi → `blog.html`
  - ✅ Thông tin → `info.html`
  - ✅ Cài đặt → `../Settings/settings.html`
  - ✅ Về chúng tôi → `../About/about.html`

### ⚙️ Settings
- **`Settings/settings.html`** - Cài đặt
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Trang chủ → `../Home/home.html`
  - ✅ Tạo bài viết → `../Blog/create.html`
  - ✅ Bài viết của tôi → `../Blog/blog.html`
  - ✅ Cài đặt (active)
  - ✅ Về chúng tôi → `../About/about.html`

### 📖 Thông Tin & Liên Hệ
- **`About/about.html`** - Về chúng tôi
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Quay lại → `../index.html`

- **`Contact/contact.html`** - Liên hệ chúng tôi
  - ✅ Dashboard → `../dashboard.html`
  - ✅ Quay lại → `../index.html`

## 📋 Tóm tắt cấu trúc

```
SPCK-NextGen/
│
├── 📄 index.html .......................... Trang chủ dự án (Hub trung tâm)
├── 📊 dashboard.html ..................... Bảng điều khiển (After login)
├── 🔐 login.html ......................... Đăng nhập
├── 🔐 signup.html ........................ Đăng ký
│
├── 📁 Home/
│   ├── home.html ........................ Trang chủ blog (Browse)
│   ├── home.css
│   └── home.js
│
├── 📁 Blog/
│   ├── blog.html ........................ Danh sách bài viết
│   ├── create.html ..................... Tạo bài viết mới
│   ├── info.html ....................... Thông tin blog
│   ├── post.html ....................... Chi tiết bài viết
│   ├── blog.css
│   └── post.html
│
├── 📁 Settings/
│   ├── settings.html ................... Cài đặt tài khoản
│   └── settings.css
│
├── 📁 About/
│   ├── about.html ..................... Về chúng tôi
│   └── about.css
│
├── 📁 Contact/
│   ├── contact.html ................... Liên hệ chúng tôi
│   ├── contact.css
│   └── contact.js
│
├── 📁 images/
│   └── [placeholder images]
│
├── 🎨 dashboard.css ..................... Styling cho Dashboard
├── 🎨 index.css ......................... Styling cho trang chủ
├── 🎨 auth.css .......................... Styling cho login/signup
└── 📜 auth.js ........................... Xác thực form

```

## 🔗 Hướng dẫn Điều hướng

### Từ Trang Chủ (`index.html`)
- **👤 Người dùng chưa đăng nhập:**
  - Có thể xem Home, Blog, Settings, About, Contact
  - Phải đăng nhập để truy cập Dashboard
  
- **✅ Người dùng đã đăng nhập:**
  - Vào Dashboard → Chọn tính năng
  - Truy cập tất cả các trang

### Luồng Đăng Nhập
```
index.html → login.html → dashboard.html
                     ↓
                signup.html → dashboard.html
```

### Luồng Chính Dùng
```
Dashboard (Trung tâm)
    ├→ Khám phá (explore.html)
    ├→ Thông báo (notifications.html)
    ├→ Hồ sơ (profile.html)
    ├→ Bài viết → Blog/blog.html
    │           ├→ Tạo → create.html
    │           ├→ Thông tin → info.html
    │           └→ Chi tiết → post.html
    └→ Cài đặt (Settings/settings.html)
```

## 🔧 Lỗi & Sửa

### ✅ Đã Sửa
- ✅ Logo không nhất quán → **Cập nhật thành `📝 BlogHub`** trên tất cả pages
- ✅ Thiếu Dashboard link → **Thêm vào tất cả sidebars**
- ✅ Emoji không nhất quán → **Chuẩn hóa emojis**
- ✅ Link relative sai → **Sửa tất cả paths**
- ✅ Settings sidebar → **Thêm Blog/create.html link**

### 📝 Cần Tạo
- ⏳ `explore.html` - Trang khám phá bài viết
- ⏳ `notifications.html` - Trang thông báo
- ⏳ `profile.html` - Trang hồ sơ người dùng
- ⏳ `explore.css` - Styling cho trang khám phá
- ⏳ `notifications.css` - Styling cho trang thông báo
- ⏳ `profile.css` - Styling cho trang hồ sơ

## 💡 Ghi Chú
- Tất cả paths đều sử dụng relative links
- Emojis được chuẩn hóa để dễ nhận dạng
- Active states được đánh dấu rõ ràng
- Có back links từ tất cả pages

---
**Cập nhật lần cuối:** 8/12/2025
