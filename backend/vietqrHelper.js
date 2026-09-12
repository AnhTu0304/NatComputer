/**
 * VietQR NAPAS 24/7 Dynamic Payment QR Helper
 */

let dynamicBankConfig = {
  bankId: process.env.BANK_ID || 'MB',
  accountNo: process.env.BANK_ACCOUNT_NO || '0773071629',
  accountName: process.env.BANK_ACCOUNT_NAME || 'NGO ANH TU',
  bankName: process.env.BANK_NAME || 'Ngân hàng Quân Đội (MBBank)',
  template: 'compact2' // 'compact2' | 'qr_only' | 'compact' | 'print'
};

function getBankConfig() {
  return {
    bankId: process.env.BANK_ID || dynamicBankConfig.bankId || 'MB',
    accountNo: process.env.BANK_ACCOUNT_NO || dynamicBankConfig.accountNo || '0773071629',
    accountName: process.env.BANK_ACCOUNT_NAME || dynamicBankConfig.accountName || 'NGO ANH TU',
    bankName: process.env.BANK_NAME || dynamicBankConfig.bankName || 'Ngân hàng Quân Đội (MBBank)',
    template: dynamicBankConfig.template || 'compact2'
  };
}

function updateBankConfig(newConfig) {
  dynamicBankConfig = {
    ...dynamicBankConfig,
    ...newConfig
  };
  return getBankConfig();
}

/**
 * Generate a dynamic VietQR image URL with amount and order description
 */
function generateVietQrUrl({ amount, orderId, template = 'compact2', customConfig = null }) {
  const config = customConfig || getBankConfig();
  const bankId = config.bankId || 'MB';
  const accountNo = config.accountNo || '0773071629';
  const accountName = config.accountName || 'NGO ANH TU';
  const tpl = template || config.template || 'compact2';

  const numAmount = Math.max(0, Math.round(Number(amount) || 0));
  const cleanOrderId = orderId ? String(orderId).replace(/\s+/g, '') : 'NATORDER';
  const memo = `NAT ${cleanOrderId}`;

  const queryParams = `amount=${numAmount}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(accountName)}`;

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${tpl}.png?${queryParams}`;
}

module.exports = {
  getBankConfig,
  updateBankConfig,
  generateVietQrUrl
};
