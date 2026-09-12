/* ═══════════════════════════════════════════════════════
   HARDWARE API & COMPATIBILITY ENGINE (BuildCores API Schema)
   ═══════════════════════════════════════════════════════ */

export const HARDWARE_CATEGORIES = [
  { id: 'cpu', name: 'Vi xử lý (CPU)', icon: 'Cpu' },
  { id: 'mainboard', name: 'Bo mạch chủ (Mainboard)', icon: 'Layers' },
  { id: 'vga', name: 'Card màn hình (VGA)', icon: 'Tv' },
  { id: 'ram', name: 'Bộ nhớ (RAM)', icon: 'Box' },
  { id: 'ssd', name: 'Ổ cứng (SSD NVMe)', icon: 'HardDrive' },
  { id: 'cooler', name: 'Tản nhiệt (AIO / Air)', icon: 'Wind' },
  { id: 'psu', name: 'Nguồn máy tính (PSU)', icon: 'Zap' },
  { id: 'case', name: 'Vỏ thùng máy (Case)', icon: 'Maximize2' },
];

export const HARDWARE_CATALOG = {
  cpu: [
    {
      id: 'cpu-1',
      name: 'Intel Core i9 14900K (Up to 6.0GHz, 24 Nhân 32 Luồng)',
      brand: 'Intel',
      price: 15490000,
      socket: 'LGA1700',
      tdp: 253,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
      model3d: 'cpu_14900k'
    },
    {
      id: 'cpu-2',
      name: 'Intel Core i7 14700K (Up to 5.6GHz, 20 Nhân 28 Luồng)',
      brand: 'Intel',
      price: 10890000,
      socket: 'LGA1700',
      tdp: 125,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
      model3d: 'cpu_14700k'
    },
    {
      id: 'cpu-3',
      name: 'AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8 Nhân 16 Luồng, 3D V-Cache)',
      brand: 'AMD',
      price: 10490000,
      socket: 'AM5',
      tdp: 120,
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
      model3d: 'cpu_7800x3d'
    },
  ],
  mainboard: [
    {
      id: 'mb-1',
      name: 'ASUS ROG MAXIMUS Z790 HERO DDR5',
      brand: 'ASUS',
      price: 16990000,
      socket: 'LGA1700',
      formFactor: 'ATX',
      ramType: 'DDR5',
      maxGpuLength: 400,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      model3d: 'mb_z790'
    },
    {
      id: 'mb-2',
      name: 'MSI MAG B760M MORTAR WIFI DDR5',
      brand: 'MSI',
      price: 4890000,
      socket: 'LGA1700',
      formFactor: 'Micro-ATX',
      ramType: 'DDR5',
      maxGpuLength: 350,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      model3d: 'mb_b760m'
    },
    {
      id: 'mb-3',
      name: 'GIGABYTE X670E AORUS MASTER AM5',
      brand: 'GIGABYTE',
      price: 13990000,
      socket: 'AM5',
      formFactor: 'ATX',
      ramType: 'DDR5',
      maxGpuLength: 400,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
      model3d: 'mb_x670e'
    },
  ],
  vga: [
    {
      id: 'vga-1',
      name: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB',
      brand: 'ASUS',
      price: 54990000,
      powerReq: 850,
      lengthMm: 357,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'vga_rtx4090'
    },
    {
      id: 'vga-2',
      name: 'MSI Gaming X Slim GeForce RTX 4070 Ti SUPER 16GB',
      brand: 'MSI',
      price: 24990000,
      powerReq: 750,
      lengthMm: 307,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'vga_rtx4070ti'
    },
    {
      id: 'vga-3',
      name: 'GIGABYTE GeForce RTX 4060 Ti EAGLE OC 8GB',
      brand: 'GIGABYTE',
      price: 11490000,
      powerReq: 650,
      lengthMm: 272,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'vga_rtx4060ti'
    },
  ],
  ram: [
    {
      id: 'ram-1',
      name: 'Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz',
      brand: 'Corsair',
      price: 8990000,
      type: 'DDR5',
      capacityGb: 64,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
      model3d: 'ram_dominator'
    },
    {
      id: 'ram-2',
      name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 5600MHz',
      brand: 'G.Skill',
      price: 3690000,
      type: 'DDR5',
      capacityGb: 32,
      image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
      model3d: 'ram_tridentz'
    },
  ],
  ssd: [
    {
      id: 'ssd-1',
      name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 SSD (Read 7450MB/s)',
      brand: 'Samsung',
      price: 4890000,
      capacityGb: 2000,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
      model3d: 'ssd_990pro'
    },
    {
      id: 'ssd-2',
      name: 'Kingston Fury Renegade 1TB NVMe PCIe 4.0 SSD',
      brand: 'Kingston',
      price: 2490000,
      capacityGb: 1000,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
      model3d: 'ssd_renegade'
    },
  ],
  cooler: [
    {
      id: 'cooler-1',
      name: 'NZXT Kraken Elite 360 RGB LCD AIO Cooler White',
      brand: 'NZXT',
      price: 7890000,
      type: 'AIO 360mm',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'cooler_kraken'
    },
    {
      id: 'cooler-2',
      name: 'DeepCool Thermalight Peerless Assassin 120 SE Air Cooler',
      brand: 'DeepCool',
      price: 990000,
      type: 'Air Cooler',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'cooler_deepcool'
    },
  ],
  psu: [
    {
      id: 'psu-1',
      name: 'Corsair RM1000x Shift 1000W 80 Plus Gold Fully Modular',
      brand: 'Corsair',
      price: 4990000,
      wattage: 1000,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
      model3d: 'psu_1000w'
    },
    {
      id: 'psu-2',
      name: 'MSI MAG A850GL PCIE5 850W 80 Plus Gold ATX 3.0',
      brand: 'MSI',
      price: 3190000,
      wattage: 850,
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=400&q=80',
      model3d: 'psu_850w'
    },
  ],
  case: [
    {
      id: 'case-1',
      name: 'LIAN LI O11 Dynamic EVO XL Black Dual Chamber Glass Case',
      brand: 'Lian Li',
      price: 6490000,
      supportedForm: ['ATX', 'Micro-ATX', 'E-ATX'],
      maxGpuLengthMm: 460,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'case_o11d'
    },
    {
      id: 'case-2',
      name: 'NZXT H9 Flow Dual-Chamber Mid-Tower Glass Case White',
      brand: 'NZXT',
      price: 4290000,
      supportedForm: ['ATX', 'Micro-ATX'],
      maxGpuLengthMm: 435,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
      model3d: 'case_h9flow'
    },
  ],
};

