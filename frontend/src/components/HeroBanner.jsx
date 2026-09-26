import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  Gamepad2,
  Cpu,
  Monitor,
  Layers,
  Sparkles,
  Box,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  Star,
  RefreshCw,
  Flame,
  ArrowRight,
  Award
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const HERO_SLIDES = [
  {
    id: 'slide-1',
    image: '/assets/banners/hero_promo_freeship.jpg',
    badge: 'ĐẠI LỄ KHUYẾN MÃI · FREESHIP TOÀN QUỐC',
    title: 'NAT COMPUTER — SIÊU PHẨM CẤU HÌNH CỰC KHỦNG',
    desc: 'Thời gian áp dụng từ 01/09/2026 - 30/09/2026. Cam kết giá rẻ nhất thị trường, linh kiện chính hãng 100% bảo hành 36 tháng tận nơi.',
    primaryCta: { text: 'BUILD PC 3D NGAY', link: '/build', icon: Box },
    secondaryCta: { text: 'SĂN DEALS HOT', link: '/hotsale', icon: Flame },
    tagline: 'Giao hàng hỏa tốc trong 2h · Miễn phí lắp đặt'
  },
  {
    id: 'slide-2',
    image: '/assets/banners/banner_gaming_beast.jpg',
    badge: 'TOP PC GAMING QUỐC DÂN · CHIẾN MỌI TỰA GAME',
    title: 'PC GAMING GIÁ RẺ — HIỆU NĂNG ĐỈNH CAO',
    desc: 'Cấu hình tối ưu chiến mượt mà Black Myth Wukong, CS2, Valorant, Cyberpunk 2077. Sẵn hàng RTX 4060 / 4070 Super với mức giá không tưởng chỉ từ 8.990.000đ.',
    primaryCta: { text: 'XEM DÀN PC GAMING', link: '/category/pc-gaming', icon: Gamepad2 },
    secondaryCta: { text: 'NHẬN TƯ VẤN AI', link: '/ai', icon: Sparkles },
    tagline: 'Tặng kèm combo phím chuột cơ + lót chuột gaming'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80',
    badge: 'TÍNH NĂNG ĐỘT PHÁ · TRẢI NGHIỆM 3D LIVE',
    title: 'BUILD PC VỚI MÔ HÌNH 3D VÀ TƯ VẤN AI',
    desc: 'Tự tay lắp ráp cấu hình trên mô hình 3D chân thực — xoay 360°, thay đổi linh kiện, đổi màu RGB ngay trên website. Trợ lý AI kiểm tra tương thích và tối ưu ngân sách trong 30 giây.',
    primaryCta: { text: 'BUILD PC 3D NGAY', link: '/build', icon: Box },
    secondaryCta: { text: 'NHẬN TƯ VẤN AI', link: '/ai', icon: Sparkles },
    tagline: 'Mô phỏng 3D thời gian thực · Tối ưu ngân sách'
  }
];

const QUICK_CATEGORIES = [
  { label: 'PC GAMING', link: '/category/pc-gaming', icon: Gamepad2, highlight: true },
  { label: 'PC WORKSTATION 2D 3D', link: '/category/workstation', icon: Cpu },
  { label: 'PC AMD GAMING', link: '/category/pc-gaming', icon: Flame },
  { label: 'PC MINI', link: '/category/office', icon: Box },
  { label: 'PC VĂN PHÒNG', link: '/category/office', icon: Layers },
  { label: 'LINH KIỆN MÁY TÍNH', link: '/category/components', icon: Cpu },
  { label: 'MÀN HÌNH', link: '/category/monitors', icon: Monitor }
];

