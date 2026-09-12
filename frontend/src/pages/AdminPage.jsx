import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Cpu,
  FolderTree,
  Image as ImageIcon,
  Users,
  Bell,
  Search,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Plus,
  Edit,
  Trash2,
  FileText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  LogOut,
  Sparkles,
  DollarSign,
  PackageCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Volume2,
  CreditCard,
  X,
  SlidersHorizontal,
  Ticket,
  Tag,
  Percent
} from 'lucide-react';
import api from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import {
  joinAdminRoom,
  leaveAdminRoom,
  onNewOrder,
  onOrderPaymentUpdated
} from '../services/socket';

export default function AdminPage({ user, onLogout }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('ecommerce'); // 'ecommerce', 'orders', 'products', 'categories', 'banners', 'coupons', 'users'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Data states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 145000000,
    todayRevenue: 45900000,
    totalOrders: 14,
    totalProducts: 24,
    totalUsers: 3782,
    monthlyTarget: 500000000,
    monthlyTargetProgress: 75.55,
    customerGrowth: 11.01,
    ordersGrowth: 9.05,
    monthlySales: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Notification Toast & Alerts
  const [orderAlerts, setOrderAlerts] = useState([
    { id: 'alt_1', title: '🔔 Đơn hàng mới #NAT-998811', desc: 'Khách hàng Trần Tuấn Anh vừa thanh toán 45.900.000đ qua VietQR.', time: 'Vừa xong', isNew: true }
  ]);
  const [toastAlert, setToastAlert] = useState(null);
  const prevOrderCountRef = useRef(0);

  // Invoice & Editing States
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const editFormRef = useRef(null);

  // Product Search & Filter States
  const [prodSearchQuery, setProdSearchQuery] = useState('');
  const [prodCategoryFilter, setProdCategoryFilter] = useState('all');
  const [prodSortFilter, setProdSortFilter] = useState('default');

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'gaming',
    price: '',
    originalPrice: '',
    badge: 'HOT SELLER',
    image: '',
    description: '',
    cpu: 'Intel Core i7-14700K',
    gpu: 'NVIDIA RTX 4070 SUPER 12GB',
    ram: '32GB DDR5 6000MHz RGB',
    ssd: '1TB NVMe Gen4 High Speed',
    mainboard: 'MSI MAG B760M MORTAR WIFI',
    psu: '750W 80 Plus Gold ATX 3.0',
    cooler: 'AIO 240mm ARGB Liquid Cooler',
    casepc: 'Case Bể Cá Kính Cường Lực RGB'
  });

  // New Category State
  const [newCat, setNewCat] = useState({ name: '', slug: '', description: '' });

  // New Banner State
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', imageUrl: '', linkUrl: '/category', badge: 'HOT DEAL' });

  // New Coupon State
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountType: 'fixed',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: 100,
    expiresAt: '2026-12-31'
  });

  const fmt = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

  // Synthesize Web Audio Chime Sound for Realtime Order Alert
  const playNotificationChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio not permitted or supported
    }
  };

  // Trigger floating notification
  const triggerOrderNotification = (order) => {
    playNotificationChime();
    const alertItem = {
      id: 'alt_' + Date.now(),
      title: `🔔 Đơn Đặt Hàng Mới #${order.id}!`,
      desc: `${order.customerName} - ${fmt(order.totalAmount)} (${order.paymentMethod || 'VietQR'})`,
      time: 'Vừa xong',
      isNew: true
    };
    setOrderAlerts(prev => [alertItem, ...prev]);
    setToastAlert(alertItem);
    setTimeout(() => setToastAlert(null), 5000);
  };

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, prodsRes, statsRes, catsRes, bansRes, usersRes, notisRes, paysRes, coupsRes] = await Promise.all([
        api.getAdminOrders(),
        api.getProducts(),
        api.getAdminStats(),
        api.getAdminCategories(),
        api.getAdminBanners(),
        api.getAdminUsers(),
        api.getAdminNotifications(),
        api.getAdminPayments(),
        api.getAdminCoupons()
      ]);

      if (ordersRes && ordersRes.orders) {
        // Detect new order arrival
        if (prevOrderCountRef.current > 0 && ordersRes.orders.length > prevOrderCountRef.current) {
          const newest = ordersRes.orders[0];
          triggerOrderNotification(newest);
        }
        prevOrderCountRef.current = ordersRes.orders.length;
        setOrders(ordersRes.orders);
      }
      if (prodsRes && prodsRes.products) setProducts(prodsRes.products);
      if (statsRes) setStats(statsRes);
      if (catsRes && catsRes.categories) setCategories(catsRes.categories);
      if (bansRes && bansRes.banners) setBanners(bansRes.banners);
      if (coupsRes && coupsRes.coupons) setCoupons(coupsRes.coupons);
      if (usersRes && usersRes.users) setUsersList(usersRes.users);
      if (notisRes && notisRes.notifications && notisRes.notifications.length > 0) {
        setOrderAlerts(notisRes.notifications);
      }
      if (paysRes && paysRes.payments) setPaymentsList(paysRes.payments);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Join realtime admin room
    joinAdminRoom();

    // 2. Listen for realtime new orders
    const unsubNewOrder = onNewOrder((newOrder) => {
      if (!newOrder) return;
      setOrders(prev => {
        const exists = prev.some(o => o.id === newOrder.id);
        if (exists) return prev;
        return [newOrder, ...prev];
      });

      // Increment stats
      setStats(prev => ({
        ...prev,
        totalOrders: (prev.totalOrders || 0) + 1,
        totalRevenue: (prev.totalRevenue || 0) + (Number(newOrder.totalAmount) || 0),
        todayRevenue: (prev.todayRevenue || 0) + (Number(newOrder.totalAmount) || 0)
      }));

      // Trigger audio & visual alert
      triggerOrderNotification(newOrder);
    });

    // 3. Listen for realtime order payment updates
    const unsubPaymentUpdate = onOrderPaymentUpdated(({ orderId, paymentStatus }) => {
      if (!orderId) return;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: paymentStatus || 'PAID' } : o));
    });

    // Background fallback sync every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => {
      clearInterval(interval);
      unsubNewOrder();
      unsubPaymentUpdate();
      leaveAdminRoom();
    };
  }, []);

  // Mark all notifications read
  const handleMarkAllNotisRead = async () => {
    await api.markAllNotificationsRead();
    setOrderAlerts(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Simulate Order for live demonstration
  const handleSimulateNewOrder = async () => {
    const fakeId = 'NAT-' + Math.floor(100000 + Math.random() * 900000);
    const mockOrder = {
      orderId: fakeId,
      customerName: 'Hoàng Minh Quân',
      customerEmail: 'quan.hoang@gmail.com',
      customerPhone: '0977889988',
      shippingAddress: 'Tòa nhà Landmark 72, Nam Từ Liêm, Hà Nội',
      paymentMethod: 'Chuyển Khoản QR',
      totalAmount: 38900000,
      items: [{ id: 'pc-gaming-1', name: 'NAT GAMING BEAST 4070 Ti', quantity: 1, price: 38900000 }]
    };

    try {
      await api.createOrder(mockOrder);
      await loadData();
      triggerOrderNotification({ id: fakeId, ...mockOrder });
    } catch (e) {
      setOrders(prev => [{ id: fakeId, ...mockOrder, orderStatus: 'PROCESSING' }, ...prev]);
      triggerOrderNotification({ id: fakeId, ...mockOrder });
    }
  };

  // Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const payload = {
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price),
      originalPrice: parseFloat(newProd.originalPrice || newProd.price),
      badge: newProd.badge,
      image: newProd.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
      description: newProd.description || 'Dàn máy PC chính hãng cao cấp bảo hành 36 tháng.',
      specs: {
        cpu: newProd.cpu,
        gpu: newProd.gpu,
        ram: newProd.ram,
        ssd: newProd.ssd,
        mainboard: newProd.mainboard,
        psu: newProd.psu,
        cooler: newProd.cooler,
        case: newProd.casepc
      }
    };

    if (editingProduct) {
      await api.updateAdminProduct(editingProduct.id, payload);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload, id: editingProduct.id } : p));
      setEditingProduct(null);
    } else {
      const res = await api.addAdminProduct(payload);
      if (res && res.product) setProducts(prev => [res.product, ...prev]);
    }

    setNewProd({
      name: '', category: 'gaming', price: '', originalPrice: '', badge: 'HOT SELLER', image: '', description: '',
      cpu: 'Intel Core i7-14700K', gpu: 'NVIDIA RTX 4070 SUPER 12GB', ram: '32GB DDR5 6000MHz RGB', ssd: '1TB NVMe Gen4 High Speed',
      mainboard: 'MSI MAG B760M MORTAR WIFI', psu: '750W 80 Plus Gold ATX 3.0', cooler: 'AIO 240mm ARGB Liquid Cooler', casepc: 'Case Bể Cá Kính Cường Lực RGB'
    });
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewProd({
      name: prod.name || '',
      category: prod.category || 'gaming',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      badge: prod.badge || 'HOT SELLER',
      image: prod.image || '',
      description: prod.description || '',
      cpu: prod.specs?.cpu || 'Core i7',
      gpu: prod.specs?.gpu || 'RTX 4070',
      ram: prod.specs?.ram || '32GB DDR5',
      ssd: prod.specs?.ssd || '1TB NVMe',
      mainboard: prod.specs?.mainboard || 'B760M',
      psu: prod.specs?.psu || '750W',
      cooler: prod.specs?.cooler || 'AIO 240mm',
      casepc: prod.specs?.case || 'Case Kính'
    });
    setActiveMenu('products');
    setTimeout(() => {
      if (editFormRef.current) {
        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Xóa sản phẩm này khỏi cơ sở dữ liệu?')) {
      await api.deleteAdminProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Category CRUD
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name) return;
    const res = await api.addAdminCategory(newCat);
    if (res && res.category) {
      setCategories(prev => [...prev, res.category]);
      setNewCat({ name: '', slug: '', description: '' });
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Xóa danh mục này?')) {
      await api.deleteAdminCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  // Banner CRUD
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.imageUrl) return;
    const res = await api.addAdminBanner(newBanner);
    if (res && res.banner) {
      setBanners(prev => [res.banner, ...prev]);
      setNewBanner({ title: '', subtitle: '', imageUrl: '', linkUrl: '/category', badge: 'HOT DEAL' });
    }
  };

  const handleDeleteBanner = async (id) => {
    if (window.confirm('Xóa banner này?')) {
      await api.deleteAdminBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  // User CRUD
  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    await api.updateUserRole(userId, nextRole);
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Xóa tài khoản người dùng này?')) {
      await api.deleteAdminUser(userId);
      setUsersList(prev => prev.filter(u => u.id !== userId));
    }
  };

  // Coupon CRUD
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discountValue) {
      alert('Vui lòng nhập đầy đủ mã voucher và giá trị giảm.');
      return;
    }
    const payload = {
      code: newCoupon.code.trim().toUpperCase(),
      description: newCoupon.description || `Mã giảm giá ${newCoupon.code.trim().toUpperCase()}`,
      discountType: newCoupon.discountType,
      discountValue: parseFloat(newCoupon.discountValue) || 0,
      minOrderAmount: parseFloat(newCoupon.minOrderAmount) || 0,
      maxDiscount: newCoupon.maxDiscount ? parseFloat(newCoupon.maxDiscount) : null,
      usageLimit: parseInt(newCoupon.usageLimit, 10) || 100,
      expiresAt: newCoupon.expiresAt ? `${newCoupon.expiresAt}T23:59:59.000Z` : '2026-12-31T23:59:59.000Z'
    };

    const res = await api.addAdminCoupon(payload);
    if (res && res.coupon) {
      setCoupons(prev => [res.coupon, ...prev]);
      setNewCoupon({
        code: '',
        description: '',
        discountType: 'fixed',
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: 100,
        expiresAt: '2026-12-31'
      });
      alert('Tạo mã voucher thành công!');
    } else {
      alert(res?.error || 'Lỗi khi tạo mã voucher.');
    }
  };

  const handleToggleCoupon = async (couponId) => {
    const res = await api.toggleAdminCoupon(couponId);
    if (res && res.coupon) {
      setCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c));
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) {
      await api.deleteAdminCoupon(couponId);
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    }
  };


  return (
    <div className={`tailadmin-root ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* Toast Alert Popup for New Order */}
      {toastAlert && (
        <div className="tailadmin-order-toast">
          <div className="toast-icon-pulse">
            <Bell size={20} />
          </div>
          <div className="toast-body">
            <strong>{toastAlert.title}</strong>
            <p>{toastAlert.desc}</p>
          </div>
          <button type="button" className="toast-close" onClick={() => setToastAlert(null)}>✕</button>
        </div>
      )}

      {/* =================================================================== */}
      {/* LEFT SIDEBAR (TailAdmin Style)                                      */}
      {/* =================================================================== */}
      <aside className={`tailadmin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Brand Logo */}
        <div className="sidebar-brand">
          <div className="brand-logo-badge">
            <LayoutDashboard size={20} color="#ffffff" />
          </div>
          <span className="brand-title">TailAdmin</span>
        </div>

        {/* Menu Navigation */}
        <div className="sidebar-menu-scroll">
          <div className="menu-group-label">MENU</div>
          <ul className="sidebar-nav-list">
            <li className={`nav-item ${activeMenu === 'ecommerce' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('ecommerce')}>
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
                <ChevronDown size={14} className="nav-arrow" />
              </button>
              {activeMenu === 'ecommerce' && (
                <ul className="sub-nav-list">
                  <li className="sub-nav-item active">
                    <span>eCommerce</span>
                  </li>
                  <li className="sub-nav-item pro-item">
                    <span>Analytics</span>
                    <span className="badge-pro">PRO</span>
                  </li>
                  <li className="sub-nav-item pro-item">
                    <span>Marketing</span>
                    <span className="badge-pro">PRO</span>
                  </li>
                  <li className="sub-nav-item pro-item">
                    <span>CRM</span>
                    <span className="badge-pro">PRO</span>
                  </li>
                </ul>
              )}
            </li>

            <li className={`nav-item ${activeMenu === 'orders' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('orders')}>
                <ShoppingBag size={18} />
                <span>Orders (Đơn Hàng)</span>
                <span className="badge-count-live">{orders.length}</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'products' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('products')}>
                <Cpu size={18} />
                <span>Products & Specs</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'categories' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('categories')}>
                <FolderTree size={18} />
                <span>Categories (Danh Mục)</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'banners' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('banners')}>
                <ImageIcon size={18} />
                <span>Banners Quảng Cáo</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'coupons' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('coupons')}>
                <Ticket size={18} />
                <span>Vouchers & Giảm Giá</span>
                <span className="badge-count-live" style={{ background: '#3b82f6' }}>{coupons.length}</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'payments' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('payments')}>
                <CreditCard size={18} />
                <span>Giao Dịch Thanh Toán</span>
                <span className="badge-count-live" style={{ background: '#10b981' }}>{paymentsList.length}</span>
              </button>
            </li>

            <li className={`nav-item ${activeMenu === 'users' ? 'active' : ''}`}>
              <button type="button" className="nav-btn" onClick={() => setActiveMenu('users')}>
                <Users size={18} />
                <span>User Accounts</span>
              </button>
            </li>
          </ul>

          <div className="menu-group-label" style={{ marginTop: '24px' }}>SUPPORT & STORE</div>
          <ul className="sidebar-nav-list">
            <li className="nav-item">
              <button type="button" className="nav-btn" onClick={() => navigate('/')}>
                <ExternalLink size={18} />
                <span>Về Storefront</span>
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="nav-btn text-danger"
                onClick={() => {
                  if (onLogout) onLogout();
                  navigate('/login');
                }}
              >
                <LogOut size={18} />
                <span>Đăng Xuất</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MAIN CONTAINER (Topbar + Content Area)                              */}
      {/* =================================================================== */}
      <div className="tailadmin-main-container">
        {/* Top Header Bar */}
        <header className="tailadmin-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              <Menu size={18} />
            </button>

            <div className="topbar-search">
              <Search size={16} className="search-icon" />
              <input type="text" placeholder="Search or type command..." />
              <kbd className="cmd-badge">⌘K</kbd>
            </div>
          </div>

          <div className="topbar-right">
            {/* Live Order Simulation Button */}
            <button
              type="button"
              className="btn-simulate-order"
              onClick={handleSimulateNewOrder}
              title="Nhấp để mô phỏng có khách đặt hàng mới và phát chuông thông báo"
            >
              <Sparkles size={14} /> Thử Nghiệm Chuông Đơn Hàng
            </button>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              className="topbar-icon-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="topbar-notification-wrapper">
              <button
                type="button"
                className="topbar-icon-btn noti-btn"
                onClick={() => setIsNotificationsOpen(prev => !prev)}
              >
                <Bell size={18} />
                {orderAlerts.length > 0 && <span className="noti-dot" />}
              </button>

              {isNotificationsOpen && (
                <div className="noti-dropdown-panel">
                  <div className="noti-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>Thông Báo Đơn Hàng Mới</strong>
                      <span className="noti-badge" style={{ marginLeft: 6 }}>{orderAlerts.filter(a => !a.isRead).length} mới</span>
                    </div>
                    {orderAlerts.some(a => !a.isRead) && (
                      <button
                        type="button"
                        className="btn-mark-all-read"
                        style={{ fontSize: 11, background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}
                        onClick={handleMarkAllNotisRead}
                      >
                        Đã đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="noti-list">
                    {orderAlerts.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                        Không có thông báo mới
                      </div>
                    ) : (
                      orderAlerts.map(alt => (
                        <div
                          key={alt.id}
                          className={`noti-item ${!alt.isRead ? 'unread' : ''}`}
                          style={{ cursor: 'pointer', background: !alt.isRead ? '#f8faff' : 'transparent' }}
                          onClick={async () => {
                            if (!alt.isRead) {
                              await api.markNotificationRead(alt.id);
                              setOrderAlerts(prev => prev.map(n => n.id === alt.id ? { ...n, isRead: true } : n));
                            }
                            if (alt.orderId) {
                              setActiveMenu('orders');
                              setIsNotificationsOpen(false);
                            }
                          }}
                        >
                          <div className="noti-icon"><ShoppingBag size={14} /></div>
                          <div className="noti-info">
                            <strong style={{ color: !alt.isRead ? '#1e293b' : '#64748b' }}>{alt.title}</strong>
                            <p>{alt.desc || alt.message}</p>
                            <span className="noti-time">{alt.time || 'Vừa xong'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Dropdown */}
            <div className="topbar-user-profile">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt="Admin"
                className="user-avatar-round"
              />
              <span className="user-profile-name">
                {user?.name || 'Musharof'}
              </span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        {/* Body Content Area */}
        <main className="tailadmin-content-body">
          {/* =============================================================== */}
          {/* VIEW 1: ECOMMERCE DASHBOARD (Exact Replica of Uploaded Image)   */}
          {/* =============================================================== */}
          {activeMenu === 'ecommerce' && (
            <div className="dashboard-grid-layout">
              {/* Row 1: Left Stats Cards & Monthly Target Gauge Card */}
              <div className="grid-top-row">
                <div className="stats-cards-left">
                  {/* Customers Stat Card */}
                  <div className="tail-stat-card">
                    <div className="stat-card-icon-box">
                      <Users size={20} />
                    </div>
                    <div className="stat-card-text">
                      <span className="stat-card-label">Customers</span>
                      <div className="stat-card-val-row">
                        <h3 className="stat-card-number">{(stats.totalUsers || usersList.length || 3782).toLocaleString('vi-VN')}</h3>
                        <span className="trend-badge trend-up">↑ {stats.customerGrowth || 11.01}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Orders Stat Card */}
                  <div className="tail-stat-card">
                    <div className="stat-card-icon-box">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="stat-card-text">
                      <span className="stat-card-label">Orders</span>
                      <div className="stat-card-val-row">
                        <h3 className="stat-card-number">{(stats.totalOrders || orders.length || 5359).toLocaleString('vi-VN')}</h3>
                        <span className="trend-badge trend-down">↓ {stats.ordersGrowth || 9.05}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Sales Bar Chart Card */}
                  <div className="tail-chart-card monthly-sales-card">
                    <div className="chart-header-row">
                      <h4>Monthly Sales</h4>
                      <button type="button" className="icon-more-btn"><MoreVertical size={16} /></button>
                    </div>
                    <div className="bar-chart-visual">
                      <div className="chart-bars-container">
                        {(stats.monthlySales && stats.monthlySales.length > 0 ? stats.monthlySales : [
                          { m: 'Jan', v: 40, revenue: 40000000 },
                          { m: 'Feb', v: 95, active: true, revenue: 95000000 },
                          { m: 'Mar', v: 50, revenue: 50000000 },
                          { m: 'Apr', v: 75, revenue: 75000000 },
                          { m: 'May', v: 45, revenue: 45000000 },
                          { m: 'Jun', v: 48, revenue: 48000000 },
                          { m: 'Jul', v: 72, revenue: 72000000 },
                          { m: 'Aug', v: 28, revenue: 28000000 },
                          { m: 'Sep', v: 52, revenue: 52000000 },
                          { m: 'Oct', v: 98, active: true, revenue: 98000000 },
                          { m: 'Nov', v: 70, revenue: 70000000 },
                          { m: 'Dec', v: 30, revenue: 30000000 }
                        ]).map((b, idx) => (
                          <div key={idx} className="bar-col">
                            <div className="bar-track">
                              <div
                                className={`bar-fill ${b.active ? 'highlight' : ''}`}
                                style={{ height: `${b.v}%` }}
                                title={`${b.m}: ${fmt(b.revenue || b.v * 1000000)} (${b.orders || 0} đơn)`}
                              />
                            </div>
                            <span className="bar-month-lbl">{b.m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Monthly Target Card (Radial Gauge) */}
                <div className="monthly-target-card">
                  <div className="target-card-header">
                    <div>
                      <h4>Monthly Target</h4>
                      <p className="target-subtext">Mục tiêu doanh thu đặt ra trong tháng</p>
                    </div>
                    <button type="button" className="icon-more-btn"><MoreVertical size={16} /></button>
                  </div>

                  {/* SVG Semi-Circle Radial Gauge */}
                  <div className="gauge-wrapper">
                    <svg viewBox="0 0 200 110" className="gauge-svg">
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="14"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="14"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * (Math.min(100, stats.monthlyTargetProgress || 75.55) / 100))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="gauge-center-text">
                      <h2 className="gauge-percent">{stats.monthlyTargetProgress || 75.55}%</h2>
                      <span className="gauge-badge">+{stats.customerGrowth || 10}%</span>
                    </div>
                  </div>

                  <p className="target-encouragement">
                    Doanh thu hôm nay đạt <strong>{fmt(stats.todayRevenue || 45900000)}</strong>, vượt mục tiêu đề ra. Làm việc rất tốt!
                  </p>

                  <div className="target-bottom-breakdown">
                    <div className="breakdown-col">
                      <span className="breakdown-lbl">Mục tiêu</span>
                      <strong className="breakdown-val">{fmt(stats.monthlyTarget || 500000000)} <span className="arrow-down">🎯</span></strong>
                    </div>
                    <div className="breakdown-col">
                      <span className="breakdown-lbl">Doanh thu</span>
                      <strong className="breakdown-val">{fmt(stats.totalRevenue || 145000000)} <span className="arrow-up">↑</span></strong>
                    </div>
                    <div className="breakdown-col">
                      <span className="breakdown-lbl">Hôm nay</span>
                      <strong className="breakdown-val">{fmt(stats.todayRevenue || 45900000)} <span className="arrow-up">↑</span></strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Statistics Line Wave Chart */}
              <div className="tail-chart-card statistics-wide-card">
                <div className="stats-chart-top-bar">
                  <div>
                    <h4>Statistics</h4>
                    <p className="target-subtext">Target you've set for each month</p>
                  </div>
                  <div className="stats-chart-controls">
                    <div className="pill-toggle-group">
                      <button type="button" className="pill-btn active">Overview</button>
                      <button type="button" className="pill-btn">Sales</button>
                      <button type="button" className="pill-btn">Revenue</button>
                    </div>
                    <div className="date-range-badge">
                      <Calendar size={14} /> Mar 6, 2025 - Mar 12, 2025
                    </div>
                  </div>
                </div>

                {/* SVG Area Wave Chart */}
                <div className="wave-chart-container">
                  <svg viewBox="0 0 800 200" className="wave-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 160 Q 150 140, 250 170 T 450 120 T 650 90 T 800 95 L 800 200 L 0 200 Z"
                      fill="url(#waveGradient)"
                    />
                    <path
                      d="M 0 160 Q 150 140, 250 170 T 450 120 T 650 90 T 800 95"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="y-axis-labels">
                    <span>250</span>
                    <span>200</span>
                    <span>150</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 2: ORDERS MANAGEMENT & REALTIME PIPELINE                   */}
          {/* =============================================================== */}
          {activeMenu === 'orders' && (
            <div className="tail-content-panel">
              <div className="panel-header-row">
                <div>
                  <h3>Quản Lý Đơn Hàng & Vận Chuyển Realtime</h3>
                  <p className="panel-sub">Tự động kết nối cơ sở dữ liệu PostgreSQL và nhận chuông báo khi có đơn mới</p>
                </div>
                <button type="button" className="btn-tail-primary" onClick={loadData} disabled={isLoading}>
                  <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} /> Đồng bộ đơn hàng
                </button>
              </div>

              <div className="tail-table-container">
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>MÃ ĐƠN</th>
                      <th>KHÁCH HÀNG</th>
                      <th>SỐ ĐIỆN THOẠI</th>
                      <th>ĐỊA CHỈ</th>
                      <th>PHƯƠNG THỨC</th>
                      <th>TỔNG TIỀN</th>
                      <th>TRẠNG THÁI</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td><strong className="text-primary-code">#{o.id}</strong></td>
                        <td>
                          <strong>{o.customerName}</strong>
                          <div className="sub-email">{o.customerEmail}</div>
                        </td>
                        <td>{o.customerPhone}</td>
                        <td className="cell-truncate">{o.shippingAddress}</td>
                        <td><span className="badge-payment-method">{o.paymentMethod}</span></td>
                        <td><strong className="text-bold-amount">{fmt(o.totalAmount)}</strong></td>
                        <td>
                          <select
                            className={`tail-status-select ${o.orderStatus ? o.orderStatus.toLowerCase() : 'processing'}`}
                            value={o.orderStatus || 'PROCESSING'}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          >
                            <option value="PROCESSING">Đang xử lý</option>
                            <option value="SHIPPING">Đang vận chuyển</option>
                            <option value="COMPLETED">Đã hoàn thành</option>
                            <option value="CANCELLED">Đã hủy</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-tail-action"
                            onClick={() => setSelectedInvoiceOrder(o)}
                          >
                            <FileText size={14} /> In Hóa Đơn
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 3: PRODUCTS & HARDWARE SPECS CRUD                           */}
          {/* =============================================================== */}
          {activeMenu === 'products' && (() => {
            const filteredProducts = products.filter(p => {
              const matchesCat = prodCategoryFilter === 'all' || p.category === prodCategoryFilter;
              if (!matchesCat) return false;
              if (!prodSearchQuery.trim()) return true;

              const q = prodSearchQuery.toLowerCase().trim();
              const nameMatch = p.name?.toLowerCase().includes(q);
              const catMatch = p.category?.toLowerCase().includes(q);
              const badgeMatch = p.badge?.toLowerCase().includes(q);
              const cpuMatch = p.specs?.cpu?.toLowerCase().includes(q);
              const gpuMatch = p.specs?.gpu?.toLowerCase().includes(q);
              const ramMatch = p.specs?.ram?.toLowerCase().includes(q);
              const ssdMatch = p.specs?.ssd?.toLowerCase().includes(q);
              const mbMatch = p.specs?.mainboard?.toLowerCase().includes(q);

              return nameMatch || catMatch || badgeMatch || cpuMatch || gpuMatch || ramMatch || ssdMatch || mbMatch;
            }).sort((a, b) => {
              if (prodSortFilter === 'price-asc') return (a.price || 0) - (b.price || 0);
              if (prodSortFilter === 'price-desc') return (b.price || 0) - (a.price || 0);
              if (prodSortFilter === 'name-az') return (a.name || '').localeCompare(b.name || '');
              return 0;
            });

            return (
              <div className="tail-content-panel">
                <div ref={editFormRef} className={`tail-form-card ${editingProduct ? 'editing-highlight-border' : ''}`}>
                  <div className="panel-header-row">
                    <h3>
                      {editingProduct ? <Edit size={18} color="#4f46e5" /> : <Plus size={18} color="#4f46e5" />}
                      {editingProduct ? `Chỉnh Sửa Sản Phẩm #${editingProduct.id}` : 'Thêm Sản Phẩm & Cấu Hình Linh Kiện PC Mới'}
                    </h3>
                    {editingProduct && (
                      <button
                        type="button"
                        className="btn-tail-secondary"
                        onClick={() => setEditingProduct(null)}
                      >
                        Hủy Chỉnh Sửa
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveProduct} className="tail-crud-form">
                    <div className="form-grid-3">
                      <div className="form-input-box">
                        <label>Tên Sản Phẩm / Dàn Máy *</label>
                        <input
                          type="text"
                          required
                          placeholder="VD: NAT GAMING ULTRA I9 / RTX 4080"
                          value={newProd.name}
                          onChange={(e) => setNewProd(p => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div className="form-input-box">
                        <label>Danh Mục</label>
                        <select
                          value={newProd.category}
                          onChange={(e) => setNewProd(p => ({ ...p, category: e.target.value }))}
                        >
                          {categories.length > 0 ? (
                            categories.map(c => (
                              <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                            ))
                          ) : (
                            <>
                              <option value="gaming">PC Gaming</option>
                              <option value="workstation">PC Workstation</option>
                              <option value="office">PC Văn Phòng</option>
                              <option value="components">Linh Kiện Rời</option>
                              <option value="monitors">Màn Hình</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="form-input-box">
                        <label>Giá Bán Khuyến Mãi (VND) *</label>
                        <input
                          type="number"
                          required
                          placeholder="35900000"
                          value={newProd.price}
                          onChange={(e) => setNewProd(p => ({ ...p, price: e.target.value }))}
                        />
                      </div>
                      <div className="form-input-box">
                        <label>Giá Niêm Yết Gốc (VND)</label>
                        <input
                          type="number"
                          placeholder="39900000"
                          value={newProd.originalPrice}
                          onChange={(e) => setNewProd(p => ({ ...p, originalPrice: e.target.value }))}
                        />
                      </div>
                      <div className="form-input-box">
                        <label>Tem Khuyến Mãi (Badge)</label>
                        <select
                          value={newProd.badge}
                          onChange={(e) => setNewProd(p => ({ ...p, badge: e.target.value }))}
                        >
                          <option value="HOT SELLER">HOT SELLER</option>
                          <option value="BEST CHOICE">BEST CHOICE</option>
                          <option value="AI ULTRA POWER">AI ULTRA POWER</option>
                          <option value="GIẢM 30%">GIẢM 30%</option>
                        </select>
                      </div>
                      <div className="form-input-box">
                        <label>Link Ảnh Sản Phẩm (Image URL)</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={newProd.image}
                          onChange={(e) => setNewProd(p => ({ ...p, image: e.target.value }))}
                        />
                      </div>
                    </div>

                    {newProd.image && (
                      <div className="image-preview-wrapper">
                        <label>Xem trước hình ảnh:</label>
                        <img src={newProd.image} alt="Preview" className="img-thumb-preview" />
                      </div>
                    )}

                    <div className="form-input-box" style={{ marginTop: '12px' }}>
                      <label>Mô Tả Sản Phẩm & Chính Sách Bảo Hành</label>
                      <textarea
                        rows="2"
                        placeholder="Mô tả chi tiết cấu hình máy tính, hiệu năng chơi game 4K, đồ họa 3D..."
                        value={newProd.description}
                        onChange={(e) => setNewProd(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>

                    {/* Components Breakdown Fieldset */}
                    <div className="specs-fieldset-box">
                      <label className="specs-title"><Cpu size={14} /> Chi Tiết Các Linh Kiện Máy Tính (Hardware Breakdown)</label>
                      <div className="form-grid-4">
                        <div className="form-input-box"><label>CPU</label><input type="text" value={newProd.cpu} onChange={e => setNewProd(p => ({ ...p, cpu: e.target.value }))} /></div>
                        <div className="form-input-box"><label>GPU (VGA)</label><input type="text" value={newProd.gpu} onChange={e => setNewProd(p => ({ ...p, gpu: e.target.value }))} /></div>
                        <div className="form-input-box"><label>RAM</label><input type="text" value={newProd.ram} onChange={e => setNewProd(p => ({ ...p, ram: e.target.value }))} /></div>
                        <div className="form-input-box"><label>SSD</label><input type="text" value={newProd.ssd} onChange={e => setNewProd(p => ({ ...p, ssd: e.target.value }))} /></div>
                        <div className="form-input-box"><label>Mainboard</label><input type="text" value={newProd.mainboard} onChange={e => setNewProd(p => ({ ...p, mainboard: e.target.value }))} /></div>
                        <div className="form-input-box"><label>Nguồn (PSU)</label><input type="text" value={newProd.psu} onChange={e => setNewProd(p => ({ ...p, psu: e.target.value }))} /></div>
                        <div className="form-input-box"><label>Tản Nhiệt</label><input type="text" value={newProd.cooler} onChange={e => setNewProd(p => ({ ...p, cooler: e.target.value }))} /></div>
                        <div className="form-input-box"><label>Vỏ Case</label><input type="text" value={newProd.casepc} onChange={e => setNewProd(p => ({ ...p, casepc: e.target.value }))} /></div>
                      </div>
                    </div>

                    <button type="submit" className="btn-tail-primary" style={{ marginTop: '16px' }}>
                      {editingProduct ? 'Cập Nhật Thay Đổi Vào CSDL' : 'Lưu Sản Phẩm Mới Vào CSDL'}
                    </button>
                  </form>
                </div>

                {/* Product Search & Filter Toolbar */}
                <div className="product-search-toolbar" style={{
                  marginTop: '24px',
                  marginBottom: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1, minWidth: '300px' }}>
                    {/* Search Input */}
                    <div style={{
                      position: 'relative',
                      flex: '1 1 280px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        placeholder="Tìm theo tên sản phẩm, CPU (i5, i7, Ryzen), VGA, RAM, SSD..."
                        value={prodSearchQuery}
                        onChange={(e) => setProdSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 36px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          background: '#f8fafc'
                        }}
                      />
                      {prodSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setProdSearchQuery('')}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          title="Xóa tìm kiếm"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Category Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <SlidersHorizontal size={14} color="#64748b" />
                      <select
                        value={prodCategoryFilter}
                        onChange={(e) => setProdCategoryFilter(e.target.value)}
                        style={{
                          padding: '10px 14px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontSize: '13px',
                          background: '#ffffff',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="all">Tất cả danh mục ({products.length})</option>
                        {categories.map(c => {
                          const count = products.filter(p => p.category === (c.slug || c.id)).length;
                          return (
                            <option key={c.id} value={c.slug || c.id}>
                              {c.name} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Sort Order */}
                    <select
                      value={prodSortFilter}
                      onChange={(e) => setProdSortFilter(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        background: '#ffffff',
                        cursor: 'pointer',
                        outline: 'none'
                      }}
                    >
                      <option value="default">Sắp xếp: Mặc định</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                      <option value="name-az">Tên: A - Z</option>
                    </select>
                  </div>

                  {/* Counter Badge & Reset */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#475569',
                      background: '#f1f5f9',
                      padding: '6px 12px',
                      borderRadius: '20px'
                    }}>
                      Hiển thị {filteredProducts.length} / {products.length} sản phẩm
                    </span>

                    {(prodSearchQuery || prodCategoryFilter !== 'all' || prodSortFilter !== 'default') && (
                      <button
                        type="button"
                        onClick={() => {
                          setProdSearchQuery('');
                          setProdCategoryFilter('all');
                          setProdSortFilter('default');
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textDecoration: 'underline'
                        }}
                      >
                        Đặt lại
                      </button>
                    )}
                  </div>
                </div>

                {/* Product List */}
                <div className="tail-table-container">
                  <table className="tail-data-table">
                    <thead>
                      <tr>
                        <th>HÌNH ẢNH</th>
                        <th>TÊN SẢN PHẨM</th>
                        <th>DANH MỤC</th>
                        <th>GIÁ BÁN</th>
                        <th>LINH KIỆN CẤU HÌNH</th>
                        <th>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                            <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>
                              🔍 Không tìm thấy sản phẩm nào khớp với bộ lọc
                            </div>
                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                              Vui lòng thử tìm với từ khóa khác hoặc bấm nút "Đặt lại" để xem toàn bộ danh mục.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(p => (
                          <tr key={p.id} className={editingProduct?.id === p.id ? 'row-currently-editing' : ''}>
                            <td><img src={p.image} alt={p.name} className="tail-prod-img" /></td>
                            <td><strong>{p.name}</strong></td>
                            <td><span className="badge-category-tag">{p.category}</span></td>
                            <td><strong className="text-bold-amount">{fmt(p.price)}</strong></td>
                            <td className="cell-specs-small">
                              <div>CPU: {p.specs?.cpu || 'Core i7'} | VGA: {p.specs?.gpu || 'RTX 4070'}</div>
                              <div>RAM: {p.specs?.ram || '32GB'} | SSD: {p.specs?.ssd || '1TB'}</div>
                            </td>
                            <td>
                              <div className="tail-action-btns">
                                <button type="button" className="btn-tail-edit" onClick={() => handleEditProduct(p)}><Edit size={14} /> Sửa</button>
                                <button type="button" className="btn-tail-delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /> Xóa</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* =============================================================== */}
          {/* VIEW 4: CATEGORIES CRUD                                         */}
          {/* =============================================================== */}
          {activeMenu === 'categories' && (
            <div className="tail-content-panel">
              <div className="tail-form-card">
                <h3><FolderTree size={18} /> Thêm Danh Mục Máy Tính & Linh Kiện Mới</h3>
                <form onSubmit={handleAddCategory} className="tail-crud-form">
                  <div className="form-grid-3">
                    <div className="form-input-box">
                      <label>Tên Danh Mục *</label>
                      <input type="text" required placeholder="VD: PC Giả Lập NoxPlayer" value={newCat.name} onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div className="form-input-box">
                      <label>Slug Đường Dẫn</label>
                      <input type="text" placeholder="pc-gia-lap-nox" value={newCat.slug} onChange={e => setNewCat(c => ({ ...c, slug: e.target.value }))} />
                    </div>
                    <div className="form-input-box">
                      <label>Mô Tả</label>
                      <input type="text" placeholder="Cấu hình nhiều nhân nhiều luồng..." value={newCat.description} onChange={e => setNewCat(c => ({ ...c, description: e.target.value }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn-tail-primary" style={{ marginTop: '12px' }}>
                    Thêm Danh Mục Vào CSDL
                  </button>
                </form>
              </div>

              <div className="tail-table-container" style={{ marginTop: '20px' }}>
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>MÃ ID</th>
                      <th>TÊN DANH MỤC</th>
                      <th>SLUG URL</th>
                      <th>MÔ TẢ</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c.id}>
                        <td><code>{c.id}</code></td>
                        <td><strong>{c.name}</strong></td>
                        <td><code>/{c.slug}</code></td>
                        <td>{c.description || 'Chưa có mô tả'}</td>
                        <td>
                          <button type="button" className="btn-tail-delete" onClick={() => handleDeleteCategory(c.id)}>
                            <Trash2 size={14} /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 5: BANNERS CRUD                                            */}
          {/* =============================================================== */}
          {activeMenu === 'banners' && (
            <div className="tail-content-panel">
              <div className="tail-form-card">
                <h3><ImageIcon size={18} /> Thêm & Quản Lý Banner Quảng Cáo</h3>
                <form onSubmit={handleAddBanner} className="tail-crud-form">
                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>Tiêu Đề Banner *</label>
                      <input type="text" required placeholder="VD: DEAL GAMING BLACK MYTH WUKONG" value={newBanner.title} onChange={e => setNewBanner(b => ({ ...b, title: e.target.value }))} />
                    </div>
                    <div className="form-input-box">
                      <label>Tiêu Đề Phụ (Subtitle)</label>
                      <input type="text" placeholder="Tặng kèm màn hình Gaming 240Hz" value={newBanner.subtitle} onChange={e => setNewBanner(b => ({ ...b, subtitle: e.target.value }))} />
                    </div>
                    <div className="form-input-box">
                      <label>Link Ảnh (Image URL) *</label>
                      <input type="text" required placeholder="https://images.unsplash.com/..." value={newBanner.imageUrl} onChange={e => setNewBanner(b => ({ ...b, imageUrl: e.target.value }))} />
                    </div>
                    <div className="form-input-box">
                      <label>Link Đích</label>
                      <input type="text" placeholder="/hotsale" value={newBanner.linkUrl} onChange={e => setNewBanner(b => ({ ...b, linkUrl: e.target.value }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn-tail-primary" style={{ marginTop: '12px' }}>
                    Lưu Banner Vào CSDL
                  </button>
                </form>
              </div>

              <div className="tail-table-container" style={{ marginTop: '20px' }}>
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>XEM TRƯỚC</th>
                      <th>TIÊU ĐỀ</th>
                      <th>TIÊU ĐỀ PHỤ</th>
                      <th>LINK</th>
                      <th>TRẠNG THÁI</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map(b => (
                      <tr key={b.id}>
                        <td><img src={b.imageUrl} alt={b.title} className="tail-banner-thumb" /></td>
                        <td><strong>{b.title}</strong></td>
                        <td>{b.subtitle}</td>
                        <td><code>{b.linkUrl}</code></td>
                        <td><span className="badge-active-tag">Active</span></td>
                        <td>
                          <button type="button" className="btn-tail-delete" onClick={() => handleDeleteBanner(b.id)}>
                            <Trash2 size={14} /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 5.4: COUPONS & VOUCHERS MANAGEMENT                         */}
          {/* =============================================================== */}
          {activeMenu === 'coupons' && (
            <div className="tail-content-panel">
              <div className="tail-form-card">
                <h3><Ticket size={18} color="#3b82f6" /> Tạo & Quản Lý Mã Giảm Giá (Vouchers)</h3>
                <p className="panel-sub" style={{ marginBottom: '14px' }}>Cấu hình mã khuyến mãi giảm theo % hoặc số tiền cố định cho khách hàng</p>
                <form onSubmit={handleAddCoupon} className="tail-crud-form">
                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>Mã Voucher (Code) *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: NAT500K, GAMING10"
                        value={newCoupon.code}
                        onChange={e => setNewCoupon(c => ({ ...c, code: e.target.value.toUpperCase() }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Mô Tả Khuyến Mãi</label>
                      <input
                        type="text"
                        placeholder="Giảm 500.000đ cho đơn từ 15tr..."
                        value={newCoupon.description}
                        onChange={e => setNewCoupon(c => ({ ...c, description: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Loại Giảm Giá</label>
                      <select
                        value={newCoupon.discountType}
                        onChange={e => setNewCoupon(c => ({ ...c, discountType: e.target.value }))}
                      >
                        <option value="fixed">Số tiền cố định (VNĐ)</option>
                        <option value="percent">Phần trăm (%)</option>
                      </select>
                    </div>
                    <div className="form-input-box">
                      <label>Mức Giảm ({newCoupon.discountType === 'percent' ? '%' : 'VNĐ'}) *</label>
                      <input
                        type="number"
                        required
                        placeholder={newCoupon.discountType === 'percent' ? 'VD: 10' : 'VD: 500000'}
                        value={newCoupon.discountValue}
                        onChange={e => setNewCoupon(c => ({ ...c, discountValue: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Đơn Hàng Tối Thiểu (VNĐ)</label>
                      <input
                        type="number"
                        placeholder="VD: 15000000"
                        value={newCoupon.minOrderAmount}
                        onChange={e => setNewCoupon(c => ({ ...c, minOrderAmount: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Giảm Tối Đa (VNĐ - dành cho %)</label>
                      <input
                        type="number"
                        placeholder="VD: 1500000"
                        value={newCoupon.maxDiscount}
                        onChange={e => setNewCoupon(c => ({ ...c, maxDiscount: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Số Lượt Dùng Giới Hạn</label>
                      <input
                        type="number"
                        placeholder="VD: 100"
                        value={newCoupon.usageLimit}
                        onChange={e => setNewCoupon(c => ({ ...c, usageLimit: e.target.value }))}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Ngày Hết Hạn (YYYY-MM-DD)</label>
                      <input
                        type="date"
                        value={newCoupon.expiresAt}
                        onChange={e => setNewCoupon(c => ({ ...c, expiresAt: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-tail-primary" style={{ marginTop: '14px' }}>
                    <Plus size={15} /> Thêm Mã Giảm Giá Vào Hệ Thống
                  </button>
                </form>
              </div>

              <div className="tail-table-container" style={{ marginTop: '20px' }}>
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>MÃ CODE</th>
                      <th>MÔ TẢ</th>
                      <th>LOẠI & MỨC GIẢM</th>
                      <th>ĐƠN TỐI THIỂU</th>
                      <th>ĐÃ DÙNG / GIỚI HẠN</th>
                      <th>HẾT HẠN</th>
                      <th>TRẠNG THÁI</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                          Chưa có mã giảm giá nào. Hãy tạo mã đầu tiên ở trên!
                        </td>
                      </tr>
                    ) : (
                      coupons.map(c => (
                        <tr key={c.id || c.code}>
                          <td><strong style={{ color: '#3b82f6', letterSpacing: '0.05em' }}>{c.code}</strong></td>
                          <td style={{ maxWidth: '240px' }}>{c.description || '—'}</td>
                          <td>
                            <strong style={{ color: '#10b981' }}>
                              {c.discountType === 'percent' ? `${c.discountValue}%` : fmt(c.discountValue)}
                            </strong>
                            {c.maxDiscount && (
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tối đa: {fmt(c.maxDiscount)}</div>
                            )}
                          </td>
                          <td>{fmt(c.minOrderAmount || 0)}</td>
                          <td>
                            <span>{c.usedCount || 0}</span> / <span>{c.usageLimit || '∞'}</span>
                          </td>
                          <td style={{ fontSize: '12px' }}>
                            {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('vi-VN') : 'Vĩnh viễn'}
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => handleToggleCoupon(c.id)}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                background: c.isActive !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: c.isActive !== false ? '#10b981' : '#ef4444'
                              }}
                            >
                              {c.isActive !== false ? '● ĐANG BẬT' : '○ TẠM KHÓA'}
                            </button>
                          </td>
                          <td>
                            <button type="button" className="btn-tail-delete" onClick={() => handleDeleteCoupon(c.id)}>
                              <Trash2 size={14} /> Xóa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 5.5: PAYMENTS & GATEWAY TRANSACTIONS                       */}
          {/* =============================================================== */}
          {activeMenu === 'payments' && (
            <div className="tail-content-panel">
              <div className="panel-header-row">
                <div>
                  <h3><CreditCard size={18} color="#10b981" /> Quản Lý Giao Dịch Thanh Toán</h3>
                  <p className="panel-sub">Theo dõi các giao dịch qua cổng MoMo, VietQR, COD và Thẻ quốc tế</p>
                </div>
                <button type="button" className="btn-tail-primary" onClick={loadData} disabled={isLoading}>
                  <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} /> Đồng bộ giao dịch
                </button>
              </div>

              <div className="tail-table-container">
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>MÃ GIAO DỊCH</th>
                      <th>MÃ ĐƠN HÀNG</th>
                      <th>CỔNG THANH TOÁN</th>
                      <th>SỐ TIỀN</th>
                      <th>TRẠNG THÁI</th>
                      <th>THỜI GIAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentsList.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          Chưa có giao dịch thanh toán nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      paymentsList.map((p, idx) => (
                        <tr key={p.id || idx}>
                          <td><strong className="text-primary-code">{p.transactionCode || p.id}</strong></td>
                          <td><code>#{p.orderId}</code></td>
                          <td><span className="badge-payment-method">{p.gateway}</span></td>
                          <td><strong className="text-bold-amount" style={{ color: '#10b981' }}>{fmt(p.amount)}</strong></td>
                          <td>
                            <span className="badge-active-tag" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
                              {p.status || 'SUCCESS'}
                            </span>
                          </td>
                          <td style={{ fontSize: '12px', color: '#64748b' }}>
                            {p.createdAt ? new Date(p.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 6: USERS & ROLES                                           */}
          {/* =============================================================== */}
          {activeMenu === 'users' && (
            <div className="tail-content-panel">
              <div className="tail-table-container">
                <table className="tail-data-table">
                  <thead>
                    <tr>
                      <th>MÃ ID</th>
                      <th>HỌ VÀ TÊN</th>
                      <th>EMAIL</th>
                      <th>SỐ ĐIỆN THOẠI</th>
                      <th>VAI TRÒ (ROLE)</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id}>
                        <td><code>{u.id}</code></td>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td>{u.phone || '0886976868'}</td>
                        <td>
                          <span className={`tail-role-badge ${u.role === 'admin' ? 'role-admin' : 'role-customer'}`}>
                            {u.role === 'admin' ? '⚡ ADMIN MASTER' : '👤 CUSTOMER'}
                          </span>
                        </td>
                        <td>
                          <div className="tail-action-btns">
                            <button type="button" className="btn-tail-edit" onClick={() => handleToggleUserRole(u.id, u.role)}>
                              Đổi Role
                            </button>
                            {u.id !== 'usr_admin_master' && (
                              <button type="button" className="btn-tail-delete" onClick={() => handleDeleteUser(u.id)}>
                                <Trash2 size={14} /> Xóa
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={true}
          onClose={() => setSelectedInvoiceOrder(null)}
          orderInfo={{
            id: selectedInvoiceOrder.id,
            totalAmount: selectedInvoiceOrder.totalAmount,
            paymentMethod: selectedInvoiceOrder.paymentMethod,
            customerName: selectedInvoiceOrder.customerName,
            customerEmail: selectedInvoiceOrder.customerEmail,
            customerPhone: selectedInvoiceOrder.customerPhone,
            shippingAddress: selectedInvoiceOrder.shippingAddress,
            items: selectedInvoiceOrder.items || []
          }}
        />
      )}
    </div>
  );
}
