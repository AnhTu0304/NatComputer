/**
 * Cas AddressKit API Service (Vietnam Administrative Units)
 * Fetches standardized Provinces and Communes/Districts from Cục Thống Kê
 */

const BASE_URL = 'https://production.cas.so/address-kit';

// Memory cache to avoid redundant API requests during a single session
const cache = {
  provinces: null,
  communesByProvince: {}
};

// Resilient Fallback Provinces if API is temporarily unreachable or offline
const FALLBACK_PROVINCES = [
  { code: '01', name: 'Thành phố Hà Nội' },
  { code: '79', name: 'Thành phố Hồ Chí Minh' },
  { code: '48', name: 'Thành phố Đà Nẵng' },
  { code: '31', name: 'Thành phố Hải Phòng' },
  { code: '92', name: 'Thành phố Cần Thơ' },
  { code: '46', name: 'Thành phố Huế' },
  { code: '24', name: 'Tỉnh Bắc Ninh' },
  { code: '22', name: 'Tỉnh Quảng Ninh' },
  { code: '75', name: 'Tỉnh Đồng Nai' },
  { code: '68', name: 'Tỉnh Lâm Đồng' },
  { code: '56', name: 'Tỉnh Khánh Hòa' },
  { code: '38', name: 'Tỉnh Thanh Hóa' },
  { code: '40', name: 'Tỉnh Nghệ An' },
  { code: '80', name: 'Tỉnh Tây Ninh' },
  { code: '96', name: 'Tỉnh Cà Mau' }
];

// Resilient Fallback Districts
const FALLBACK_DISTRICTS = {
  '01': ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Cầu Giấy', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Thanh Xuân', 'Quận Tây Hồ', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Quận Hà Đông', 'Huyện Đông Anh', 'Huyện Gia Lâm'],
  '79': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Quận Bình Thạnh', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Thành phố Thủ Đức', 'Huyện Bình Chánh', 'Huyện Hóc Môn'],
  '48': ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang']
};

export const addressService = {
  /**
   * Get list of all provinces in Vietnam
   * @param {string} effectiveDate - default 'latest'
   */
  async getProvinces(effectiveDate = 'latest') {
    if (cache.provinces && cache.provinces.length > 0) {
      return cache.provinces;
    }

    try {
      const response = await fetch(`${BASE_URL}/${effectiveDate}/provinces`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const list = Array.isArray(json) ? json : (json?.data || []);

      if (list && list.length > 0) {
        cache.provinces = list;
        return list;
      }
      return FALLBACK_PROVINCES;
    } catch (err) {
      console.warn('AddressKit provinces API unavailable, using fallback list:', err.message);
      return FALLBACK_PROVINCES;
    }
  },

  /**
   * Get list of communes / districts belonging to a specific province
   * @param {string} provinceCode - e.g. '01' for Hanoi, '79' for HCMC
   * @param {string} effectiveDate - default 'latest'
   */
  async getCommunes(provinceCode, effectiveDate = 'latest') {
    if (!provinceCode) return [];

    const cacheKey = `${effectiveDate}_${provinceCode}`;
    if (cache.communesByProvince[cacheKey]) {
      return cache.communesByProvince[cacheKey];
    }

    try {
      const response = await fetch(`${BASE_URL}/${effectiveDate}/provinces/${provinceCode}/communes`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      let list = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (Array.isArray(json?.data)) {
        list = json.data;
      }

      if (list && list.length > 0) {
        cache.communesByProvince[cacheKey] = list;
        return list;
      }

      // Fallback if empty
      const fbList = (FALLBACK_DISTRICTS[provinceCode] || []).map((name, i) => ({
        code: `${provinceCode}_${i + 1}`,
        name: name
      }));
      return fbList;
    } catch (err) {
      console.warn(`AddressKit communes API for province ${provinceCode} unavailable, using fallback:`, err.message);
      const fbList = (FALLBACK_DISTRICTS[provinceCode] || []).map((name, i) => ({
        code: `${provinceCode}_${i + 1}`,
        name: name
      }));
      return fbList;
    }
  }
};

export default addressService;
