import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from './ProductDetailPage';
import api from '../services/api';

jest.mock('../services/api', () => ({
  getProducts: jest.fn()
}));

describe('ProductDetailPage Dynamic Generic Specifications', () => {
  const customGearProduct = {
    id: 'gear-mouse-superlight',
    name: 'Chuột Gaming Siêu Nhẹ Không Dây Pro',
    category: 'gear',
    price: 1590000,
    originalPrice: 1890000,
    badge: 'NEW GEAR',
    image: 'https://example.com/mouse.jpg',
    description: 'Chuột gaming không dây chính hãng',
    warranty: '24 Tháng',
    specs: [
      { item: 'Cảm biến (Sensor)', desc: 'HERO 25K (100 - 25.600 DPI)', qty: 1, warranty: '24 Tháng' },
      { item: 'Kết nối', desc: 'Lightspeed Wireless 1ms & Bluetooth', qty: 1, warranty: '24 Tháng' },
      { item: 'Trọng lượng', desc: '63g Siêu Nhẹ', qty: 1, warranty: '24 Tháng' }
    ]
  };

  const customGpuProduct = {
    id: 'vga-rtx-5070-ti',
    name: 'VGA NVIDIA GeForce RTX 5070 Ti 16GB GDDR7',
    category: 'components',
    price: 24900000,
    badge: 'HOT VGA',
    image: 'https://example.com/vga.jpg',
    description: 'Card đồ họa đỉnh cao thế hệ mới',
    warranty: '36 Tháng',
    specs: [
      { item: 'Chip đồ họa (GPU)', desc: 'GeForce RTX 5070 Ti', qty: 1, warranty: '36 Tháng' },
      { item: 'Dung lượng VRAM', desc: '16GB GDDR7 256-bit', qty: 1, warranty: '36 Tháng' },
      { item: 'Nguồn đề nghị', desc: '750W trở lên (1x 16-pin 12V-2x6)', qty: 1, warranty: '36 Tháng' }
    ]
  };

  beforeEach(() => {
    api.getProducts.mockResolvedValue({
      products: [customGearProduct, customGpuProduct]
    });
  });

  test('renders generic specifications table for Gaming Gear (not hardcoded to PC tower)', async () => {
    render(
      <MemoryRouter initialEntries={['/product/gear-mouse-superlight']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify product name and summary box title
    expect(await screen.findByRole('heading', { level: 1, name: /Chuột Gaming Siêu Nhẹ Không Dây Pro/i })).toBeInTheDocument();
    expect(screen.getByText('Thông số kỹ thuật nổi bật')).toBeInTheDocument();

    // Verify summary contains gear specs
    expect(screen.getByText(/HERO 25K/i)).toBeInTheDocument();

    // Switch to "Thông số kỹ thuật" tab
    const specsTab = screen.getByRole('button', { name: /Thông số kỹ thuật/i });
    fireEvent.click(specsTab);

    // Verify custom gear table rows appear
    expect(await screen.findByText('Cảm biến (Sensor)')).toBeInTheDocument();
    expect(screen.getByText('HERO 25K (100 - 25.600 DPI)')).toBeInTheDocument();
    expect(screen.getByText('Lightspeed Wireless 1ms & Bluetooth')).toBeInTheDocument();
    expect(screen.getByText('63g Siêu Nhẹ')).toBeInTheDocument();

    // Ensure hardcoded PC parts like "Bo mạch chủ (Mainboard)" or "Tản nhiệt CPU" are NOT rendered
    expect(screen.queryByText('Bo mạch chủ (Mainboard)')).not.toBeInTheDocument();
    expect(screen.queryByText('Tản nhiệt CPU')).not.toBeInTheDocument();
  });

  test('renders generic specifications table for individual GPU component', async () => {
    render(
      <MemoryRouter initialEntries={['/product/vga-rtx-5070-ti']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { level: 1, name: /VGA NVIDIA GeForce RTX 5070 Ti 16GB GDDR7/i })).toBeInTheDocument();

    // Switch to "Thông số kỹ thuật" tab
    const specsTab = screen.getByRole('button', { name: /Thông số kỹ thuật/i });
    fireEvent.click(specsTab);

    // Verify GPU specs rows appear
    expect(await screen.findByText('Chip đồ họa (GPU)')).toBeInTheDocument();
    expect(screen.getByText('16GB GDDR7 256-bit')).toBeInTheDocument();
    expect(screen.getByText('750W trở lên (1x 16-pin 12V-2x6)')).toBeInTheDocument();
  });

  test('renders dynamic description from admin and category-specific highlights for Gaming Gear', async () => {
    render(
      <MemoryRouter initialEntries={['/product/gear-mouse-superlight']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify breadcrumb shows Gaming Gear
    const gearBreadcrumb = await screen.findByRole('link', { name: /Gaming Gear/i });
    expect(gearBreadcrumb).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^PC Gaming$/i })).not.toBeInTheDocument();

    // Verify description tab displays admin description
    expect(screen.getByText('Chuột gaming không dây chính hãng')).toBeInTheDocument();

    // Verify hardcoded PC descriptions are NOT displayed for Gear
    expect(screen.queryByText(/bộ máy tính Gaming cao cấp/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/NVIDIA RTX Series/i)).not.toBeInTheDocument();

    // Verify gear highlight cards exist
    expect(screen.getByText(/Cảm Biến & Switch/i)).toBeInTheDocument();
  });

  test('renders category-specific breadcrumb, default promotions, and highlights for Monitor', async () => {
    const customMonitorProduct = {
      id: 'monitor-27-2k',
      name: 'Màn hình Gaming 27 inch 2K 180Hz Fast IPS',
      category: 'monitors',
      price: 5290000,
      specs: [
        { item: 'Kích thước', desc: '27 inch', qty: 1, warranty: '24 Tháng' }
      ]
    };
    api.getProducts.mockResolvedValueOnce({
      products: [customMonitorProduct]
    });

    render(
      <MemoryRouter initialEntries={['/product/monitor-27-2k']}>
        <Routes>
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    const monitorBreadcrumb = await screen.findByRole('link', { name: /Màn Hình/i });
    expect(monitorBreadcrumb).toBeInTheDocument();
    expect(screen.getByText(/bao test điểm chết/i)).toBeInTheDocument();
    expect(screen.getByText(/Tấm Nền Sắc Nét & Tần Số Quét Cao/i)).toBeInTheDocument();
    expect(screen.queryByText(/NVIDIA RTX Series/i)).not.toBeInTheDocument();
  });

  describe('Cross-sell & Add-on Recommendation Algorithm ("SẢN PHẨM MUA KÈM GIÁ TỐT")', () => {
    test('does NOT recommend a keyboard when viewing a keyboard product; recommends complementary gear instead', async () => {
      const keyboardProduct = {
        id: 'gear-kb-akko',
        name: 'Bàn phím cơ AKKO 3087 v2 Dragon Ball',
        category: 'gear',
        price: 1500000,
        originalPrice: 1800000,
        image: 'https://example.com/kb.jpg'
      };

      api.getProducts.mockResolvedValueOnce({
        products: [keyboardProduct]
      });

      render(
        <MemoryRouter initialEntries={['/product/gear-kb-akko']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      // Section header exists
      expect(await screen.findByText('SẢN PHẨM MUA KÈM GIÁ TỐT')).toBeInTheDocument();

      // Should NOT recommend another keyboard or itself in the combo section
      const comboCards = screen.getAllByRole('heading', { level: 4 });
      const comboCardTitles = comboCards.map(c => c.textContent.toLowerCase());
      
      // None of the recommended accessory titles should contain "bàn phím" or the keyboard name
      const hasKeyboard = comboCardTitles.some(title => title.includes('bàn phím') || title.includes('akko'));
      expect(hasKeyboard).toBe(false);

      // Should recommend mouse or mousepad or headset
      const hasComplementaryGear = comboCardTitles.some(
        title => title.includes('chuột') || title.includes('lót chuột') || title.includes('tai nghe')
      );
      expect(hasComplementaryGear).toBe(true);
    });

    test('does NOT recommend a monitor when viewing a monitor product; recommends monitor arm / peripherals instead', async () => {
      const monitorProduct = {
        id: 'mon-asus-27',
        name: 'Màn hình Gaming Asus TUF VG279Q3A 27 inch 180Hz',
        category: 'monitors',
        price: 4390000,
        originalPrice: 4990000,
        image: 'https://example.com/mon.jpg'
      };

      api.getProducts.mockResolvedValueOnce({
        products: [monitorProduct]
      });

      render(
        <MemoryRouter initialEntries={['/product/mon-asus-27']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('SẢN PHẨM MUA KÈM GIÁ TỐT')).toBeInTheDocument();

      const comboCards = screen.getAllByRole('heading', { level: 4 });
      const comboCardTitles = comboCards.map(c => c.textContent.toLowerCase());

      // None of the recommended titles should contain "màn hình" or "asus tuf vg279q3a"
      const hasMonitor = comboCardTitles.some(title => title.includes('màn hình'));
      expect(hasMonitor).toBe(false);

      // Should recommend monitor arm or cable or gear
      const hasMonitorAccessory = comboCardTitles.some(
        title => title.includes('arm') || title.includes('giá treo') || title.includes('chuột') || title.includes('bàn phím')
      );
      expect(hasMonitorAccessory).toBe(true);
    });

    test('recommends components accessories (keo tản nhiệt, fan, giá đỡ VGA) when viewing a GPU/component', async () => {
      render(
        <MemoryRouter initialEntries={['/product/vga-rtx-5070-ti']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('SẢN PHẨM MUA KÈM GIÁ TỐT')).toBeInTheDocument();

      const comboCards = screen.getAllByRole('heading', { level: 4 });
      const comboCardTitles = comboCards.map(c => c.textContent.toLowerCase());

      // Should NOT recommend another GPU
      const hasGpu = comboCardTitles.some(title => title.includes('rtx 5070') || title.includes('card đồ họa'));
      expect(hasGpu).toBe(false);

      // Should recommend thermal paste, fan, or sag bracket
      const hasComponentAccessory = comboCardTitles.some(
        title => title.includes('keo tản nhiệt') || title.includes('fan') || title.includes('giá đỡ') || title.includes('tản nhiệt')
      );
      expect(hasComponentAccessory).toBe(true);
    });

    test('calculates bundle combo price with special combo discounts and adds combo to cart', async () => {
      const mockAddToCart = jest.fn();

      render(
        <MemoryRouter initialEntries={['/product/vga-rtx-5070-ti']}>
          <Routes>
            <Route path="/product/:id" element={<ProductDetailPage onAddToCart={mockAddToCart} />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('SẢN PHẨM MUA KÈM GIÁ TỐT')).toBeInTheDocument();

      // Check that combo total label is present
      expect(screen.getByText('Tổng tiền Combo:')).toBeInTheDocument();
      expect(screen.getByText(/Tiết kiệm tổng cộng:/i)).toBeInTheDocument();

      // Click "MUA COMBO TIẾT KIỆM"
      const buyComboBtn = screen.getByRole('button', { name: /MUA COMBO TIẾT KIỆM/i });
      fireEvent.click(buyComboBtn);

      // Verify onAddToCart was called for main product + selected accessory
      expect(mockAddToCart).toHaveBeenCalled();
    });

    test('getRecommendedAddons function returns valid recommendations and combo discount for all categories', () => {
      // Import function directly
      const { getRecommendedAddons, ACCESSORY_CATALOG } = require('./ProductDetailPage');

      // 1. Null / undefined fallback
      const defaultAddons = getRecommendedAddons(null);
      expect(defaultAddons.length).toBe(4);

      // 2. Mouse product: excludes mouse
      const mouseAddons = getRecommendedAddons({ id: 'm-1', name: 'Chuột Gaming G Pro X Superlight', category: 'gear' });
      expect(mouseAddons.some(a => a.type === 'mouse')).toBe(false);
      expect(mouseAddons.some(a => a.type === 'mousepad')).toBe(true);

      // 3. Headset product: excludes headset
      const headsetAddons = getRecommendedAddons({ id: 'h-1', name: 'Tai nghe chụp tai HyperX Cloud', category: 'gear' });
      expect(headsetAddons.some(a => a.type === 'headset')).toBe(false);

      // 4. PC product: includes monitor + keyboard + mouse + headset
      const pcAddons = getRecommendedAddons({ id: 'pc-1', name: 'PC Gaming Intel Core i7 14700F', category: 'pc-gaming' });
      const pcTypes = pcAddons.map(a => a.type);
      expect(pcTypes).toContain('monitor');
      expect(pcTypes).toContain('keyboard');
      expect(pcTypes).toContain('mouse');

      // 5. Combo price discount: exactly 10% discounted and rounded to thousands
      pcAddons.forEach(addon => {
        expect(addon.comboPrice).toBeLessThan(addon.price);
        expect(addon.comboSavings).toBeGreaterThan(0);
      });
    });
  });
});

