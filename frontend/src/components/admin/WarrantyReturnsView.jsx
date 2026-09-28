import React, { useState, useMemo } from 'react';
import {
  ShieldCheck, ShieldAlert, Plus, Download, RefreshCw, Search,
  Filter, CheckCircle2, Clock, AlertTriangle, RotateCcw, Wrench,
  DollarSign, RefreshCw as ReplaceIcon, Package, Hash, User,
  Calendar, ExternalLink, Ban, ChevronLeft, ChevronRight, Check, X
} from 'lucide-react';
import RmaDetailDrawer from './RmaDetailDrawer';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

const INITIAL_RMA_TICKETS = [
  {
    id: 'RMA-2026-081',
    orderId: 'PC-000845',
    customerName: 'Hoàng Minh Quân',
    customerPhone: '0912 345 678',
    customerEmail: 'quan.hm@gmail.com',
    customerAddress: 'KĐT Ciputra, Tây Hồ, Hà Nội',
    productName: 'VGA ASUS ROG Strix GeForce RTX 5070 Ti 16GB OC',
    category: 'Card Màn Hình (VGA)',
    serialNumber: 'SN-RTX5070TI-891024',
    type: 'Repair',
    reason: 'Mất tín hiệu màn hình khi tải game nặng (Crash to Desktop), quạt số 2 có tiếng rè',
    status: 'Inspection',
    createdDate: '2026-09-26',
    purchaseDate: '2026-01-15',
    warrantyPeriod: '36 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 28 tháng',
    technician: 'KTV Hoàng Nam',
    timeline: [
      {
        id: 't-1',
        time: '28/09/2026 14:15',
        author: 'KTV Hoàng Nam',
        role: 'Kỹ Thuật Viên Phần Cứng',
        action: 'Chuyển KTV Đo Kiểm Tra (Inspection)',
        note: 'Trở kháng đường 12V GPU bình thường, lỗi do chập mạch điều tốc quạt Fan Controller.'
      },
      {
        id: 't-2',
        time: '27/09/2026 09:30',
        author: 'Nhân Viên Kho TTBH',
        role: 'Kho Vận',
        action: 'Xác Nhận Đã Nhận Linh Kiện Tại TTBH',
        note: 'Hàng nguyên hộp xốp, đầy đủ phụ kiện và phiếu mua hàng.'
      },
      {
        id: 't-3',
        time: '26/09/2026 16:00',
        author: 'CSKH Thảo Ly',
        role: 'Hỗ Trợ Khách Hàng',
        action: 'Phê duyệt hồ sơ bảo hành (Approved)',
        note: 'Sản phẩm còn 28 tháng bảo hành chính hãng. Đã cấp mã vận đơn gửi hàng miễn phí.'
      },
      {
        id: 't-4',
        time: '26/09/2026 10:20',
        author: 'Hoàng Minh Quân',
        role: 'Khách Hàng',
        action: 'Gửi yêu cầu bảo hành trực tuyến (Submitted)',
        note: 'Khách báo lỗi quạt kêu to và crash màn hình xanh.'
      }
    ],
    technicianNotes: [
      {
        id: 'n-1',
        author: 'KTV Hoàng Nam',
        role: 'Kỹ Thuật Viên Trưởng',
        time: '28/09/2026 14:30',
        text: 'Đã tháo tản kiểm tra: keo tản nhiệt nguyên bản, tem ốc chưa có vết rạch. Đã tra mỡ bôi trơn bạc đạn quạt số 2. Chạy FurMark 2 tiếng nhiệt độ ổn định 67 độ C.'
      }
    ]
  },
  {
    id: 'RMA-2026-080',
    orderId: 'PC-000788',
    customerName: 'Trần Văn Mạnh',
    customerPhone: '0988 777 666',
    customerEmail: 'manh.tran@techcorp.vn',
    customerAddress: 'Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
    productName: 'Bo mạch chủ MSI MAG B760M MORTAR WIFI DDR5',
    category: 'Bo Mạch Chủ (Mainboard)',
    serialNumber: 'SN-MAIN-B760M-552199',
    type: 'Replacement',
    reason: 'Không nhận khe RAM B2, đèn LED EZ Debug báo DRAM nhấp nháy đỏ',
    status: 'In Repair',
    createdDate: '2026-09-24',
    purchaseDate: '2026-04-10',
    warrantyPeriod: '36 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 31 tháng',
    technician: 'KTV Lê Phần Cứng',
    timeline: [
      {
        id: 't-1',
        time: '25/09/2026 11:00',
        author: 'KTV Lê Phần Cứng',
        role: 'Kỹ Thuật Viên Phần Cứng',
        action: 'Chuyển sửa chữa (In Repair)',
        note: 'Đang tiến hành hàn nạp lại BIOS và kiểm tra chân socket CPU.'
      }
    ]
  },
  {
    id: 'RMA-2026-079',
    orderId: 'PC-000720',
    customerName: 'Lê Hoàng Nam',
    customerPhone: '0903 111 222',
    customerEmail: 'nam.le@studio.com',
    customerAddress: 'Phường Đa Kao, Quận 1, TP.HCM',
    productName: 'Nguồn máy tính Corsair RM850e 850W 80 Plus Gold ATX 3.0',
    category: 'Nguồn Máy Tính (PSU)',
    serialNumber: 'SN-PSU-RM850E-100452',
    type: 'Warranty',
    reason: 'Quạt tản nhiệt nguồn kêu rè khi hệ thống tải nặng trên 500W',
    status: 'Completed',
    createdDate: '2026-09-20',
    purchaseDate: '2025-10-12',
    warrantyPeriod: '60 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 49 tháng',
    technician: 'KTV Hoàng Nam',
    timeline: [
      {
        id: 't-1',
        time: '24/09/2026 16:30',
        author: 'CSKH Thảo Ly',
        role: 'CSKH',
        action: 'Hoàn tất bàn giao cho khách (Completed)',
        note: 'Khách hàng đã nhận lại nguồn mới 100% đổi từ hãng Corsair.'
      }
    ]
  },
  {
    id: 'RMA-2026-078',
    orderId: 'PC-000810',
    customerName: 'Phạm Thu Trang',
    customerPhone: '0977 888 999',
    customerEmail: 'thutrang.pt@outlook.com',
    customerAddress: 'Vinhomes Central Park, Bình Thạnh, TP.HCM',
    productName: 'Ổ Cứng SSD Samsung 990 PRO 2TB NVMe PCIe 4.0',
    category: 'Ổ Cứng SSD',
    serialNumber: 'SN-SSD-990PRO-778812',
    type: 'Refund',
    reason: 'SSD bị lỗi không nhận trong BIOS sau khi cập nhật Firmware',
    status: 'Refunded',
    createdDate: '2026-09-18',
    purchaseDate: '2026-09-02',
    warrantyPeriod: '60 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 59 tháng',
    technician: 'Admin Master',
    timeline: [
      {
        id: 't-1',
        time: '20/09/2026 14:00',
        author: 'Admin Master',
        role: 'Quản Trị Viên',
        action: 'Hoàn tiền thành công (Refunded)',
        note: 'Đã hoàn trả 4.290.000đ vào tài khoản ngân hàng của khách.'
      }
    ]
  },
  {
    id: 'RMA-2026-077',
    orderId: 'PC-000755',
    customerName: 'Đặng Tuấn Anh',
    customerPhone: '0933 555 444',
    customerEmail: 'tuananh.dang@cybernet.vn',
    customerAddress: 'Quận Cầu Giấy, Hà Nội',
    productName: 'Bộ Nhớ RAM Corsair Dominator Titanium RGB 64GB DDR5 6000MHz',
    category: 'Bộ Nhớ RAM',
    serialNumber: 'SN-RAM-TITANIUM-990011',
    type: 'Warranty',
    reason: 'Không thể kích hoạt profile XMP 6000MHz, máy chỉ chạy ở bus mặc định 4800MHz',
    status: 'Pending Review',
    createdDate: '2026-09-27',
    purchaseDate: '2026-08-15',
    warrantyPeriod: '36 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 35 tháng',
    technician: 'Chưa phân công',
    timeline: [
      {
        id: 't-1',
        time: '27/09/2026 15:00',
        author: 'Đặng Tuấn Anh',
        role: 'Khách Hàng',
        action: 'Tạo phiếu bảo hành (Submitted)',
        note: 'Yêu cầu kiểm tra tương thích với bo mạch Asus ROG Z790 Hero.'
      }
    ]
  },
  {
    id: 'RMA-2026-076',
    orderId: 'PC-000712',
    customerName: 'Nguyễn Quốc Cường',
    customerPhone: '0944 666 777',
    customerEmail: 'cuongnq@gmail.com',
    customerAddress: 'Quận Hải Châu, Đà Nẵng',
    productName: 'Tản Nhiệt Nước AIO NZXT Kraken Elite 360 RGB LCD',
    category: 'Tản Nhiệt (Cooling)',
    serialNumber: 'SN-AIO-KRAKEN-332211',
    type: 'Return',
    reason: 'Khách mua nhầm kích thước 360mm không lắp vừa vỏ Case Mini-ITX',
    status: 'Approved',
    createdDate: '2026-09-25',
    purchaseDate: '2026-09-22',
    warrantyPeriod: '72 Tháng Chính Hãng',
    warrantyStatus: 'Còn hạn 71 tháng',
    technician: 'CSKH Thảo Ly',
    timeline: [
      {
        id: 't-1',
        time: '25/09/2026 17:00',
        author: 'CSKH Thảo Ly',
        role: 'CSKH',
        action: 'Phê duyệt đổi sang mã 240mm (Approved)',
        note: 'Khách gửi lại sản phẩm nguyên seal chưa bóc hộp để đổi sang mã AIO 240mm.'
      }
    ]
  },
  {
    id: 'RMA-2026-075',
    orderId: 'PC-000690',
    customerName: 'Vũ Đức Thịnh',
    customerPhone: '0966 222 333',
    customerEmail: 'thinhvd@mining.vn',
    customerAddress: 'Quận Đống Đa, Hà Nội',
    productName: 'VGA MSI GeForce RTX 4090 SUPRIM X 24GB',
    category: 'Card Màn Hình (VGA)',
    serialNumber: 'SN-RTX4090-SUPRIM-112233',
    type: 'Warranty',
    reason: 'Cháy nổ chân cắm 12VHPWR do cắm dây nguồn cáp nối bên thứ ba không đúng chuẩn',
    status: 'Rejected',
    createdDate: '2026-09-15',
    purchaseDate: '2025-06-20',
    warrantyPeriod: '36 Tháng Chính Hãng',
    warrantyStatus: 'Từ chối bảo hành (Rách tem & Cháy nổ ngoại lực)',
    technician: 'KTV Hoàng Nam',
    timeline: [
      {
        id: 't-1',
        time: '16/09/2026 10:00',
        author: 'KTV Hoàng Nam',
        role: 'Kỹ Thuật Viên Trưởng',
        action: 'Từ chối tiếp nhận bảo hành (Rejected)',
        note: 'Sản phẩm có dấu hiệu can thiệp mạch điện, chân cắm 12V-2x6 bị chảy nhựa do quá tải công suất.'
      }
    ]
  }
];