export default function HeroBanner() {
  const rootRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  useGSAP(() => {
    gsap.fromTo(
      '.hero-quick-cats',
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
    );
    gsap.fromTo(
      '.hero-main-carousel',
      { scale: 0.99, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
    );
    gsap.fromTo(
      '.tri-banner-card',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: rootRef });

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <section id="hero" ref={rootRef} className="hero-section-wrapper">
      <div className="wrap">
        {/* ========================================================= */}
        {/* 1. TOP QUICK CATEGORY BAR (Matches Reference Image)       */}
        {/* ========================================================= */}
        <div className="hero-quick-cats">
          {QUICK_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={cat.link}
                className={`quick-cat-btn ${cat.highlight ? 'cat-highlight' : ''}`}
              >
                <Icon size={16} className="cat-icon" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 2. MAIN PROMO HERO CAROUSEL (16:9 Big Panoramic Banner)   */}
        {/* ========================================================= */}
        <div
          className="hero-main-carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Image Container */}
          <div className="carousel-bg-container">
            <img
              src={activeSlideData.image}
              alt={activeSlideData.title}
              className="carousel-bg-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80';
              }}
            />
            <div className="carousel-dark-overlay" />
          </div>

          {/* Slide Text Content & CTAs */}
          <div className="carousel-content-layer">
            <div className="carousel-badge">
              <span className="badge-pulse" />
              <span>{activeSlideData.badge}</span>
            </div>

            <h1 className="carousel-title">
              {activeSlideData.title}
            </h1>

            <p className="carousel-desc">
              {activeSlideData.desc}
            </p>

            <div className="carousel-cta-row">
              <Link to={activeSlideData.primaryCta.link} className="btn-hero-primary hover-btn-effect">
                <activeSlideData.primaryCta.icon size={18} />
                <span>{activeSlideData.primaryCta.text}</span>
              </Link>
              <Link to={activeSlideData.secondaryCta.link} className="btn-hero-secondary hover-btn-effect">
                <activeSlideData.secondaryCta.icon size={18} />
                <span>{activeSlideData.secondaryCta.text}</span>
              </Link>
            </div>

            {/* Bottom Tagline & Trust Pillars */}
            <div className="carousel-tagline-bar">
              <div className="tagline-item">
                <Truck size={15} className="tagline-icon" />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="tagline-divider" />
              <div className="tagline-item">
                <ShieldCheck size={15} className="tagline-icon" />
                <span>Bảo hành 36 tháng 1 đổi 1</span>
              </div>
              <div className="tagline-divider" />
              <div className="tagline-item">
                <Award size={15} className="tagline-icon" />
                <span>100% Linh kiện New Full Box</span>
              </div>
            </div>
          </div>

          {/* Nav Arrows */}
          <button
            type="button"
            className="carousel-arrow prev"
            onClick={prevSlide}
            aria-label="Slide trước"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className="carousel-arrow next"
            onClick={nextSlide}
            aria-label="Slide tiếp theo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`carousel-dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. TRI-BANNER SUB GRID (3 Nổi Bật Dưới Main Banner)       */}
        {/* ========================================================= */}
        <div className="hero-tri-banner-grid">
          {/* Banner 1: PC Gaming Giá Rẻ */}
          <Link to="/category/pc-gaming" className="tri-banner-card card-gaming-deals">
            <div className="tri-card-img-wrapper">
              <img
                src="/assets/banners/banner_gaming_beast.jpg"
                alt="PC GAMING GIÁ RẺ"
                className="tri-card-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="tri-card-overlay" />
            </div>
            <div className="tri-card-content">
              <div className="tri-badge badge-red">
                <Flame size={12} /> SIÊU GIẢM GIÁ
              </div>
              <h3 className="tri-title">PC GAMING GIÁ RẺ</h3>
              <p className="tri-subtitle">Chiến mượt Wukong, CS2, Valorant, Cyberpunk</p>
              <div className="tri-footer">
                <span className="tri-price">Chỉ từ 8.990.000đ</span>
                <span className="tri-btn-arrow"><ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>

          {/* Banner 2: Ưu Điểm Shop - Chốt Máy & Lắp Đặt Tận Nhà */}
          <Link to="/build" className="tri-banner-card card-onsite-service">
            <div className="tri-card-img-wrapper">
              <img
                src="/assets/banners/banner_lap_dat_tan_nha.jpg"
                alt="CHỐT MÁY TẠI NHÀ - LẮP MÁY TẬN NƠI"
                className="tri-card-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="tri-card-overlay" />
            </div>
            <div className="tri-card-content">
              <div className="tri-badge badge-gold">
                <Star size={12} fill="#eab308" color="#eab308" /> 5-STAR SERVICE
              </div>
              <h3 className="tri-title">CHỐT MÁY & LẮP TẬN NHÀ</h3>
              <p className="tri-subtitle">Mang linh kiện tận nơi, tối ưu theo yêu cầu</p>
              <div className="tri-footer">
                <span className="tri-rating">★ 4.9/5 · 1.200+ Khách hài lòng</span>
                <span className="tri-btn-arrow"><ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>

          {/* Banner 3: Thu Cũ Đổi Mới - Lên Đời PC */}
          <Link to="/hotsale" className="tri-banner-card card-trade-in">
            <div className="tri-card-img-wrapper">
              <img
                src="/assets/banners/banner_thu_cu_doi_moi.jpg"
                alt="THU CŨ ĐỔI MỚI - LÊN ĐỜI PC"
                className="tri-card-img"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="tri-card-overlay" />
            </div>
            <div className="tri-card-content">
              <div className="tri-badge badge-blue">
                <RefreshCw size={12} /> THU CŨ ĐỔI MỚI
              </div>
              <h3 className="tri-title">THU CŨ - LÊN ĐỜI DÀN PC</h3>
              <p className="tri-subtitle">Đổi cũ lấy mới tận nhà, không cần mang vác</p>
              <div className="tri-footer">
                <span className="tri-subsidy">Trợ giá lên đến 3.000.000đ</span>
                <span className="tri-btn-arrow"><ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}