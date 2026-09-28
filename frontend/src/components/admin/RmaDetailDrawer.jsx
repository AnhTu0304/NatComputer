import React, { useState } from 'react';
import {
  X, ShieldCheck, ShieldAlert, CheckCircle2, Clock, AlertTriangle,
  RotateCcw, Wrench, RefreshCw, DollarSign, User, Package,
  Calendar, FileText, Camera, Send, Check, ExternalLink,
  ChevronRight, ArrowRight, Truck, Info, Hash, Ban, Undo2
} from 'lucide-react';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

// Workflow States Pipeline:
// 1. Request Submitted (SUBMITTED)
// 2. Pending Review (REVIEW)
// 3. Approved / Rejected (APPROVED / REJECTED)
// 4. Product Received (RECEIVED)
// 5. Inspection (INSPECTION)
// 6. Repair / Replace / Refund (IN_REPAIR / REPLACEMENT / REFUNDED)
// 7. Completed (COMPLETED)

const WORKFLOW_STEPS = [
  { key: 'SUBMITTED', label: '1. Gửi Yêu Cầu' },
  { key: 'REVIEW', label: '2. Thẩm Định Hồ Sơ' },
  { key: 'APPROVED', label: '3. Phê Duyệt / Chờ Gửi' },
  { key: 'RECEIVED', label: '4. Đã Nhận Linh Kiện' },
  { key: 'INSPECTION', label: '5. KTV Đo Kiểm Tra' },
  { key: 'PROCESSING', label: '6. Xử Lý (Sửa/Đổi/Hoàn)' },
  { key: 'COMPLETED', label: '7. Hoàn Tất Bàn Giao' }
];

