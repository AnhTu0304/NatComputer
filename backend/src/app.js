require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { dbModule } = require('./config/dbHelper');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const emailRoutes = require('./routes/emailRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NAT Computer Backend API is running clean (MVC Architecture)',
    postgres: dbModule.getIsPostgresConnected() ? 'Connected' : 'Fallback DB',
    timestamp: new Date()
  });
});

// Mount modular MVC Routes
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', emailRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

module.exports = app;
