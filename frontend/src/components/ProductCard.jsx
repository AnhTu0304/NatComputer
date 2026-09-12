import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

function ProductCard({ item, onAddToCart, onMouseEnterCard, onMouseLeaveCard }) {
  const navigate = useNavigate();

  const hasOrig = item.originalPrice && item.originalPrice > item.price;
  const disc = hasOrig ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
  const fmt = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const handleCardClick = () => {
    navigate(`/product/${item.id}`);
  };

  return (
    <div
      className="carousel-card"
      onMouseEnter={() => onMouseEnterCard?.(item)}
      onMouseLeave={() => onMouseLeaveCard?.()}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="carousel-card-img">
        <img src={item.image} alt={item.name} loading="lazy" />
        {item.badge && <span className="carousel-card-badge">{item.badge}</span>}
      </div>

      {/* Body */}
      <div className="carousel-card-body">
        <h3 className="carousel-card-title" title={item.name}>
          {item.name}
        </h3>

        <div className="carousel-card-price-area">
          <div className="price-primary-row">
            <span className="price-current">{fmt(item.price)}</span>
            {hasOrig && <span className="discount-badge">{item.discount || `-${disc}%`}</span>}
          </div>
          {hasOrig && <div className="price-original">{fmt(item.originalPrice)}</div>}
        </div>

        <div className="carousel-card-footer">
          <button
            type="button"
            className="btn-add-to-cart"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(item);
            }}
          >
            <ShoppingCart size={14} />
            THÊM VÀO GIỎ
          </button>
          <span className="stock-status-pill">Còn hàng</span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
