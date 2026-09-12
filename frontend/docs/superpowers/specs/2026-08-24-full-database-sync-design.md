# NAT Computer — Full Database Synchronization (PostgreSQL & Frontend)

Date: 2026-08-24
Status: Approved by user
Path chosen: Approach A — Dynamic Data Fetching with Robust Fallback & Full Admin Sync

## 1. Context & Objectives

NAT Computer requires complete synchronization between the React Frontend and the Node.js Express + PostgreSQL Backend:
1. **User Authentication & Registration:** Users registering or logging in on the storefront (`LoginPage.jsx`, `AuthModal.jsx`) must be validated and saved directly in the PostgreSQL `users` table.
2. **Dynamic Product & Category Catalog:** Storefront pages (`HomePage`, `CategoryPage`, `HotSalePage`, `ProductDetailPage`) fetch live products and categories from PostgreSQL via REST APIs (`/api/products`, `/api/admin/categories`).
3. **Admin Management Events:** When an admin adds, edits, or deletes products/categories/banners in `AdminPage.jsx`, these operations are persisted into PostgreSQL, and changes immediately reflect on the Storefront.
4. **Resilient UX with Fallback:** If the backend is loading or recovering, fallback data prevents UI breaking.

---

## 2. Architecture & Data Flow

```
[React Frontend (Storefront & Admin)]
   │
   ├─► Storefront Pages (HomePage, CategoryPage, HotSalePage, ProductDetailPage)
   │     └─► api.getProducts(), api.getAdminCategories()
   │
   ├─► Auth Flows (LoginPage, AuthModal, ProfilePage)
   │     └─► api.login(), api.register(), token/session persistence
   │
   ├─► Admin Dashboard (AdminPage)
   │     └─► api.addAdminProduct(), api.updateAdminProduct(), api.deleteAdminProduct()
   │     └─► api.addAdminCategory(), api.deleteAdminCategory()
   │     └─► api.getAdminOrders(), api.updateOrderStatus()
   │
   ▼
[Express Backend API (localhost:5000/api)]
   │
   ▼
[PostgreSQL Database (`nat_computer`)]
   ├── users (id, name, email, phone, password, role, address, created_at)
   ├── categories (id, name, slug, description, created_at)
   ├── products (id, name, slug, category_id, price, original_price, rating, badge, image_url, description, specs_json, created_at)
   ├── orders & order_items
   └── banners & payments
```

---

## 3. Detailed Component Changes

### 3.1. Authentication & Registration (`LoginPage.jsx`, `AuthModal.jsx`)
- Replace simulated `setTimeout` mock login with `api.login(emailOrPhone, password)` and `api.register(name, email, phone, password)`.
- When registration succeeds:
  - Account is stored in PostgreSQL `users` table.
  - Return authenticated user data & token.
  - Automatically log the user in and persist to `localStorage.getItem('nat_user')`.
- Handle error messages from backend gracefully (e.g., "Email này đã được đăng ký tài khoản", "Mật khẩu không chính xác").

### 3.2. HomePage Dynamic Synchronization (`HomePage.jsx`)
- Call `api.getProducts()` on mount.
- Categorize dynamic products into:
  - `HOT_DEALS`: products marked with hot badge or highest discount.
  - `GAMING_PCS`: `category === 'gaming' || category === 'pc-gaming'`.
  - `OFFICE_PCS`: `category === 'office' || category === 'pc-office'`.
  - `COMPONENTS`: `category === 'components' || category === 'linh-kien'`.
  - `MONITORS`: `category === 'monitors' || category === 'man-hinh'`.
- Pass live categorized items to each `CategoryCarousel` and `HotDealsSection`.

### 3.3. Category Page Synchronization (`CategoryPage.jsx`)
- Fetch categories dynamically from `api.getAdminCategories()`.
- Use dynamic category tabs and live product list from PostgreSQL.
- Filter and search against live data.

### 3.4. Product Detail Page Synchronization (`ProductDetailPage.jsx`)
- Fetch product details matching `id` from PostgreSQL / `api.getProducts()`.
- Ensure real specifications and pricing are displayed.

### 3.5. Admin Dashboard Sync (`AdminPage.jsx`)
- Support adding and updating products with full category selection synced with `categories` table.
- Support adding/deleting categories with slug generation and database storage.
- Auto-refresh and trigger UI state updates when operations complete.

---

## 4. Error Handling & Fallbacks

- **Network Downtime / Delay:** If backend request fails or takes time to respond, fallback to curated dataset in `catalogData.js` so user never sees an empty broken screen.
- **Form Validation:** Client-side validation for required fields before submitting to API.
- **Admin Feedback:** Clear alert toasts for success/failure on every CRUD operation.

---

## 5. Testing & Verification Plan

1. **Backend API Tests:** Verify all endpoints with PostgreSQL connection.
2. **Storefront Smoke Tests:** Run React unit tests (`npm test`) to ensure all components render properly with dynamic data.
3. **End-to-End Verification:**
   - Register a new user and verify record in PostgreSQL `users` table.
   - Login with the new user credentials.
   - Add a new product in Admin dashboard, verify insertion into PostgreSQL `products` table and verify appearance on HomePage carousel and CategoryPage.
   - Add a new category in Admin dashboard, verify insertion into PostgreSQL `categories` table.