export default function RmaDetailDrawer({
  rma,
  isOpen,
  onClose,
  onUpdateRma
}) {
  const [activeTab, setActiveTab] = useState('workflow'); // workflow | details | images | notes
  const [newNote, setNewNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!isOpen || !rma) return null;

  // Determine active step index (0 - 6)
  const getStepIndex = (status) => {
    switch (status) {
      case 'Submitted':
        return 0;
      case 'Pending Review':
        return 1;
      case 'Approved':
        return 2;
      case 'Rejected':
        return 2;
      case 'Product Received':
        return 3;
      case 'Inspection':
        return 4;
      case 'In Repair':
      case 'Replacement':
      case 'Refunded':
        return 5;
      case 'Completed':
        return 6;
      default:
        return 1;
    }
  };

  const currentStepIdx = getStepIndex(rma.status);
  const isRejected = rma.status === 'Rejected';

  // Handle workflow status transitions
  const handleTransition = (nextStatus, logMessage) => {
    const updatedTimeline = [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleString('vi-VN'),
        author: 'Admin Master',
        role: 'Quản Trị Viên / KTV Trưởng',
        action: `Chuyển trạng thái: ${nextStatus}`,
        note: logMessage
      },
      ...(rma.timeline || [])
    ];

    if (onUpdateRma) {
      onUpdateRma(rma.id, {
        status: nextStatus,
        timeline: updatedTimeline
      });
    }

    setActionSuccessMsg(`Đã cập nhật trạng thái phiếu RMA sang: ${nextStatus}`);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Add technician note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const noteItem = {
      id: `nt-${Date.now()}`,
      author: 'KTV Hoàng Nam',
      role: 'Kỹ Thuật Viên Phần Cứng',
      time: new Date().toLocaleString('vi-VN'),
      text: newNote.trim()
    };

    const updatedNotes = [noteItem, ...(rma.technicianNotes || [])];

    if (onUpdateRma) {
      onUpdateRma(rma.id, { technicianNotes: updatedNotes });
    }

    setNewNote('');
    setActionSuccessMsg('Đã lưu ghi chú kỹ thuật viên thành công!');
    setTimeout(() => setActionSuccessMsg(''), 2500);
  };

  return (
    <div className="order-detail-backdrop" onClick={onClose}>
      <div className="order-detail-drawer rma-detail-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-strip">
          <div className="drawer-title-group">
            <div className="order-number-title">
              <ShieldCheck size={20} color="#4f46e5" />
              <span>Phiếu Bảo Hành / Đổi Trả: <strong>#{rma.id}</strong></span>
              <span className={`badge-active-tag rma-status-${(rma.status || '').toLowerCase().replace(/\s+/g, '-')}`} style={{ marginLeft: 8 }}>
                {rma.status}
              </span>
              <span className={`promo-type-pill pill-${(rma.type || '').toLowerCase()}`} style={{ marginLeft: 6 }}>
                {rma.type}
              </span>
            </div>
            <div className="order-meta-sub">
              <span>Đơn hàng: <strong>#{rma.orderId}</strong></span>
              <span>•</span>
              <span>Ngày tạo phiếu: {rma.createdDate}</span>
              <span>•</span>
              <span>S/N: <code>{rma.serialNumber}</code></span>
            </div>
          </div>
          <button type="button" className="btn-drawer-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Action success alert */}
        {actionSuccessMsg && (
          <div className="customer-alert-banner success">
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* WORKFLOW PIPELINE PROGRESS STEPPER */}
        <div className="rma-stepper-container">
          <div className="rma-stepper-track">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isPassed = currentStepIdx > idx;
              const isCurrent = currentStepIdx === idx && !isRejected;
              const isThisRejected = isRejected && idx === 2;

              return (
                <div
                  key={step.key}
                  className={`rma-step-node ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''} ${isThisRejected ? 'rejected' : ''}`}
                >
                  <div className="step-circle">
                    {isPassed ? <Check size={14} /> : (isThisRejected ? <Ban size={14} /> : idx + 1)}
                  </div>
                  <div className="step-label">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WORKFLOW ACTION TOOLBAR (Contextual buttons) */}
        <div className="rma-action-banner">
          <div className="rma-action-desc">
            <Info size={16} color="#3b82f6" />
            <span>
              Trạng thái hiện tại: <strong>{rma.status}</strong>. Thực hiện các nghiệp vụ kỹ thuật tương ứng:
            </span>
          </div>

          <div className="rma-action-buttons">
            {/* When Pending Review */}
            {(rma.status === 'Pending Review' || rma.status === 'Submitted') && (
              <>
                <button
                  type="button"
                  className="btn-tail-primary"
                  onClick={() => handleTransition('Approved', 'Hồ sơ bảo hành hợp lệ, phê duyệt tiếp nhận linh kiện tại trung tâm bảo hành.')}
                >
                  <CheckCircle2 size={14} /> Phê Duyệt Tiếp Nhận (Approve)
                </button>
                <button
                  type="button"
                  className="btn-tail-delete"
                  onClick={() => handleTransition('Rejected', 'Từ chối tiếp nhận bảo hành: tem rách niêm phong hoặc linh kiện biến dạng vật lý.')}
                >
                  <Ban size={14} /> Từ Chối Yêu Cầu (Reject)
                </button>
              </>
            )}

            {/* When Approved */}
            {rma.status === 'Approved' && (
              <button
                type="button"
                className="btn-tail-primary"
                onClick={() => handleTransition('Product Received', 'Đã tiếp nhận linh kiện từ đơn vị chuyển phát ViettelPost/khách gửi trực tiếp.')}
              >
                <Truck size={14} /> Xác Nhận Đã Nhận Linh Kiện Tại TTBH
              </button>
            )}

            {/* When Product Received */}
            {rma.status === 'Product Received' && (
              <button
                type="button"
                className="btn-tail-primary"
                onClick={() => handleTransition('Inspection', 'Bàn giao linh kiện cho bộ phận KTV phòng Lab đo đạc kiểm tra thông số.')}
              >
                <Wrench size={14} /> Chuyển KTV Đo Kiểm Tra (Inspection)
              </button>
            )}

            {/* When Inspection */}
            {rma.status === 'Inspection' && (
              <>
                <button
                  type="button"
                  className="btn-tail-primary"
                  style={{ background: '#f59e0b' }}
                  onClick={() => handleTransition('In Repair', 'Phát hiện lỗi nguồn VRM, tiến hành thay thế linh kiện và hàn lại mạch.')}
                >
                  <Wrench size={14} /> Chuyển Sửa Chữa (Repair)
                </button>
                <button
                  type="button"
                  className="btn-tail-primary"
                  style={{ background: '#0284c7' }}
                  onClick={() => handleTransition('Replacement', 'Lỗi chip GPU không thể khắc phục, tiến hành thủ tục đổi mới 1-đổi-1.')}
                >
                  <RefreshCw size={14} /> Đổi Mới 1-Đổi-1 (Replacement)
                </button>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => handleTransition('Refunded', 'Linh kiện hết hàng đổi mới, thống nhất hoàn trả 100% tiền mặt theo yêu cầu khách.')}
                >
                  <DollarSign size={14} /> Hoàn Tiền (Refund)
                </button>
              </>
            )}

            {/* When In Repair or Replacement or Refunded */}
            {(rma.status === 'In Repair' || rma.status === 'Replacement' || rma.status === 'Refunded') && (
              <button
                type="button"
                className="btn-tail-primary"
                style={{ background: '#10b981' }}
                onClick={() => handleTransition('Completed', 'Linh kiện đã được test ổn định 24h FurMark/Prime95, đóng thùng bàn giao cho khách.')}
              >
                <CheckCircle2 size={14} /> Hoàn Tất Xử Lý & Bàn Giao Khách (Complete)
              </button>
            )}

            {/* When Completed or Rejected */}
            {(rma.status === 'Completed' || rma.status === 'Rejected') && (
              <button
                type="button"
                className="btn-tail-secondary"
                onClick={() => handleTransition('Pending Review', 'Mở lại hồ sơ để xem xét lại theo khiếu nại của khách hàng.')}
              >
                <Undo2 size={14} /> Mở Lại Hồ Sơ Phiếu
              </button>
            )}
          </div>
        </div>

        {/* Tab selection */}
        <div className="customer-tabs-bar">
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            <Clock size={15} /> Nhật Ký Truy Vết (Traceability Timeline)
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Package size={15} /> Chi Tiết Linh Kiện & Bảo Hành
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <Camera size={15} /> Ảnh Khách Gửi & Tem Niêm Phong ({(rma.images || []).length})
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <FileText size={15} /> Ghi Chú Kỹ Thuật ({(rma.technicianNotes || []).length})
          </button>
        </div>

        {/* TAB 1: Traceability Timeline */}
        {activeTab === 'workflow' && (
          <div className="customer-tab-content">
            <div className="c-activity-timeline">
              {(rma.timeline || [
                {
                  id: 't-1',
                  time: '28/09/2026 14:15',
                  author: 'KTV Hoàng Nam',
                  role: 'Kỹ Thuật Viên Phần Cứng',
                  action: 'Tiếp nhận thiết bị và đo đạc trở kháng',
                  note: 'Trở kháng đường 12V GPU bình thường, lỗi do chập mạch điều tốc quạt Fan Controller.'
                },
                {
                  id: 't-2',
                  time: '27/09/2026 09:30',
                  author: 'Nhân Viên Kho TTBH',
                  role: 'Kho Vận',
                  action: 'Đã nhận linh kiện từ ViettelPost',
                  note: 'Hàng nguyên hộp xốp, đầy đủ phụ kiện và phiếu mua hàng.'
                },
                {
                  id: 't-3',
                  time: '26/09/2026 16:00',
                  author: 'CSKH Thảo Ly',
                  role: 'Hỗ Trợ Khách Hàng',
                  action: 'Phê duyệt hồ sơ bảo hành',
                  note: 'Sản phẩm còn 28 tháng bảo hành chính hãng. Đã cấp mã vận đơn gửi hàng miễn phí.'
                },
                {
                  id: 't-4',
                  time: '26/09/2026 10:20',
                  author: rma.customerName,
                  role: 'Khách Hàng',
                  action: 'Tạo phiếu yêu cầu bảo hành trực tuyến',
                  note: rma.reason || 'Khách báo lỗi quạt kêu to và crash màn hình xanh.'
                }
              ]).map((item) => (
                <div key={item.id} className="c-timeline-item">
                  <div className="c-timeline-marker marker-support">
                    <Wrench size={13} />
                  </div>
                  <div className="c-timeline-body">
                    <div className="c-timeline-header">
                      <strong>{item.action}</strong>
                      <span className="c-timeline-time">{item.time}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>
                      Người thực hiện: <strong>{item.author}</strong> ({item.role})
                    </div>
                    <p className="c-timeline-desc">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: Product & Warranty Details */}
        {activeTab === 'details' && (
          <div className="customer-tab-content">
            <div className="rma-grid-2col">
              {/* Product Info Box */}
              <div className="rma-info-panel">
                <h4><Package size={15} /> Thông Tin Linh Kiện Phần Cứng</h4>
                <div className="c-info-grid" style={{ marginTop: 10 }}>
                  <div>
                    <span className="c-info-lbl">Tên linh kiện:</span>
                    <strong className="c-info-val" style={{ color: '#0f172a' }}>{rma.productName}</strong>
                  </div>
                  <div>
                    <span className="c-info-lbl">Mã Serial Number:</span>
                    <span className="rma-sn-tag"><Hash size={12} /> {rma.serialNumber}</span>
                  </div>
                  <div>
                    <span className="c-info-lbl">Phân loại:</span>
                    <span className="c-info-val">{rma.category || 'Card Màn Hình (VGA)'}</span>
                  </div>
                  <div>
                    <span className="c-info-lbl">Mã Đơn Hàng:</span>
                    <strong className="c-info-val" style={{ color: '#2563eb' }}>#{rma.orderId}</strong>
                  </div>
                </div>

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <div className="c-info-lbl">Mô tả hiện tượng lỗi từ khách hàng:</div>
                  <div className="rma-issue-box">
                    "{rma.reason || rma.issue || 'Không nhận tín hiệu màn hình khi tải game nặng.'}"
                  </div>
                </div>
              </div>

              {/* Warranty Status Box */}
              <div className="rma-info-panel">
                <h4><ShieldCheck size={15} /> Chính Sách & Thời Hạn Bảo Hành</h4>
                <div className="c-info-grid" style={{ marginTop: 10 }}>
                  <div>
                    <span className="c-info-lbl">Ngày xuất bán:</span>
                    <span className="c-info-val">{rma.purchaseDate || '15/01/2026'}</span>
                  </div>
                  <div>
                    <span className="c-info-lbl">Thời hạn bảo hành:</span>
                    <span className="c-info-val">{rma.warrantyPeriod || '36 Tháng Chính Hãng'}</span>
                  </div>
                  <div>
                    <span className="c-info-lbl">Tình trạng bảo hành:</span>
                    <span className="badge-active-tag badge-healthy">
                      {rma.warrantyStatus || 'Còn hạn 28 tháng'}
                    </span>
                  </div>
                  <div>
                    <span className="c-info-lbl">Chính sách áp dụng:</span>
                    <span className="c-info-val">Lỗi 1-đổi-1 trong 30 ngày đầu, bảo hành hãng 36T</span>
                  </div>
                </div>

                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: 13, margin: '0 0 8px' }}><User size={13} /> Thông Tin Khách Hàng</h4>
                  <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                    <div>Họ và tên: <strong>{rma.customerName}</strong></div>
                    <div>Số điện thoại: <code>{rma.customerPhone || '0988 123 456'}</code></div>
                    <div>Địa chỉ gửi trả: {rma.customerAddress || 'KĐT Ciputra, Tây Hồ, Hà Nội'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Customer Uploaded Images */}
        {activeTab === 'images' && (
          <div className="customer-tab-content">
            <p style={{ margin: '0 0 14px', fontSize: 13, color: '#64748b' }}>
              Hình ảnh chụp linh kiện, tem bảo hành niêm phong và mã lỗi màn hình xanh (BSOD) do khách hàng cung cấp:
            </p>
            <div className="rma-images-grid">
              {(rma.images || [
                {
                  url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
                  caption: 'Ảnh chụp mặt lưng card đồ họa và tem niêm phong ốc'
                },
                {
                  url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80',
                  caption: 'Ảnh chụp cận cảnh quạt tản nhiệt số 2 bị kẹt cơ'
                },
                {
                  url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
                  caption: 'Màn hình máy tính bị sọc xanh (Artifacts) khi chạy benchmark 3D'
                }
              ]).map((img, idx) => (
                <div key={idx} className="rma-img-card">
                  <div className="rma-img-thumb-wrap">
                    <img src={img.url} alt={img.caption} />
                  </div>
                  <div className="rma-img-caption">{img.caption}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Technician Notes */}
        {activeTab === 'notes' && (
          <div className="customer-tab-content">
            {/* New Note Form */}
            <form onSubmit={handleAddNote} className="c-note-composer">
              <div className="c-note-composer-header">
                <span><FileText size={14} /> Thêm Biên Bản Kiểm Tra Kỹ Thuật (KTV Chẩn Đoán)</span>
              </div>
              <textarea
                rows={3}
                placeholder="Ví dụ: Đã đo trở kháng nguồn cấp 12V bình thường. Test nhiệt độ FurMark đạt 68°C. Quạt quay êm không còn tiếng rè..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="c-note-composer-footer">
                <span className="c-note-hint">Ghi nhận vào hồ sơ bảo hành điện tử để lưu vết xử lý.</span>
                <button type="submit" className="btn-tail-primary" disabled={!newNote.trim()}>
                  <Send size={13} /> Lưu Biên Bản
                </button>
              </div>
            </form>

            {/* Existing Notes */}
            <div className="c-notes-list">
              {(rma.technicianNotes || [
                {
                  id: 'n-1',
                  author: 'KTV Hoàng Nam',
                  role: 'Kỹ Thuật Viên Trưởng',
                  time: '28/09/2026 14:30',
                  text: 'Đã tháo tản kiểm tra: keo tản nhiệt nguyên bản, tem ốc chưa có vết rạch. Đã tra mỡ bôi trơn bạc đạn quạt số 2. Chạy FurMark 2 tiếng nhiệt độ ổn định 67 độ C.'
                },
                {
                  id: 'n-2',
                  author: 'CSKH Thảo Ly',
                  role: 'Tư Vấn CSKH',
                  time: '26/09/2026 11:00',
                  text: 'Đã liên hệ khách hàng thông báo quy trình nhận hàng và hướng dẫn đóng gói cẩn thận chống sốc khi chuyển ViettelPost.'
                }
              ]).map((note) => (
                <div key={note.id} className="c-note-card">
                  <div className="c-note-header">
                    <div>
                      <strong className="c-note-author">{note.author}</strong>
                      <span className="c-note-role">({note.role})</span>
                    </div>
                    <span className="c-note-date"><Clock size={12} /> {note.time}</span>
                  </div>
                  <p className="c-note-text">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
