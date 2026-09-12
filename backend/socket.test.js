const request = require('supertest');
const { io: Client } = require('socket.io-client');
const app = require('./server');
const dbModule = require('./db');
const { closeSocket } = require('./socketManager');

describe('Socket.io Realtime Events & Webhook Integration Tests', () => {
  let server;
  let serverPort;
  let adminSocket;
  let customerSocket;

  beforeAll((done) => {
    server = app.server;
    server.listen(0, () => {
      serverPort = server.address().port;
      done();
    });
  });

  afterAll(async () => {
    if (adminSocket && adminSocket.connected) adminSocket.disconnect();
    if (customerSocket && customerSocket.connected) customerSocket.disconnect();
    closeSocket();
    await new Promise(resolve => server.close(resolve));
    try {
      await dbModule.pool.end();
    } catch (e) {}
  });

  test('Customer should join order room and receive payment_confirmed event upon webhook simulation', (done) => {
    const testOrderId = 'NAT-TEST-SOCKET-001';
    customerSocket = Client(`http://localhost:${serverPort}`, {
      transports: ['websocket', 'polling']
    });

    customerSocket.on('connect', () => {
      customerSocket.emit('join_order_room', testOrderId);

      setTimeout(async () => {
        const res = await request(app)
          .post('/api/payment/simulate-webhook')
          .send({
            orderId: testOrderId,
            amount: 15000000,
            transactionCode: 'MB-TEST-9988'
          });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      }, 50);
    });

    customerSocket.on('payment_confirmed', (data) => {
      expect(data.orderId).toBe(testOrderId);
      expect(data.status).toBe('PAID');
      expect(data.transactionCode).toBe('MB-TEST-9988');
      done();
    });
  });

  test('Admin client should receive new_order event when an order is created via POST /api/orders', (done) => {
    adminSocket = Client(`http://localhost:${serverPort}`, {
      transports: ['websocket', 'polling']
    });

    adminSocket.on('connect', () => {
      adminSocket.emit('join_admin_room');

      setTimeout(async () => {
        const newOrderData = {
          customerName: 'Realtime Tester',
          customerEmail: 'realtime@test.vn',
          customerPhone: '0987654321',
          customerAddress: '123 Realtime Way, Danang',
          paymentMethod: 'vietqr',
          totalAmount: 32000000,
          items: [
            { id: 'pc-rt', name: 'PC ULTRA RTX 4090', price: 32000000, quantity: 1 }
          ]
        };

        const res = await request(app)
          .post('/api/orders')
          .send(newOrderData);
        expect(res.statusCode).toBe(201);
      }, 50);
    });

    adminSocket.on('new_order', (order) => {
      expect(order.customerName).toBe('Realtime Tester');
      expect(order.totalAmount).toBe(32000000);
      done();
    });
  });
});
