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
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import DashboardHome from '../components/admin/DashboardHome';
import InventoryView from '../components/admin/InventoryView';
import PcBuildsView from '../components/admin/PcBuildsView';
import WarrantyReturnsView from '../components/admin/WarrantyReturnsView';
import ReportsView from '../components/admin/ReportsView';
import AdminManagementView from '../components/admin/AdminManagementView';
import ProductsView from '../components/admin/ProductsView';
import ProductEditor from '../components/admin/ProductEditor';
import OrdersView from '../components/admin/OrdersView';

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

  // Standard Specs Templates for Quick Fill
  const SPEC_TEMPLATES = {
    pc: [
      { item: 'Bộ vi xử lý (CPU)', desc: 'Intel Core i7-14700K', qty: 1, warranty: '36 Tháng' },
      { item: 'Bo mạch chủ (Mainboard)', desc: 'MSI MAG B760M MORTAR WIFI', qty: 1, warranty: '36 Tháng' },
      { item: 'Bộ nhớ RAM', desc: '32GB DDR5 6000MHz RGB', qty: 1, warranty: '36 Tháng' },
      { item: 'Ổ cứng SSD', desc: '1TB NVMe Gen4 High Speed', qty: 1, warranty: '36 Tháng' },
      { item: 'Card đồ họa (VGA)', desc: 'NVIDIA RTX 4070 SUPER 12GB', qty: 1, warranty: '36 Tháng' },
      { item: 'Nguồn máy tính (PSU)', desc: '750W 80 Plus Gold ATX 3.0', qty: 1, warranty: '36 Tháng' },
      { item: 'Tản nhiệt', desc: 'AIO 240mm ARGB Liquid Cooler', qty: 1, warranty: '24 Tháng' },
      { item: 'Vỏ Case', desc: 'Case Bể Cá Kính Cường Lực RGB', qty: 1, warranty: '12 Tháng' }
    ],
    gpu: [
      { item: 'Chip đồ họa (GPU)', desc: 'GeForce RTX 5070 Ti 16GB', qty: 1, warranty: '36 Tháng' },
      { item: 'Dung lượng VRAM', desc: '16GB GDDR7 256-bit', qty: 1, warranty: '36 Tháng' },
      { item: 'Cổng xuất hình', desc: '3x DisplayPort 2.1b, 1x HDMI 2.1b', qty: 1, warranty: '36 Tháng' },
      { item: 'Nguồn đề nghị', desc: 'Từ 750W trở lên (1x 16-pin 12V-2x6)', qty: 1, warranty: '36 Tháng' },
      { item: 'Kích thước / Tản nhiệt', desc: '3 Quạt ARGB - Dài 305mm', qty: 1, warranty: '36 Tháng' }
    ],
    monitor: [
      { item: 'Kích thước màn hình', desc: '27 inch QHD (2560 x 1440)', qty: 1, warranty: '36 Tháng' },
      { item: 'Tần số quét', desc: '180Hz Super Fast', qty: 1, warranty: '36 Tháng' },
      { item: 'Tấm nền', desc: 'Fast IPS Góc nhìn 178°', qty: 1, warranty: '36 Tháng' },
      { item: 'Thời gian đáp ứng', desc: '1ms GTG / 0.5ms MPRT', qty: 1, warranty: '36 Tháng' },
      { item: 'Cổng kết nối', desc: '2x HDMI 2.0, 1x DisplayPort 1.4', qty: 1, warranty: '36 Tháng' }
    ],
    gear: [
      { item: 'Phân loại thiết bị', desc: 'Chuột Gaming Không Dây Siêu Nhẹ', qty: 1, warranty: '24 Tháng' },
      { item: 'Cảm biến (Sensor) / Switch', desc: 'HERO 25K (100 - 25.600 DPI)', qty: 1, warranty: '24 Tháng' },
      { item: 'Kết nối', desc: 'Lightspeed Wireless 1ms & Bluetooth', qty: 1, warranty: '24 Tháng' },
      { item: 'Trọng lượng', desc: '63g', qty: 1, warranty: '24 Tháng' },
      { item: 'Thời lượng pin', desc: '70 giờ sử dụng liên tục', qty: 1, warranty: '24 Tháng' }
    ],
    custom: [
      { item: '', desc: '', qty: 1, warranty: '36 Tháng' }
    ]
  };

  const parseSpecsToRows = (specs, defaultWarranty = '36 Tháng') => {
    if (Array.isArray(specs) && specs.length > 0) {
      return specs.map(s => ({
        item: s.item || s.label || s.name || '',
        desc: s.desc || s.value || s.detail || '',
        qty: s.qty ?? 1,
        warranty: s.warranty || defaultWarranty
      }));
    }
    if (specs && typeof specs === 'object' && Object.keys(specs).length > 0) {
      const keyMap = {
        cpu: 'Bộ vi xử lý (CPU)',
        gpu: 'Card đồ họa (VGA)',
        vga: 'Card đồ họa (VGA)',
        ram: 'Bộ nhớ RAM',
        ssd: 'Ổ cứng SSD',
        mainboard: 'Bo mạch chủ (Mainboard)',
        psu: 'Nguồn máy tính (PSU)',
        cooler: 'Tản nhiệt',
        case: 'Vỏ Case',
        casepc: 'Vỏ Case'
      };
      return Object.entries(specs).map(([k, v]) => ({
        item: keyMap[k.toLowerCase()] || k,
        desc: typeof v === 'object' ? JSON.stringify(v) : String(v),
        qty: 1,
        warranty: defaultWarranty
      }));
    }
    return SPEC_TEMPLATES.pc;
  };

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'gaming',
    price: '',
    originalPrice: '',
    badge: 'HOT SELLER',
    image: '',
    description: '',
    specsRows: SPEC_TEMPLATES.pc
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
      if (typeof unsubNewOrder === 'function') unsubNewOrder();
      if (typeof unsubPaymentUpdate === 'function') unsubPaymentUpdate();
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

  // Confirm Payment manually
  const handleConfirmPayment = async (orderId, totalAmount, customerName) => {
    if (window.confirm(`Xác nhận đã nhận đủ ${fmt(totalAmount)} từ khách hàng ${customerName || ''} qua MBBank?`)) {
      try {
        const res = await api.confirmAdminOrderPayment(orderId);
        if (res && res.success) {
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'PAID', orderStatus: 'PROCESSING' } : o));
          const alertItem = {
            id: 'alt_' + Date.now(),
            title: `✅ Đã duyệt tiền đơn hàng #${orderId}!`,
            desc: `Đã xác nhận thanh toán thành công cho khách hàng ${customerName || ''}.`,
            time: 'Vừa xong',
            isNew: true
          };
          setOrderAlerts(prev => [alertItem, ...prev]);
          setToastAlert(alertItem);
          setTimeout(() => setToastAlert(null), 4000);
        } else {
          alert(res?.error || 'Có lỗi xảy ra khi duyệt thanh toán.');
        }
      } catch (err) {
        alert('Lỗi kết nối khi duyệt thanh toán.');
      }
    }
  };

  // Product CRUD
  const handleSaveProduct = async (dataOrEvent, isPublished = true) => {
    let payload;
    if (dataOrEvent && dataOrEvent.preventDefault) {
      dataOrEvent.preventDefault();
      if (!newProd.name || !newProd.price) return;

      // Filter valid specs rows (ignore empty rows)
      const validSpecs = (newProd.specsRows || []).filter(
        r => (r.item && r.item.trim()) || (r.desc && r.desc.trim())
      );

      payload = {
        name: newProd.name,
        category: newProd.category,
        price: parseFloat(newProd.price),
        originalPrice: parseFloat(newProd.originalPrice || newProd.price),
        badge: newProd.badge,
        image: newProd.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        description: newProd.description || 'Sản phẩm máy tính / linh kiện chính hãng bảo hành đầy đủ.',
        specs: validSpecs
      };
    } else if (dataOrEvent && dataOrEvent.name) {
      payload = dataOrEvent;
    } else {
      return;
    }

    if (editingProduct) {
      await api.updateAdminProduct(editingProduct.id, payload);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload, id: editingProduct.id } : p));
      setEditingProduct(null);
    } else {
      const res = await api.addAdminProduct(payload);
      if (res && res.product) {
        setProducts(prev => [res.product, ...prev]);
      } else {
        setProducts(prev => [{ id: 'prod_' + Date.now(), ...payload }, ...prev]);
      }
    }

    setEditingProduct(null);
    setActiveMenu('products');
    setNewProd({
      name: '', category: 'gaming', price: '', originalPrice: '', badge: 'HOT SELLER', image: '', description: '',
      specsRows: SPEC_TEMPLATES.pc
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
      specsRows: parseSpecsToRows(prod.specs, prod.warranty || '36 Tháng')
    });
    setActiveMenu('add-product');
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
      {/* LEFT SIDEBAR (Modern Modular SaaS Admin Navigation)                 */}
      {/* =================================================================== */}
      <AdminSidebar
        activeMenu={activeMenu}
        onSelectMenu={(menu) => setActiveMenu(menu)}
        sidebarOpen={sidebarOpen}
        counts={{
          orders: orders.length,
          products: products.length,
          categories: categories.length,
          coupons: coupons.length,
          lowStock: stats.lowStockCount || 5,
          unreadNotis: orderAlerts.filter(a => !a.isRead).length
        }}
        onNavigateHome={() => navigate('/')}
        onLogout={() => {
          if (onLogout) onLogout();
          navigate('/login');
        }}
      />

      {/* =================================================================== */}
      {/* MAIN CONTAINER (Topbar + Content Area)                              */}
      {/* =================================================================== */}
      <div className="tailadmin-main-container">
        {/* Top Header Bar */}
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchQuery={prodSearchQuery}
          onSearchChange={(q) => setProdSearchQuery(q)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
          isNotificationsOpen={isNotificationsOpen}
          onToggleNotifications={() => setIsNotificationsOpen(prev => !prev)}
          orderAlerts={orderAlerts}
          onNotificationClick={async (alt) => {
            if (!alt.isRead) {
              await api.markNotificationRead(alt.id);
              setOrderAlerts(prev => prev.map(n => n.id === alt.id ? { ...n, isRead: true } : n));
            }
            if (alt.orderId) {
              setActiveMenu('orders');
              setIsNotificationsOpen(false);
            }
          }}
          onMarkAllNotisRead={handleMarkAllNotisRead}
          onSimulateOrder={handleSimulateNewOrder}
          onQuickAction={() => setActiveMenu('add-product')}
          user={user}
        />

        {/* Body Content Area */}
        <main className="tailadmin-content-body">
          {/* =============================================================== */}
          {/* VIEW 1: PRODUCTION-READY SAAS DASHBOARD HOMEPAGE               */}
          {/* =============================================================== */}
          {(activeMenu === 'dashboard' || activeMenu === 'ecommerce') && (
            <DashboardHome
              stats={stats}
              orders={orders}
              products={products}
              usersList={usersList}
              onApprovePayment={handleConfirmPayment}
              onViewInvoice={(ord) => setSelectedInvoiceOrder(ord)}
              onNavigateTab={(tab) => setActiveMenu(tab)}
              onRefreshData={loadData}
              currencyFormatter={fmt}
            />
          )}

          {/* VIEW: PC BUILDS */}
          {activeMenu === 'pc-builds' && (
            <PcBuildsView currencyFormatter={fmt} />
          )}

          {/* VIEW: INVENTORY & STOCK OVERVIEW */}
          {(activeMenu === 'inventory' || activeMenu === 'low-stock') && (
            <InventoryView products={products} currencyFormatter={fmt} />
          )}

          {/* VIEW: WARRANTIES & RETURNS */}
          {activeMenu === 'warranties' && (
            <WarrantyReturnsView />
          )}

          {/* VIEW: FINANCIAL & SALES REPORTS */}
          {activeMenu === 'reports' && (
            <ReportsView currencyFormatter={fmt} />
          )}

          {/* VIEW: ADMIN MANAGEMENT & ROLES */}
          {activeMenu === 'admin-management' && (
            <AdminManagementView
              usersList={usersList}
              onToggleUserRole={handleToggleUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* VIEW: REVIEWS */}
          {activeMenu === 'reviews' && (
            <div className="tail-content-panel">
              <div className="panel-header-row">
                <div>
                  <h3>Quản Lý Đánh Giá & Phản Hồi Linh Kiện PC</h3>
                  <p className="panel-sub">Theo dõi cảm nhận của khách hàng về dàn máy và linh kiện bán ra</p>
                </div>
              </div>
              <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
                  ⭐ 98.6% Khách Hàng Hài Lòng với Chất Lượng Lắp Ráp & Giao Hàng
                </div>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                  Tất cả các đánh giá mới nhất từ website storefront được tự động kiểm duyệt và hiển thị tại đây.
                </p>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 2: ORDERS MANAGEMENT & REALTIME PIPELINE                   */}
          {/* =============================================================== */}
          {activeMenu === 'orders' && (
            <div className="tail-content-panel">
              <OrdersView
                orders={orders}
                onStatusChange={handleStatusChange}
                onConfirmPayment={handleConfirmPayment}
                onPrintInvoice={(o) => setSelectedInvoiceOrder(o)}
                onSimulateOrder={handleSimulateNewOrder}
                onSyncOrders={loadData}
                isLoading={isLoading}
                currencyFormatter={fmt}
              />
            </div>
          )}

          {/* =============================================================== */}
          {/* VIEW 3: PRODUCTS & HARDWARE SPECS CRUD                           */}
          {/* =============================================================== */}
          {(activeMenu === 'products' || activeMenu === 'add-product') && (
            <div className="tail-content-panel">
              {/* Professional Product Add / Edit Enterprise Form */}
              {(editingProduct || activeMenu === 'add-product') && (
                <div ref={editFormRef} style={{ marginBottom: 24 }}>
                  <ProductEditor
                    initialData={editingProduct}
                    categories={categories}
                    isEditing={Boolean(editingProduct)}
                    onSave={handleSaveProduct}
                    onCancel={() => {
                      setEditingProduct(null);
                      setActiveMenu('products');
                    }}
                  />
                </div>
              )}

              {/* Professional Products Management View */}
              {activeMenu === 'products' && !editingProduct && (
                <ProductsView
                  products={products}
                  categories={categories}
                  onAddNewProduct={() => {
                    setEditingProduct(null);
                    setActiveMenu('add-product');
                    setTimeout(() => {
                      if (editFormRef.current) {
                        editFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  currencyFormatter={fmt}
                />
              )}
            </div>
          )}

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
