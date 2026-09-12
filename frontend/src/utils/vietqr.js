/**
 * VietQR NAPAS 24/7 Dynamic Payment QR Helper (Frontend)
 */

export const DEFAULT_BANK_CONFIG = {
  bankId: 'MB',
  bankName: 'Ngân hàng Quân Đội (MBBank)',
  accountNo: '0773071629',
  accountName: 'NGO ANH TU',
  template: 'compact2' // 'compact2' | 'qr_only' | 'compact' | 'print'
};

/**
 * Generate a dynamic VietQR image URL with amount and order description
 */
export function generateVietQrUrl({
  amount = 0,
  orderId = '',
  template = 'compact2',
  bankConfig = DEFAULT_BANK_CONFIG
}) {
  const config = { ...DEFAULT_BANK_CONFIG, ...bankConfig };
  const numAmount = Math.max(0, Math.round(Number(amount) || 0));
  const cleanOrderId = orderId ? String(orderId).replace(/\s+/g, '') : 'NATORDER';
  const memo = `NAT ${cleanOrderId}`;

  const queryParams = `amount=${numAmount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(config.accountName)}`;

  return `https://img.vietqr.io/image/${config.bankId}-${config.accountNo}-${template}.png?${queryParams}`;
}

export default {
  DEFAULT_BANK_CONFIG,
  generateVietQrUrl
};
