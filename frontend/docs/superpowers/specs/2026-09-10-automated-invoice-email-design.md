# NAT Computer — Automated Invoice Email Dispatch System

**Date:** 2026-09-10  
**Status:** In Progress (Phase 2 - Feature B)  
**Authors:** NAT Computer Core Team & AI Pair Programmer  

---

## 1. Objectives & Overview

The **Automated Invoice Email Dispatch System** ensures that whenever a customer places an order or completes payment on the NAT Computer Storefront, a professional, responsive HTML invoice email is generated and delivered automatically to their registered email address.

### Key Goals:
1. **Instant Order Confirmation:** Send an automated email immediately upon order creation in `POST /api/orders`.
2. **Beautiful Responsive HTML Invoice:** Render a sleek, branded email template displaying:
   - NAT Computer Logo & Contact Hotline (`0886.976.868`).
   - Order Identifier `#NAT-XXXXXX` and creation timestamp.
   - Customer Details (Name, Phone, Shipping Address).
   - Detailed Product & PC Build Breakdown (CPU, GPU, RAM, SSD specs, quantity, unit price).
   - Financial Summary (Subtotal, Discount via Voucher, Total Amount in VNĐ).
   - Payment Method (e.g. *Chuyển khoản MBBank VietQR* / *MoMo* / *COD*) and Payment Status.
   - 36-Month Warranty Commitment & Support links.
3. **Resilient Dual-Mode Transporter (`nodemailer`):**
   - **Production Mode:** Sends real emails via configured SMTP credentials in `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
   - **Development / Test Fallback:** If SMTP is not yet configured or credentials are mock, falls back gracefully to local logging / test mailbox without throwing fatal exceptions or disrupting the checkout experience.
4. **Audit Trail:** Log all dispatched emails in PostgreSQL / DB (`sent_emails` table) for admin tracking.

---

## 2. Architecture & Data Flow

```
[Customer Checkouts on Storefront]
            │
            ▼
[POST /api/orders (Express Backend)]
      │                     │
      ▼                     ▼
[PostgreSQL / DB]    [emailService.sendInvoiceEmail(orderData)]
(Saves Order, Items)        │
                            ├──► Compiles Responsive HTML Invoice Template
                            ├──► Dispatches via Nodemailer (SMTP / Fallback)
                            └──► Records entry into `sent_emails` table
```

---

## 3. Skills Workflow

| Skill | Role in Implementation |
|---|---|
| **`test-driven-development`** | Test-first creation of `emailService.test.js`: testing HTML template compilation, SMTP dispatch, fallback handling, and `/api/email/send-invoice` endpoint. |
| **`vercel-react-best-practices`** | Clean UI feedback in `InvoiceModal.jsx` and `CheckoutPage.jsx` notifying the user that the invoice email has been dispatched. |
| **`verification-before-completion`** | Execute 100% of backend and frontend test suites with hard evidence before concluding. |

---

## 4. API Specification

### Endpoint: `POST /api/email/send-invoice`
- **Access:** Public / Storefront & Admin
- **Request Body:**
  ```json
  {
    "recipientEmail": "customer@example.com",
    "orderId": "NAT-123456",
    "order": {
      "customerName": "Ngô Anh Tú",
      "customerPhone": "0773071629",
      "shippingAddress": "456 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      "paymentMethod": "vietqr",
      "paymentMethodLabel": "Chuyển khoản Ngân hàng (MBBank VietQR)",
      "totalAmount": 25000000,
      "discountAmount": 500000,
      "appliedCoupon": "NAT500K",
      "items": [
        {
          "name": "PC GAMING LUXURY ULTRA 7 270K",
          "quantity": 1,
          "price": 25000000,
          "specs": { "cpu": "Core i7", "gpu": "RTX 4070", "ram": "32GB" }
        }
      ]
    }
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Đã gửi email hóa đơn thành công đến customer@example.com",
    "emailLog": {
      "id": "mail_1725960000000",
      "recipientEmail": "customer@example.com",
      "orderId": "NAT-123456",
      "status": "SENT"
    }
  }
  ```

---

## 5. Verification Plan

1. **Unit & Integration Tests (`backend/emailService.test.js`)**:
   - Test HTML invoice generator function (contains logo, order ID, items table, price).
   - Test `sendInvoiceEmail` function with mock/fallback SMTP.
   - Test `POST /api/orders` triggers automated email dispatch.
   - Test `POST /api/email/send-invoice` endpoint response.
2. **End-to-End Regression Verification**:
   - Run `npm test` across all backend test suites (auth, server, vietqr, emailService).
   - Run `npm test` across all frontend test suites.
