# Tin học vui – Web ôn tập Tin học Tiểu học

Không cần cài thư viện. Cần Node.js ≥ 22.13.

## Chạy trong phòng tin

1. Trên máy giáo viên: `npm start` (đổi mã PIN: `TEACHER_PIN=5678 npm start`)
2. Học sinh mở địa chỉ `http://<IP máy GV>:3000` in ra trên màn hình (cùng mạng Wi‑Fi/LAN).
3. Giáo viên bấm **Giáo viên**, nhập PIN (mặc định `1234`).

Dữ liệu lưu trong `data.db` (SQLite). Sao lưu = copy file này. Xoá file = làm lại từ đầu với dữ liệu mẫu.

Chạy hoàn toàn offline: phông chữ (Baloo 2, Nunito, Dancing Script – SIL OFL) và hình đều nằm trong `public/`.

## Thêm bài học

Sửa `public/lessons.js`. Mỗi bài có `grade`, phần tóm tắt `summary` và danh sách `challenges` (dạng `quiz`, `drag`, `memory`, xem chú thích đầu file). Khối chưa có bài sẽ hiện "đang chuẩn bị".

## Ghi công

- Hình minh hoạ: [Microsoft Fluent Emoji](https://github.com/microsoft/fluentui-emoji) (MIT)
- Biểu tượng: [Lucide](https://lucide.dev) (ISC)
