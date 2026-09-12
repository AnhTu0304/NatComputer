import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import HotDealsSection from '../components/HotDealsSection';
import CategoryCarousel from '../components/CategoryCarousel';
import CommitmentSection from '../components/CommitmentSection';
import ShowroomSection from '../components/ShowroomSection';
import { GAMING_PCS, OFFICE_PCS, COMPONENTS, MONITORS } from '../data/catalogData';
import api from '../services/api';

export default function HomePage({ onAddToCart }) {
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProducts().then(res => {
      if (isMounted && res && res.products && res.products.length > 0) {
        setLiveProducts(res.products);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const hotDealsItems = liveProducts.filter(p => p.badge?.includes('DEAL') || p.badge?.includes('HOT') || p.category === 'hot-deals').length > 0
    ? liveProducts.filter(p => p.badge?.includes('DEAL') || p.badge?.includes('HOT') || p.category === 'hot-deals')
    : undefined;

  const gamingItems = liveProducts.filter(p => p.category === 'gaming' || p.category === 'pc-gaming' || p.category === 'workstation').length > 0
    ? liveProducts.filter(p => p.category === 'gaming' || p.category === 'pc-gaming' || p.category === 'workstation')
    : GAMING_PCS;

  const officeItems = liveProducts.filter(p => p.category === 'office' || p.category === 'pc-office').length > 0
    ? liveProducts.filter(p => p.category === 'office' || p.category === 'pc-office')
    : OFFICE_PCS;

  const componentItems = liveProducts.filter(p => p.category === 'components' || p.category === 'linh-kien').length > 0
    ? liveProducts.filter(p => p.category === 'components' || p.category === 'linh-kien')
    : COMPONENTS;

  const monitorItems = liveProducts.filter(p => p.category === 'monitors' || p.category === 'man-hinh').length > 0
    ? liveProducts.filter(p => p.category === 'monitors' || p.category === 'man-hinh')
    : MONITORS;

  return (
    <main>
      <HeroBanner />

      <div className="home-body">
        <HotDealsSection
          items={hotDealsItems}
          onAddToCart={onAddToCart}
        />
        <CategoryCarousel
          id="pc-gaming"
          eyebrow="— PC GAMING"
          title="PC GAMING"
          description="Cấu hình chơi game đỉnh cao cho mọi tựa game nặng nhất."
          items={gamingItems}
          onAddToCart={onAddToCart}
        />

        <CategoryCarousel
          id="pc-office"
          eyebrow="— PC VĂN PHÒNG"
          title="PC VĂN PHÒNG"
          description="Làm việc hiệu quả với máy ổn định, tiết kiệm điện và bền bỉ."
          items={officeItems}
          onAddToCart={onAddToCart}
        />

        <CategoryCarousel
          id="components"
          eyebrow="— LINH KIỆN MÁY TÍNH"
          title="LINH KIỆN MÁY TÍNH"
          description="Tự build cấu hình với các linh kiện nhập khẩu chính hãng."
          items={componentItems}
          onAddToCart={onAddToCart}
        />

        <CategoryCarousel
          id="monitors"
          eyebrow="— MÀN HÌNH MÁY TÍNH"
          title="MÀN HÌNH MÁY TÍNH"
          description="Trải nghiệm hình ảnh sắc nét với các dòng màn hình cao cấp."
          items={monitorItems}
          onAddToCart={onAddToCart}
        />

        <CommitmentSection />
        <ShowroomSection />
      </div>
    </main>
  );
}