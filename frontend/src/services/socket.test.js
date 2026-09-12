import * as socketIoClient from 'socket.io-client';
import {
  getSocket,
  joinOrderRoom,
  leaveOrderRoom,
  joinAdminRoom,
  leaveAdminRoom,
  onPaymentConfirmed,
  onNewOrder,
  onOrderPaymentUpdated,
  disconnectSocket
} from './socket';

const mockSocket = {
  connected: true,
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn()
};

jest.mock('socket.io-client', () => ({
  io: jest.fn()
}));

describe('Frontend Socket.io Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    disconnectSocket();
    socketIoClient.io.mockReturnValue(mockSocket);
  });

  test('getSocket initializes singleton instance with correct config', () => {
    const socket = getSocket();
    expect(socket).toBeDefined();
    expect(socket.emit).toBeDefined();
  });

  test('joinOrderRoom and leaveOrderRoom emit correct socket events', () => {
    const socket = getSocket();
    joinOrderRoom('NAT-TEST-123');
    expect(socket.emit).toHaveBeenCalledWith('join_order_room', 'NAT-TEST-123');

    leaveOrderRoom('NAT-TEST-123');
    expect(socket.emit).toHaveBeenCalledWith('leave_order_room', 'NAT-TEST-123');
  });

  test('joinAdminRoom and leaveAdminRoom emit correct admin events', () => {
    const socket = getSocket();
    joinAdminRoom();
    expect(socket.emit).toHaveBeenCalledWith('join_admin_room');

    leaveAdminRoom();
    expect(socket.emit).toHaveBeenCalledWith('leave_admin_room');
  });

  test('onPaymentConfirmed registers listener and returns unsubscribe function', () => {
    const socket = getSocket();
    const handler = jest.fn();
    const unsub = onPaymentConfirmed(handler);

    expect(socket.on).toHaveBeenCalledWith('payment_confirmed', handler);
    unsub();
    expect(socket.off).toHaveBeenCalledWith('payment_confirmed', handler);
  });

  test('onNewOrder registers listener and returns unsubscribe function', () => {
    const socket = getSocket();
    const handler = jest.fn();
    const unsub = onNewOrder(handler);

    expect(socket.on).toHaveBeenCalledWith('new_order', handler);
    unsub();
    expect(socket.off).toHaveBeenCalledWith('new_order', handler);
  });
});
