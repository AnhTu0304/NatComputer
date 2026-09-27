import React, { useState, useMemo } from 'react';
import {
  Plus,
  Upload,
  Download,
  Search,
  X,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Archive,
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import ProductDetailDrawer from './ProductDetailDrawer';

export default function ProductsView({
  products = [],
  categories = [],
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Published' | 'Draft' | 'Out of Stock' | 'Archived'
  const [priceRangeFilter, setPriceRangeFilter] = useState('all'); // 'all' | 'under5' | '5to15' | '15to30' | 'above30'
  const [sortField, setSortField] = useState('updated'); // 'name' | 'price' | 'stock' | 'sold' | 'updated'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selection & Bulk Action States
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedProductForDrawer, setSelectedProductForDrawer] = useState(null);

  // Available brands derived from products or predefined hardware makers
  const availableBrands = ['ASUS', 'MSI', 'Gigabyte', 'Intel', 'AMD', 'Corsair', 'Samsung', 'Kingston', 'NZXT', 'Lian Li'];

  // Normalize products with simulated or real values
  const normalizedProducts = useMemo(() => {
    return products.map((p, idx) => {
      // Determine brand if missing
      let brand = p.brand;
      if (!brand) {
        const lower = (p.name || '').toLowerCase();
        if (lower.includes('asus') || lower.includes('rog')) brand = 'ASUS';
        else if (lower.includes('msi')) brand = 'MSI';
        else if (lower.includes('intel') || lower.includes('core')) brand = 'Intel';
        else if (lower.includes('amd') || lower.includes('ryzen')) brand = 'AMD';
        else if (lower.includes('corsair')) brand = 'Corsair';
        else if (lower.includes('samsung')) brand = 'Samsung';
        else if (lower.includes('kingston')) brand = 'Kingston';
        else if (lower.includes('gigabyte') || lower.includes('aorus')) brand = 'Gigabyte';
        else brand = availableBrands[idx % availableBrands.length];
      }

      // Stock
      const stock = p.stock !== undefined ? p.stock : (idx % 8 === 0 ? 0 : (idx % 4 === 0 ? 3 : 14 - (idx % 7)));
      
      // Status
      let status = p.status;
      if (!status) {
        if (stock === 0) status = 'Out of Stock';
        else if (idx % 11 === 0) status = 'Draft';
        else if (idx % 17 === 0) status = 'Archived';
        else status = 'Published';
      }

      const sku = p.sku || `SKU-NAT-${p.id ? String(p.id).slice(-4).toUpperCase() : 1000 + idx}`;
      const sold = p.sold !== undefined ? p.sold : (idx * 5 + 8);
      const updated = p.updatedAt || p.createdAt || '2026-09-26';

      return {
        ...p,
        sku,
        brand,
        stock,
        status,
        sold,
        updated
      };
    });
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchSku = (p.sku || '').toLowerCase().includes(q);
        const matchBrand = (p.brand || '').toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Category
      if (selectedCategory !== 'all') {
        const catMatch = (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Brand
      if (selectedBrand !== 'all') {
        if (p.brand !== selectedBrand) return false;
      }

      // Stock status
      if (stockFilter === 'in_stock' && p.stock <= 5) return false;
      if (stockFilter === 'low_stock' && (p.stock <= 0 || p.stock > 5)) return false;
      if (stockFilter === 'out_of_stock' && p.stock > 0) return false;

      // Product status
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      // Price range
      if (priceRangeFilter === 'under5' && p.price >= 5000000) return false;
      if (priceRangeFilter === '5to15' && (p.price < 5000000 || p.price > 15000000)) return false;
      if (priceRangeFilter === '15to30' && (p.price < 15000000 || p.price > 30000000)) return false;
      if (priceRangeFilter === 'above30' && p.price <= 30000000) return false;

      return true;
    });
  }, [normalizedProducts, searchQuery, selectedCategory, selectedBrand, stockFilter, statusFilter, priceRangeFilter]);

  // Sorting Logic
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'name') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (sortField === 'price' || sortField === 'stock' || sortField === 'sold') {
        return sortDirection === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
      }
      if (sortField === 'updated') {
        return sortDirection === 'asc' ? new Date(valA) - new Date(valB) : new Date(valB) - new Date(valA);
      }
      return 0;
    });
  }, [filteredProducts, sortField, sortDirection]);

  // Pagination Logic
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedProducts.slice(startIndex, startIndex + pageSize);
  }, [sortedProducts, currentPage, pageSize]);

  // Handle Header Column Sort Click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Selection Handlers
  const handleSelectAllOnPage = () => {
    const pageIds = paginatedProducts.map(p => p.id);
    const allSelected = pageIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkAction = (actionType) => {
    if (selectedIds.length === 0) return;
    switch (actionType) {
      case 'publish':
        alert(`Đã xuất bản (Publish) ${selectedIds.length} sản phẩm thành công.`);
        break;
      case 'unpublish':
        alert(`Đã chuyển ${selectedIds.length} sản phẩm về trạng thái Nháp (Draft).`);
        break;
      case 'delete':
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm đã chọn?`)) {
          selectedIds.forEach(id => {
            if (onDeleteProduct) onDeleteProduct(id);
          });
          setSelectedIds([]);
        }
        break;
      case 'change-category':
        const newCat = prompt('Nhập mã danh mục mới (gaming, workstation, office, components...):');
        if (newCat) alert(`Đã chuyển ${selectedIds.length} sản phẩm sang danh mục: ${newCat}`);
        break;
      case 'update-stock':
        const newStock = prompt('Nhập số lượng tồn kho mới cho các sản phẩm đã chọn:');
        if (newStock) alert(`Đã cập nhật số lượng tồn kho ${newStock} cái cho ${selectedIds.length} sản phẩm.`);
        break;
      case 'update-price':
        const percent = prompt('Nhập % điều chỉnh giá (+10 hoặc -10%):');
        if (percent) alert(`Đã cập nhật giá ${percent}% cho ${selectedIds.length} sản phẩm.`);
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setStockFilter('all');
    setStatusFilter('all');
    setPriceRangeFilter('all');
    setCurrentPage(1);
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="stock-pill stock-out" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} /> Hết hàng (0)
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="stock-pill stock-low" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} /> Sắp hết ({stock})
        </span>
      );
    }
    return (
      <span className="stock-pill stock-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Còn {stock}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="tail-badge badge-success"><CheckCircle2 size={11} style={{ display: 'inline', marginRight: 2 }} /> Published</span>;
      case 'Draft':
        return <span className="tail-badge badge-secondary"><Clock size={11} style={{ display: 'inline', marginRight: 2 }} /> Draft</span>;
      case 'Out of Stock':
        return <span className="tail-badge badge-danger"><AlertTriangle size={11} style={{ display: 'inline', marginRight: 2 }} /> Out of Stock</span>;
      case 'Archived':
        return <span className="tail-badge badge-warning"><Archive size={11} style={{ display: 'inline', marginRight: 2 }} /> Archived</span>;
      default:
        return <span className="tail-badge badge-success">Published</span>;
    }
  };

  const isAllPageSelected = paginatedProducts.length > 0 && paginatedProducts.every(p => selectedIds.includes(p.id));

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* =================================================================== */}
      {/* 1. PAGE HEADER                                                      */}
      {/* =================================================================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Products
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
            Manage your PC components and products
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Add Product Button */}
          <button
            type="button"
            onClick={onAddNewProduct}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
            }}
          >
            <Plus size={15} /> Add Product
          </button>

          {/* Import Products */}
          <button
            type="button"
            onClick={() => alert('Chức năng nhập file danh mục sản phẩm (Excel/CSV) sẵn sàng.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Upload size={14} color="#4f46e5" /> Import Products
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={() => alert('Xuất toàn bộ danh sách sản phẩm ra file Excel thành công.')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Download size={14} color="#4f46e5" /> Export
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. ADVANCED FILTER BAR                                              */}
      {/* =================================================================== */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 260px', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search product name, SKU, brand..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%',
                padding: '9px 36px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                fontSize: 13,
                outline: 'none',
                background: '#f8fafc'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Category: All ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug || c.id}>{c.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setCurrentPage(1); }}
            style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Brand: All</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Stock Status */}
          <select
            value={stockFilter}
            onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Stock: All</option>
            <option value="in_stock">In Stock (&gt; 5)</option>
            <option value="low_stock">Low Stock (1-5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Product Status */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Status: All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Price Range */}
          <select
            value={priceRangeFilter}
            onChange={(e) => { setPriceRangeFilter(e.target.value); setCurrentPage(1); }}
            style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 13, background: '#fff', cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">Price: All</option>
            <option value="under5">&lt; 5 Triệu</option>
            <option value="5to15">5M - 15 Triệu</option>
            <option value="15to30">15M - 30 Triệu</option>
            <option value="above30">&gt; 30 Triệu</option>
          </select>

          {/* Reset Filters Button */}
          {(searchQuery || selectedCategory !== 'all' || selectedBrand !== 'all' || stockFilter !== 'all' || statusFilter !== 'all' || priceRangeFilter !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              style={{
                background: '#fee2e2',
                color: '#ef4444',
                border: '1px solid #fecaca',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. BULK ACTIONS FLOATING BAR (ACTIVATED WHEN >= 1 CHECKED)           */}
      {/* =================================================================== */}
      {selectedIds.length > 0 && (
        <div
          style={{
            background: '#1e293b',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#4f46e5', padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
              {selectedIds.length}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>sản phẩm đã được chọn</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleBulkAction('publish')}
              style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('unpublish')}
              style={{ background: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('change-category')}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Change Category
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('update-stock')}
              style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Update Stock
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('update-price')}
              style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Update Price
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('delete')}
              style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. HIGH-DENSITY PRODUCT DATA TABLE                                  */}
      {/* =================================================================== */}
      <div className="tail-table-container" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {/* Select All Checkbox */}
              <th style={{ padding: '12px 14px', width: 40 }}>
                <input
                  type="checkbox"
                  checked={isAllPageSelected}
                  onChange={handleSelectAllOnPage}
                  style={{ cursor: 'pointer', width: 16, height: 16 }}
                />
              </th>
              <th style={{ padding: '12px' }}>HÌNH ẢNH</th>
              <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  TÊN SẢN PHẨM {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '12px' }}>MÃ SKU</th>
              <th style={{ padding: '12px' }}>BRAND</th>
              <th style={{ padding: '12px' }}>CATEGORY</th>
              <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('price')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  GIÁ BÁN {sortField === 'price' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('stock')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  STOCK {sortField === 'stock' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('sold')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  SOLD {sortField === 'sold' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '12px' }}>STATUS</th>
              <th style={{ padding: '12px', cursor: 'pointer' }} onClick={() => handleSort('updated')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  UPDATED {sortField === 'updated' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                    🔍 Không tìm thấy sản phẩm nào phù hợp với bộ lọc
                  </div>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px' }}>
                    Thử tìm với từ khóa khác hoặc bấm nút "Reset Filters" để tải lại danh sách.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Reset All Filters
                  </button>
                </td>
              </tr>
            ) : (
              paginatedProducts.map(p => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isSelected ? '#f8faff' : '#ffffff',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Row Checkbox */}
                    <td style={{ padding: '12px 14px' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(p.id)}
                        style={{ cursor: 'pointer', width: 16, height: 16 }}
                      />
                    </td>

                    {/* Image */}
                    <td style={{ padding: '12px' }}>
                      <img
                        src={p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100&q=80'}
                        alt={p.name}
                        onClick={() => setSelectedProductForDrawer(p)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer'
                        }}
                      />
                    </td>

                    {/* Name */}
                    <td style={{ padding: '12px' }}>
                      <div
                        onClick={() => setSelectedProductForDrawer(p)}
                        style={{
                          fontWeight: 600,
                          color: '#0f172a',
                          maxWidth: 240,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer'
                        }}
                        title={p.name}
                      >
                        {p.name}
                      </div>
                    </td>

                    {/* SKU */}
                    <td style={{ padding: '12px' }}>
                      <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>
                        {p.sku}
                      </code>
                    </td>

                    {/* Brand */}
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>
                        {p.brand}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px' }}>
                      <span className="badge-category-tag" style={{ fontSize: 11 }}>
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                      {currencyFormatter(p.price)}
                    </td>

                    {/* Stock Indicator */}
                    <td style={{ padding: '12px' }}>
                      {getStockBadge(p.stock)}
                    </td>

                    {/* Sold */}
                    <td style={{ padding: '12px', color: '#475569', fontWeight: 600 }}>
                      {p.sold}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(p.status)}
                    </td>

                    {/* Updated */}
                    <td style={{ padding: '12px', color: '#64748b', fontSize: 12 }}>
                      {p.updated ? String(p.updated).slice(0, 10) : '2026-09-26'}
                    </td>

                    {/* Action buttons */}
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setSelectedProductForDrawer(p)}
                          title="Xem chi tiết nhanh"
                          style={{
                            padding: '4px 8px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#475569'
                          }}
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditProduct && onEditProduct(p)}
                          title="Chỉnh sửa sản phẩm"
                          style={{
                            padding: '4px 8px',
                            background: '#eef2ff',
                            border: '1px solid #c7d2fe',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#4f46e5'
                          }}
                        >
                          <Edit size={13} />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteProduct && onDeleteProduct(p.id)}
                          title="Xóa sản phẩm"
                          style={{
                            padding: '4px 8px',
                            background: '#fee2e2',
                            border: '1px solid #fecaca',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#ef4444'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =================================================================== */}
      {/* 5. PAGINATION & ROWS-PER-PAGE TOOLBAR                                */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          padding: '8px 4px',
          fontSize: 13,
          color: '#64748b'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>
            Hiển thị <strong>{paginatedProducts.length}</strong> / <strong>{totalItems}</strong> sản phẩm
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Số dòng/trang:</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12, cursor: 'pointer' }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Page Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: currentPage <= 1 ? '#f8fafc' : '#ffffff',
              color: currentPage <= 1 ? '#cbd5e1' : '#334155',
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={14} style={{ display: 'inline' }} /> Trước
          </button>

          <span style={{ padding: '0 8px', fontWeight: 600, color: '#0f172a' }}>
            Trang {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: currentPage >= totalPages ? '#f8fafc' : '#ffffff',
              color: currentPage >= totalPages ? '#cbd5e1' : '#334155',
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Sau <ChevronRight size={14} style={{ display: 'inline' }} />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 6. RIGHT-SIDE PRODUCT DETAIL SLIDE-OVER DRAWER                      */}
      {/* =================================================================== */}
      <ProductDetailDrawer
        isOpen={Boolean(selectedProductForDrawer)}
        product={selectedProductForDrawer}
        onClose={() => setSelectedProductForDrawer(null)}
        onEdit={(prod) => {
          setSelectedProductForDrawer(null);
          if (onEditProduct) onEditProduct(prod);
        }}
        currencyFormatter={currencyFormatter}
      />
    </div>
  );
}
