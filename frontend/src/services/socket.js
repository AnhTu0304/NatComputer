import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

/**
 * Get or create the singleton Socket.io client instance
 */
export function getSocket() {
  if (!socketInstance) {
    try {
      socketInstance = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });
    } catch (e) {
      console.warn('Socket connection error:', e.message);
    }
  } else if (socketInstance && !socketInstance.connected && socketInstance.connect) {
    socketInstance.connect();
  }
  return socketInstance;
}

/**
 * Join customer room for a specific order to listen for live payment status
 */
export function joinOrderRoom(orderId) {
  const socket = getSocket();
  if (socket && orderId && socket.emit) {
    socket.emit('join_order_room', orderId);
  }
}

/**
 * Leave customer order room
 */
export function leaveOrderRoom(orderId) {
  if (socketInstance && orderId && socketInstance.emit) {
    socketInstance.emit('leave_order_room', orderId);
  }
}

/**
 * Join admin notification channel
 */
export function joinAdminRoom() {
  const socket = getSocket();
  if (socket && socket.emit) {
    socket.emit('join_admin_room');
  }
}

/**
 * Leave admin notification channel
 */
export function leaveAdminRoom() {
  if (socketInstance && socketInstance.emit) {
    socketInstance.emit('leave_admin_room');
  }
}

/**
 * Subscribe to payment confirmation event for an order
 */
export function onPaymentConfirmed(callback) {
  const socket = getSocket();
  if (socket && socket.on) {
    socket.on('payment_confirmed', callback);
  }
  return () => {
    if (socketInstance && socketInstance.off) {
      socketInstance.off('payment_confirmed', callback);
    }
  };
}

/**
 * Subscribe to new order event (for Admin dashboard)
 */
export function onNewOrder(callback) {
  const socket = getSocket();
  if (socket && socket.on) {
    socket.on('new_order', callback);
  }
  return () => {
    if (socketInstance && socketInstance.off) {
      socketInstance.off('new_order', callback);
    }
  };
}

/**
 * Subscribe to order payment status update (for Admin dashboard)
 */
export function onOrderPaymentUpdated(callback) {
  const socket = getSocket();
  if (socket && socket.on) {
    socket.on('order_payment_updated', callback);
  }
  return () => {
    if (socketInstance && socketInstance.off) {
      socketInstance.off('order_payment_updated', callback);
    }
  };
}

/**
 * Disconnect socket on application cleanup
 */
export function disconnectSocket() {
  if (socketInstance) {
    if (socketInstance.disconnect) {
      socketInstance.disconnect();
    }
    socketInstance = null;
  }
}

export default {
  getSocket,
  joinOrderRoom,
  leaveOrderRoom,
  joinAdminRoom,
  leaveAdminRoom,
  onPaymentConfirmed,
  onNewOrder,
  onOrderPaymentUpdated,
  disconnectSocket
};
