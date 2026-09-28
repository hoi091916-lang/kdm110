# 🎮 Contra Quiz Commando - Đấu Trường Tri Thức

Game hành động phong cách Contra kinh điển kết hợp thử thách trắc nghiệm giáo dục sinh tồn vô tận (Endless Runner).

---

## 🚀 Hướng Dẫn Chạy & Triển Khai Lên GitHub Pages

### 1. Chạy trên máy cá nhân (Local)
```bash
# Cài đặt thư viện
npm install

# Khởi động máy chủ phát triển
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

### 2. Đưa lên GitHub Pages (2 Cách Cực Dễ)

#### 👉 CÁCH 1: Dùng 1 lệnh tự động (Khuyên dùng)
```bash
npm run deploy
```
* Lệnh này sẽ tự động build vào thư mục `dist` và đẩy lên nhánh `gh-pages`.
* Trên GitHub: Vào **Settings** -> **Pages** -> Tại ô **Branch**, chọn nhánh **`gh-pages`** -> Chọn **`/(root)`** -> Bấm **Save**.
* Trang web sẽ hoạt động ngay lập tức!

#### 👉 CÁCH 2: Dùng GitHub Actions
Dự án đã có sẵn file `.github/workflows/deploy.yml`.
1. Đẩy code lên GitHub (`git add .`, `git commit -m "update"`, `git push origin main`).
2. Trên GitHub: Vào **Settings** -> **Pages** -> Tại ô **Source**, chọn **`GitHub Actions`**.
3. Chờ 1-2 phút là trang web online tự động!

---

## 🛠️ Công Nghệ Sử Dụng
* **React 19 + TypeScript**: Kiến trúc component hiện đại.
* **HTML5 Canvas 2D Engine**: Xử lý vật lý nhảy, cúi né đạn, hệ thống hạt (particles) 60 FPS.
* **Web Audio API**: Bộ tổng hợp âm thanh 8-bit retro arcade không cần tải file mp3 ngoài.
* **Tailwind CSS v4**: Giao diện người dùng sang trọng, responsive.
* **LocalStorage**: Lưu trữ và cập nhật ngân hàng câu hỏi bền vững ngay trên trình duyệt.
