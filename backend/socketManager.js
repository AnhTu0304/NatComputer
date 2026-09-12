const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.io Server instance
 */
function initSocket(httpServer) {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    // 1. Client joins an individual order room for live payment feedback
    socket.on('join_order_room', (orderId) => {
      if (orderId) {
        const roomName = `order_${String(orderId).trim()}`;
        socket.join(roomName);
      }
    });

    socket.on('leave_order_room', (orderId) => {
      if (orderId) {
        const roomName = `order_${String(orderId).trim()}`;
        socket.leave(roomName);
      }
    });

    // 2. Admin dashboard client joins admin room for live notifications
    socket.on('join_admin_room', () => {
      socket.join('admin_room');
    });

    socket.on('leave_admin_room', () => {
      socket.leave('admin_room');
    });

    socket.on('disconnect', () => {
      // Clean disconnection
    });
  });

  return io;
}

/**
 * Get active Socket.io instance
 */
function getIO() {
  return io;
}

/**
 * Broadcast new order event to all connected admin clients
 */
function notifyNewOrder(orderData) {
  if (io) {
    io.to('admin_room').emit('new_order', orderData);
    io.emit('order_created_broadcast', {
      id: orderData.id,
      totalAmount: orderData.totalAmount || orderData.totalPrice,
      createdAt: orderData.createdAt
    });
  }
}

/**
 * Notify specific customer order room that payment has been confirmed
 */
function notifyPaymentSuccess(orderId, paymentData = {}) {
  if (io && orderId) {
    const roomName = `order_${String(orderId).trim()}`;
    io.to(roomName).emit('payment_confirmed', {
      orderId,
      status: 'PAID',
      confirmedAt: new Date().toISOString(),
      ...paymentData
    });

    // Also notify admin room of updated payment
    io.to('admin_room').emit('order_payment_updated', {
      orderId,
      paymentStatus: 'PAID'
    });
  }
}

/**
 * Close Socket.io server instance for clean teardown
 */
function closeSocket() {
  if (io) {
    io.close();
    io = null;
  }
}

module.exports = {
  initSocket,
  getIO,
  closeSocket,
  notifyNewOrder,
  notifyPaymentSuccess
};