/* Compatibility Engine logic */
export function checkCompatibility(parts = {}) {
  const issues = [];
  const warnings = [];

  const { cpu, mainboard, vga, psu, case: chassis } = parts;

  // 1. Socket Check
  if (cpu && mainboard && cpu.socket !== mainboard.socket) {
    issues.push(`Lỗi Socket: Vi xử lý ${cpu.name} (${cpu.socket}) không tương thích với Bo mạch chủ ${mainboard.name} (${mainboard.socket}).`);
  }

  // 2. Power Consumption vs PSU Wattage
  const totalTdp = (cpu?.tdp || 0) + (vga ? 320 : 0) + 100;
  const psuCapacity = psu?.wattage || 0;
  const recommendedPsu = Math.max(vga?.powerReq || 0, totalTdp + 150);

  if (psu && psuCapacity < recommendedPsu) {
    warnings.push(`Cảnh báo nguồn: Bộ nguồn ${psu.name} (${psuCapacity}W) có thể thiếu điện năng. Công suất khuyến nghị là từ ${recommendedPsu}W trở lên.`);
  }

  // 3. GPU Length vs Case Clearance
  if (vga && chassis && vga.lengthMm && chassis.maxGpuLengthMm && vga.lengthMm > chassis.maxGpuLengthMm) {
    issues.push(`Lỗi kích thước: Card màn hình ${vga.name} dài ${vga.lengthMm}mm vượt quá chiều dài cho phép của Thùng máy ${chassis.name} (${chassis.maxGpuLengthMm}mm).`);
  }

  return {
    isCompatible: issues.length === 0,
    issues,
    warnings,
    totalTdp,
    recommendedPsu,
  };
}