export default function WarrantyReturnsView() {
  const [tickets, setTickets] = useState(INITIAL_RMA_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected ticket for Drawer
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New RMA Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newRmaForm, setNewRmaForm] = useState({
    orderId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    productName: '',
    serialNumber: '',
    type: 'Warranty',
    reason: ''
  });

  // Calculate 7 Summary KPI Metrics
  const summaryMetrics = useMemo(() => {
    const openCount = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Rejected' && t.status !== 'Refunded').length;
    const pendingReviewCount = tickets.filter(t => t.status === 'Pending Review' || t.status === 'Submitted').length;
    const approvedCount = tickets.filter(t => t.status === 'Approved' || t.status === 'Product Received').length;
    const rejectedCount = tickets.filter(t => t.status === 'Rejected').length;
    const inRepairCount = tickets.filter(t => t.status === 'In Repair' || t.status === 'Inspection' || t.status === 'Replacement').length;
    const completedCount = tickets.filter(t => t.status === 'Completed').length;
    const refundedCount = tickets.filter(t => t.status === 'Refunded').length;

    return {
      openCount,
      pendingReviewCount,
      approvedCount,
      rejectedCount,
      inRepairCount,
      completedCount,
      refundedCount
    };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesId = (t.id || '').toLowerCase().includes(q);
        const matchesOrder = (t.orderId || '').toLowerCase().includes(q);
        const matchesSn = (t.serialNumber || '').toLowerCase().includes(q);
        const matchesCust = (t.customerName || '').toLowerCase().includes(q);
        const matchesProd = (t.productName || '').toLowerCase().includes(q);
        if (!matchesId && !matchesOrder && !matchesSn && !matchesCust && !matchesProd) return false;
      }

      // Type
      if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;

      return true;
    });
  }, [tickets, searchTerm, typeFilter, statusFilter]);

  // Handle update from drawer
  const handleUpdateRma = (id, updates) => {
    setTickets(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));
  };

  // Submit new RMA
  const handleCreateRma = (e) => {
    e.preventDefault();
    if (!newRmaForm.customerName.trim() || !newRmaForm.productName.trim()) return;

    const newTicket = {
      id: `RMA-2026-0${Math.floor(82 + Math.random() * 20)}`,
      orderId: newRmaForm.orderId.trim() || 'PC-000850',
      customerName: newRmaForm.customerName.trim(),
      customerPhone: newRmaForm.customerPhone.trim() || '0988 123 456',
      customerAddress: newRmaForm.customerAddress.trim() || 'Hà Nội',
      productName: newRmaForm.productName.trim(),
      category: 'Linh Kiện Máy Tính',
      serialNumber: newRmaForm.serialNumber.trim() || `SN-NEW-${Date.now().toString().slice(-6)}`,
      type: newRmaForm.type,
      reason: newRmaForm.reason.trim() || 'Khách mang linh kiện đến trung tâm bảo hành kiểm tra',
      status: 'Pending Review',
      createdDate: new Date().toISOString().slice(0, 10),
      purchaseDate: new Date().toISOString().slice(0, 10),
      warrantyPeriod: '36 Tháng Chính Hãng',
      warrantyStatus: 'Còn hạn chính hãng',
      technician: 'Chưa phân công',
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: new Date().toLocaleString('vi-VN'),
          author: 'Admin Master',
          role: 'Quản Trị Viên',
          action: 'Tiếp nhận phiếu bảo hành mới tại quầy',
          note: newRmaForm.reason.trim() || 'Tạo phiếu tiếp nhận linh kiện'
        }
      ],
      technicianNotes: []
    };

    setTickets([newTicket, ...tickets]);
    setIsNewModalOpen(false);
    setNewRmaForm({
      orderId: '',
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      productName: '',
      serialNumber: '',
      type: 'Warranty',
      reason: ''
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã RMA', 'Mã Đơn', 'Khách Hàng', 'Số Điện Thoại', 'Linh Kiện', 'Serial Number', 'Loại Yêu Cầu', 'Lý Do Lỗi', 'Trạng Thái', 'Ngày Tạo'];
    const rows = filteredTickets.map(t => [
      t.id,
      t.orderId,
      `"${t.customerName}"`,
      t.customerPhone,
      `"${t.productName}"`,
      t.serialNumber,
      t.type,
      `"${t.reason}"`,
      t.status,
      t.createdDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rma_warranty_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Type Pill
  const renderTypePill = (type) => {
    switch (type) {
      case 'Return':
        return <span className="promo-type-pill pill-category"><RotateCcw size={12} /> Return</span>;
      case 'Refund':
        return <span className="promo-type-pill pill-shipping"><DollarSign size={12} /> Refund</span>;
      case 'Warranty':
        return <span className="promo-type-pill pill-percentage"><ShieldCheck size={12} /> Warranty</span>;
      case 'Repair':
        return <span className="promo-type-pill pill-bundle"><Wrench size={12} /> Repair</span>;
      case 'Replacement':
        return <span className="promo-type-pill pill-fixed"><ReplaceIcon size={12} /> Replacement</span>;
      default:
        return <span className="promo-type-pill pill-fixed">{type}</span>;
    }
  };

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="badge-promo-status status-active">✓ Completed</span>;
      case 'In Repair':
      case 'Inspection':
        return <span className="badge-promo-status status-scheduled">⚙ {status}</span>;
      case 'Approved':
      case 'Product Received':
        return <span className="badge-promo-status" style={{ background: '#ecfeff', color: '#0891b2', border: '1px solid #a5f3fc' }}>📦 {status}</span>;
      case 'Pending Review':
      case 'Submitted':
        return <span className="badge-promo-status status-expired">🕒 {status}</span>;
      case 'Refunded':
        return <span className="badge-promo-status" style={{ background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8' }}>$ Refunded</span>;
      case 'Rejected':
        return <span className="badge-promo-status status-disabled">✕ Rejected</span>;
      default:
        return <span className="badge-promo-status status-disabled">{status}</span>;
    }
  };

  return (
    <div className="warranties-view-wrapper">
      {/* Page Header */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Tiếp Nhận Bảo Hành & Đổi Trả Linh Kiện (Returns & Warranty RMA)
            </h3>
            <span className="badge-active-tag badge-healthy" style={{ fontSize: 12 }}>
              {tickets.length} Phiếu RMA
            </span>
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Quy trình tiếp nhận kiểm tra phần cứng, đo đạc kỹ thuật, đổi mới 1-đổi-1 và lưu vết truy xuất nguồn gốc
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn-tail-secondary" onClick={handleExportCSV}>
            <Download size={15} /> Xuất Báo Cáo RMA
          </button>
          <button
            type="button"
            className="btn-tail-primary"
            onClick={() => setIsNewModalOpen(true)}
          >
            <Plus size={15} /> + Tiếp Nhận Phiếu RMA Mới
          </button>
        </div>
      </div>

      {/* 7 KPI SUMMARY CARDS */}
      <div className="rma-kpi-grid">
        {/* Card 1: Open Requests */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">OPEN REQUESTS</span>
            <div className="c-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Package size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.openCount}</div>
          <div className="c-kpi-foot positive">
            <span>Đang trong luồng xử lý</span>
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">PENDING REVIEW</span>
            <div className="c-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.pendingReviewCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Chờ KTV duyệt hồ sơ</span>
          </div>
        </div>

        {/* Card 3: Approved */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">APPROVED</span>
            <div className="c-kpi-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.approvedCount}</div>
          <div className="c-kpi-foot positive">
            <span>Đã duyệt / Chờ gửi máy</span>
          </div>
        </div>

        {/* Card 4: Rejected */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">REJECTED</span>
            <div className="c-kpi-icon" style={{ background: '#fef2f2', color: '#dc2626' }}>
              <Ban size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.rejectedCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Rách tem / Lỗi người dùng</span>
          </div>
        </div>

        {/* Card 5: In Repair */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">IN REPAIR</span>
            <div className="c-kpi-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <Wrench size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.inRepairCount}</div>
          <div className="c-kpi-foot positive">
            <span>Đang đo đạc / sửa chữa</span>
          </div>
        </div>

        {/* Card 6: Completed */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">COMPLETED</span>
            <div className="c-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.completedCount}</div>
          <div className="c-kpi-foot positive">
            <span>Đã bàn giao cho khách</span>
          </div>
        </div>

        {/* Card 7: Refunded */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">REFUNDED</span>
            <div className="c-kpi-icon" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.refundedCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Đã hoàn tiền mua</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="customer-filters-bar">
        {/* Search */}
        <div className="c-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tra cứu theo mã RMA (RMA-...), Đơn hàng (#PC-...), Serial Number (SN-...), Tên khách, Linh kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="c-filters-group">
          {/* Request Type */}
          <div className="c-filter-item">
            <label>Loại Yêu Cầu:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Tất cả loại ({tickets.length})</option>
              <option value="Warranty">Bảo hành (Warranty)</option>
              <option value="Repair">Sửa chữa (Repair)</option>
              <option value="Replacement">Đổi mới 1-đổi-1 (Replacement)</option>
              <option value="Return">Đổi trả hàng (Return)</option>
              <option value="Refund">Hoàn tiền (Refund)</option>
            </select>
          </div>

          {/* Status */}
          <div className="c-filter-item">
            <label>Trạng Thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="Pending Review">Chờ duyệt (Pending Review)</option>
              <option value="Approved">Đã duyệt (Approved)</option>
              <option value="Product Received">Đã nhận hàng (Product Received)</option>
              <option value="Inspection">KTV kiểm tra (Inspection)</option>
              <option value="In Repair">Đang sửa chữa (In Repair)</option>
              <option value="Completed">Hoàn tất (Completed)</option>
              <option value="Refunded">Đã hoàn tiền (Refunded)</option>
              <option value="Rejected">Bị từ chối (Rejected)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Return Table */}
      <div className="tail-table-container">
        <table className="tail-data-table">
          <thead>
            <tr>
              <th>MÃ PHIẾU RMA</th>
              <th>ĐƠN HÀNG</th>
              <th>KHÁCH HÀNG</th>
              <th>LINH KIỆN PHẦN CỨNG</th>
              <th>SERIAL NUMBER (S/N)</th>
              <th>HÌNH THỨC</th>
              <th>LÝ DO LỖI</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY TẠO</th>
              <th style={{ textAlign: 'center' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  <ShieldCheck size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Không tìm thấy phiếu yêu cầu bảo hành hoặc đổi trả nào.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedTicket(t)}
                >
                  {/* Request ID */}
                  <td>
                    <strong style={{ color: '#4f46e5', letterSpacing: '0.02em' }}>#{t.id}</strong>
                  </td>

                  {/* Order ID */}
                  <td>
                    <code style={{ color: '#2563eb' }}>#{t.orderId}</code>
                  </td>

                  {/* Customer */}
                  <td>
                    <div>
                      <strong style={{ fontSize: 13, color: '#0f172a' }}>{t.customerName}</strong>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{t.customerPhone}</div>
                    </div>
                  </td>

                  {/* Product */}
                  <td>
                    <div style={{ maxWidth: 220 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', display: 'block' }}>
                        {t.productName}
                      </span>
                      <span style={{ fontSize: 11, color: '#94a3b8' }}>{t.category}</span>
                    </div>
                  </td>

                  {/* Serial Number */}
                  <td>
                    <span className="rma-sn-tag">
                      <Hash size={11} /> {t.serialNumber}
                    </span>
                  </td>

                  {/* Request Type */}
                  <td>
                    {renderTypePill(t.type)}
                  </td>

                  {/* Reason */}
                  <td>
                    <div style={{ maxWidth: 200, fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
                      {t.reason}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    {renderStatusBadge(t.status)}
                  </td>

                  {/* Created Date */}
                  <td style={{ fontSize: 12, color: '#64748b' }}>
                    {t.createdDate}
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-tail-primary"
                      style={{ padding: '5px 10px', fontSize: 11 }}
                      onClick={() => setSelectedTicket(t)}
                      title="Xem chi tiết & Chuyển đổi trạng thái quy trình"
                    >
                      <ExternalLink size={13} /> Xử lý RMA
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="tail-pagination-bar" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          Hiển thị <strong>{filteredTickets.length}</strong> trên tổng số <strong>{tickets.length}</strong> phiếu bảo hành & đổi trả
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn-tail-secondary" disabled style={{ padding: '6px 12px' }}>
            <ChevronLeft size={14} /> Trang trước
          </button>
          <button type="button" className="btn-tail-primary" style={{ padding: '6px 14px', minWidth: 36 }}>
            1
          </button>
          <button type="button" className="btn-tail-secondary" disabled style={{ padding: '6px 12px' }}>
            Trang sau <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Create New RMA Ticket Modal */}
      {isNewModalOpen && (
        <div className="order-detail-backdrop" onClick={() => setIsNewModalOpen(false)}>
          <div className="tail-form-card" style={{ maxWidth: 540, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-header-row" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  <ShieldCheck size={18} color="#4f46e5" /> Tiếp Nhận Phiếu Bảo Hành Mới
                </h3>
                <p className="panel-sub" style={{ margin: '4px 0 0' }}>
                  Ghi nhận linh kiện cần bảo hành, đo kiểm tra hoặc đổi mới tại quầy
                </p>
              </div>
              <button type="button" className="btn-drawer-close" onClick={() => setIsNewModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRma} className="tail-crud-form">
              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Mã Đơn Hàng Gốc *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: PC-000845"
                    value={newRmaForm.orderId}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, orderId: e.target.value })}
                  />
                </div>
                <div className="form-input-box">
                  <label>Hình Thức Yêu Cầu *</label>
                  <select
                    value={newRmaForm.type}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, type: e.target.value })}
                  >
                    <option value="Warranty">Bảo Hành Chính Hãng (Warranty)</option>
                    <option value="Repair">Sửa Chữa Phần Cứng (Repair)</option>
                    <option value="Replacement">Đổi Mới 1-Đổi-1 (Replacement)</option>
                    <option value="Return">Đổi Trả Hàng (Return)</option>
                    <option value="Refund">Hoàn Tiền (Refund)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Họ và Tên Khách Hàng *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={newRmaForm.customerName}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, customerName: e.target.value })}
                  />
                </div>
                <div className="form-input-box">
                  <label>Số Điện Thoại</label>
                  <input
                    type="text"
                    placeholder="0988 123 456"
                    value={newRmaForm.customerPhone}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, customerPhone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Tên Linh Kiện Phần Cứng *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: VGA RTX 4070 SUPER 12GB"
                    value={newRmaForm.productName}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, productName: e.target.value })}
                  />
                </div>
                <div className="form-input-box">
                  <label>Serial Number (S/N trên tem) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SN-RTX4070-891024"
                    value={newRmaForm.serialNumber}
                    onChange={(e) => setNewRmaForm({ ...newRmaForm, serialNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-input-box">
                <label>Hiện Tượng Lỗi Cần Khắc Phục *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mô tả chi tiết: không lên hình, quạt không quay, crash màn hình xanh..."
                  value={newRmaForm.reason}
                  onChange={(e) => setNewRmaForm({ ...newRmaForm, reason: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => setIsNewModalOpen(false)}
                >
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-tail-primary">
                  <Check size={15} /> Tạo Phiếu Tiếp Nhận RMA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RMA Detail Drawer */}
      {selectedTicket && (
        <RmaDetailDrawer
          rma={selectedTicket}
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          onUpdateRma={handleUpdateRma}
        />
      )}
    </div>
  );
}
