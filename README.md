# 🎓 Công Cụ Mở Khóa & Cập Nhật Thông Tin VHU Portal

<p align="center">
  <img src="https://img.shields.io/badge/VHU-Portal%20Fix-00c853?style=flat&logo=school" alt="VHU Fix" />
  <img src="https://img.shields.io/badge/Tr%E1%BA%A1ng%20th%C3%A1i-Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20100%25-brightgreen" alt="Status" />
  <img src="https://img.shields.io/badge/Gi%E1%BA%A3i%20ph%C3%A1p-L%C6%B0u%20v%C4%A9nh%20vi%E1%BB%85n-blue" alt="Permanent Save" />
</p>

<p align="center">
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flkey124%2Fvhu">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </a>
</p>

> 📢 **LƯU Ý:** Cách này chỉ dùng tạm thời chờ thông báo nếu mn cần vào portal gấp thôi nha!

---

## 📌 Vấn đề thường gặp tại Portal VHU
Khi sinh viên đăng nhập vào Cổng thông tin sinh viên VHU (`https://portal.vhu.edu.vn/student`), hệ thống yêu cầu **Cập nhật thông tin bắt buộc** nhưng:
- Ô **Phường xã \*** bị kẹt thông báo **`No options`** (do hệ thống thiếu danh mục xã của tỉnh).
- Bị khóa màn hình, không thể bấm Lưu để vào xem điểm, thời khóa biểu, học phí.
- Nếu chỉ gỡ popup tạm thời thì khi **F5** sẽ bị hiện lại.

---

## ✨ Tính năng của Script Fix
1. 🛡️ **Giữ nguyên thông tin**: Những mục bạn đã điền (Họ tên, SĐT, Email, CCCD...) được giữ nguyên 100%, không bị ghi đè.
2. 🎯 **Mở sổ dropdown trực tiếp trên web**: Không cần bật bảng phụ che màn hình, script tự động nạp danh sách và **mở sổ menu thẳng xuống ngay trên form web VHU** cho các ô lỗi & ô Phường/Xã để bạn bấm chọn trực tiếp!
3. 🏥 **Không random mã BHYT**: Nhập đúng mã thẻ BHYT thật của bạn.
4. ⚡ **Mở khóa ô Phường xã**: Tự động xử lý mã xã chuẩn dưới 10 ký tự, không bao giờ bị lỗi tràn dữ liệu SQL Server (`String or binary data would be truncated`).
5. 💾 **Lưu vĩnh viễn**: Gửi dữ liệu hợp lệ thẳng lên máy chủ trường VHU, từ đó **F5 hoặc đăng nhập lại thoải mái không bao giờ bị hiện lại bảng này nữa**.

---

## 📖 Hướng dẫn sử dụng (3 bước)

### 1️⃣ Bước 1: Sao chép mã
Sao chép toàn bộ nội dung file [`vhu_fix_tool.js`](./vhu_fix_tool.js) hoặc bấm vào link:  
👉 **[Bấm vào đây để xem và copy mã 1-chạm](https://dpaste.com/EYCQ2M22B)**

### 2️⃣ Bước 2: Mở Console trên trình duyệt
1. Mở trang Cập nhật thông tin VHU bị kẹt trên máy tính.
2. Nhấn phím **F12** (hoặc chuột phải vào khoảng trống chọn **Kiểm tra / Inspect**).
3. Bấm chuyển sang tab **Console** (ở hàng trên cùng).

> ⚠️ **LƯU Ý NẾU CHROME CHẶN KHÔNG CHO DÁN:**  
> Nếu bạn thấy dòng cảnh báo màu đỏ: *"Warning: Don't paste code into the DevTools Console..."*  
> Bạn chỉ cần gõ chữ **`allow pasting`** vào Console rồi bấm **Enter**. Sau đó dán mã bình thường!

### 3️⃣ Bước 3: Dán mã & Hoàn tất
1. Nhấn **Ctrl + V** để dán đoạn mã vào rồi nhấn **Enter**.
2. Các ô lỗi & ô Phường/Xã trên trang web sẽ **tự động mở sổ menu xuống** với đầy đủ các lựa chọn. Bạn chọn trực tiếp trên form và bấm **🚀 Lưu Vĩnh Viễn** (hoặc bấm Lưu trên form của trường).
3. Đợi thông báo **"🎉 ĐÃ LƯU THÀNH CÔNG VĨNH VIỄN!"** &rarr; Trang web sẽ tự tải lại và đưa bạn vào thẳng trang chủ Portal sinh viên!

### 🎬 Video Hướng Dẫn Nhanh (30 giây)
Xem video hướng dẫn trực quan các bước thao tác trên trình duyệt (có thể xem trực tiếp tại trang web hướng dẫn hoặc file [`huong-dan.mp4`](./huong-dan.mp4)).

---

## 🎁 Ưu Đãi Độc Quyền - BinhLuu Store

Ghé thăm gian hàng tài khoản bản quyền giá sinh viên chính chủ:
- **Sản phẩm nổi bật**: **Locket Gold**, **CapCut Pro**, Netflix 4K, ChatGPT Plus, YouTube Premium, Spotify... và nhiều tài khoản khác!
- 🔥 **ĐẶC BIỆT**: Mua tài khoản bất kỳ trên shop **TẶNG NGAY 1 THÁNG CANVA PRO** chính chủ!

👉 **[🛒 GHÉ THĂM GIAN HÀNG BINHLUU STORE](https://binhluu.ai.studio/)**

---

## 👨‍💻 Tác giả & Đóng góp
Dự án được tạo nhằm hỗ trợ cộng đồng sinh viên Trường Đại học Văn Hiến (VHU) vượt qua lỗi kỹ thuật biểu mẫu.
