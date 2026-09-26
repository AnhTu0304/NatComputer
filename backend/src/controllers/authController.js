const UserModel = require('../models/UserModel');
const { hashPassword, comparePassword, generateToken } = require('../middlewares/authMiddleware');

class AuthController {
  static async register(req, res) {
    const { name, email, phone, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email và Mật khẩu là bắt buộc.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await UserModel.findByIdentifier(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản.' });
    }

    const userId = 'usr_' + Date.now();
    const userName = name || email.split('@')[0];
    const userPhone = phone || '0886976868';
    const userAddress = '456 Trần Duy Hưng, Cầu Giấy, Hà Nội';
    const hashedPassword = await hashPassword(password);

    const safeUser = await UserModel.create({
      id: userId,
      name: userName,
      email: cleanEmail,
      phone: userPhone,
      hashedPassword,
      role: 'customer',
      address: userAddress
    });

    const token = generateToken(safeUser);
    res.status(201).json({ message: 'Tạo tài khoản thành công.', user: safeUser, token });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Email/SĐT và Mật khẩu.' });
    }

    const cleanIdentifier = email.trim().toLowerCase();

    // Admin Master Quick Authentication (admin / 123)
    if ((cleanIdentifier === 'admin' || cleanIdentifier === 'admin@natcomputer.vn') && password === '123') {
      const adminUser = {
        id: 'usr_admin_master',
        name: 'Quản Trị Viên (Admin Master)',
        email: 'admin@natcomputer.vn',
        phone: '0886976868',
        role: 'admin',
        address: 'Trụ sở NAT Computer, Cầu Giấy, Hà Nội',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      const token = generateToken(adminUser);
      return res.json({ message: 'Đăng nhập Quản trị viên thành công.', user: adminUser, token });
    }

    const user = await UserModel.findByIdentifier(cleanIdentifier);
    if (!user) {
      return res.status(404).json({ error: 'Tài khoản chưa được đăng ký. Vui lòng chọn Tạo tài khoản.' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.' });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'customer',
      address: user.address,
      avatar: user.avatar_url
    };

    const token = generateToken(safeUser);
    res.json({ message: 'Đăng nhập thành công.', user: safeUser, token });
  }

  static async getMe(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Chưa đăng nhập.' });
    }
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin tài khoản.' });
    }
    res.json({ user });
  }

  static async googleAuth(req, res) {
    const { googleUser } = req.body;
    if (!googleUser || !googleUser.email) {
      return res.status(400).json({ error: 'Thông tin Google User không hợp lệ.' });
    }

    const cleanEmail = googleUser.email.trim().toLowerCase();
    const userName = googleUser.name || cleanEmail.split('@')[0];
    const userAvatar = googleUser.picture || '';
    const isAdmin = cleanEmail === 'admin@natcomputer.vn';

    let user = await UserModel.findByIdentifier(cleanEmail);
    if (!user) {
      const newId = 'usr_gg_' + (googleUser.sub ? googleUser.sub.slice(-8) : Date.now());
      user = await UserModel.create({
        id: newId,
        name: userName,
        email: cleanEmail,
        phone: '0886976868',
        hashedPassword: 'google_oauth',
        role: isAdmin ? 'admin' : 'customer',
        address: 'Đăng nhập qua Google'
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || 'customer',
      avatar: user.avatar_url || userAvatar
    };

    const token = generateToken(safeUser);
    res.json({ message: 'Đăng nhập Google thành công.', user: safeUser, token });
  }
}

module.exports = AuthController;
