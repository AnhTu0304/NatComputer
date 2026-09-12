# Design Specification: Socket.io Realtime Integration (Payment & Orders)

## 1. Overview
Hệ thống tích hợp Socket.io Realtime 2 chiều cho nền tảng NAT Computer:
1. **Khách hàng (Client/Checkout):** Nhận tín hiệu xác nhận thanh toán tức thì (`payment_confirmed`) từ MBBank/VietQR mà không cần reload trang.
2. **Quản trị viên (Admin Dashboard):** Nhận thông báo đơn hàng mới tức thì (`new_order`), cập nhật tổng doanh thu, số lượng đơn hàng, và chuông báo âm thanh Web Audio Chime mà không cần polling liên tục.

---

## 2. Architecture & Room Design

### Backend (`backend/socketManager.js`)
- **Port:** 5000 (Gắn chung với HTTP server qua `http.createServer(app)`)
- **Transports:** `['websocket', 'polling']`
- **Rooms:**
  - `order_<orderId>`: Room riêng cho từng khách hàng theo mã đơn hàng.
  - `admin_room`: Room dành riêng cho các tab quản trị viên đang mở dashboard.

### Events Matrix
| Event Name | Direction | Payload | Description |
|------------|-----------|---------|-------------|
| `join_order_room` | Client -> Server | `orderId` | Khách hàng đăng ký nghe kết quả thanh toán cho đơn hàng |
| `leave_order_room`| Client -> Server | `orderId` | Hủy đăng ký khi modal thanh toán đóng |
| `join_admin_room` | Admin -> Server | `null` | Admin đăng ký nhận thông báo toàn hệ thống |
| `leave_admin_room`| Admin -> Server | `null` | Hủy đăng ký khi admin chuyển trang |
| `payment_confirmed`| Server -> Client | `{ orderId, status: 'PAID', transactionCode, confirmedAt }` | Báo khách hàng thanh toán thành công qua MBBank |
| `new_order` | Server -> Admin | `Order Object` | Đẩy đơn hàng mới về dashboard admin realtime |
| `order_payment_updated` | Server -> Admin | `{ orderId, paymentStatus: 'PAID' }` | Cập nhật trạng thái thanh toán trên bảng đơn hàng |

---

## 3. Endpoints Integration
- `POST /api/orders`: Tự động gọi `notifyNewOrder(newOrder)` gửi socket `new_order` tới `admin_room`.
- `POST /api/payment/simulate-webhook`: Webhook endpoint cập nhật trạng thái đơn hàng và gửi `notifyPaymentSuccess(orderId, data)` tới room `order_<orderId>` và `admin_room`.

---

## 4. Verification Evidence
- **Backend Tests:** `socket.test.js` (2 tests), `server.test.js` (11 tests), `auth.test.js` (6 tests), `vietqr.test.js` (6 tests), `emailService.test.js` (6 tests) -> **31/31 passed**.
- **Frontend Tests:** `socket.test.js` (5 tests), `PaymentProcessingModal.test.js` (2 tests), `AdminPage.test.js` (4 tests), and full suite -> **49/49 passed**.
