import 'dotenv/config';
import mongoose from 'mongoose';

const API_BASE = 'http://localhost:5001';

async function runTestSuite() {
  console.log('🚀 Running Complete Atelier Coffee Roasters Pre-Deployment Security & API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1-3. Health check
  console.log('--- Test 1-3: Server Startup & MongoDB Atlas Health ---');
  try {
    const healthRes = await fetch(`${API_BASE}/api/health`);
    const health = await healthRes.json();
    assert(healthRes.ok && health.status === 'healthy', 'GET /api/health returns healthy');
    assert(health.database && health.database.status === 'connected', 'MongoDB Atlas database is connected');
    assert(health.database.name === 'atelier_coffee', 'Database name is atelier_coffee');
  } catch (err) {
    assert(false, `Health check error: ${err.message}`);
  }

  // 4-7. Registration, Login, JWT auth, Get User
  console.log('\n--- Test 4-7: Authentication (Register, Login, JWT, Profile) ---');
  const testEmail = `patron_${Date.now()}@ateliercoffee.test`;
  const testPhone = `+91 ${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const testPassword = 'PatronSecret2026!';
  let authToken = '';
  let testUserId = '';

  try {
    // 4. Register
    const regRes = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Aarav Test Patron',
        email: testEmail,
        phone: testPhone,
        password: testPassword
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success && regData.token, 'Register user (201 Created with JWT)');
    authToken = regData.token;
    testUserId = regData.user.id;

    // 5. Login with email
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200 && loginData.success && loginData.user.email === testEmail, 'Login with email');

    // Login with phone number
    const phoneLoginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testPhone, password: testPassword })
    });
    const phoneLoginData = await phoneLoginRes.json();
    assert(phoneLoginRes.status === 200 && phoneLoginData.success, 'Login with mobile phone number');

    // 6. JWT Auth verification
    const meRes = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200 && meData.user && meData.user.id === testUserId, 'Get authenticated user profile (GET /api/auth/me)');
    assert(!meData.user.password, 'Password hash is NEVER exposed in user profile response');
  } catch (err) {
    assert(false, `Auth error: ${err.message}`);
  }

  // 8-9. GET Products & Categories (Public catalog)
  console.log('\n--- Test 8-9: Menu Catalog (Products & Categories) ---');
  try {
    const catRes = await fetch(`${API_BASE}/api/categories`);
    const catData = await catRes.json();
    assert(catRes.status === 200 && catData.count === 9, `GET /api/categories returns all 9 categories (got ${catData.count})`);

    const prodRes = await fetch(`${API_BASE}/api/products`);
    const prodData = await prodRes.json();
    assert(prodRes.status === 200 && prodData.count === 46, `GET /api/products returns all 46 products (got ${prodData.count})`);

    // Single product by slug
    const singleRes = await fetch(`${API_BASE}/api/products/cappuccino`);
    const singleData = await singleRes.json();
    assert(singleRes.status === 200 && singleData.product.name === 'Cappuccino', 'GET /api/products/:slug returns correct item');
  } catch (err) {
    assert(false, `Products/Categories error: ${err.message}`);
  }

  // 10-11. Reservations API (Public booking, Protected listing)
  console.log('\n--- Test 10-11: Reservations API ---');
  let createdReservationId = '';
  try {
    // Public creation allowed
    const resvRes = await fetch(`${API_BASE}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Aarav Test Patron',
        phone: testPhone,
        guests: '4 Guests',
        date: '2026-10-15',
        time: '14:30',
        notes: 'Quiet corner table for cupping'
      })
    });
    const resvData = await resvRes.json();
    assert(resvRes.status === 201 && resvData.success, 'Create reservation (POST /api/reservations) preserves public flow');
    createdReservationId = resvData.reservation?._id || resvData.data?._id;

    // Unauthenticated GET /api/reservations must be REJECTED (no public leak)
    const unauthGetResv = await fetch(`${API_BASE}/api/reservations`);
    assert(unauthGetResv.status === 401, 'GET /api/reservations without token rejected with 401 Unauthorized');

    // Authenticated user gets only their reservations
    const authGetResv = await fetch(`${API_BASE}/api/reservations`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const authResvData = await authGetResv.json();
    assert(Array.isArray(authResvData) && authResvData.some((r) => r._id === createdReservationId), 'Authenticated user can access their own reservations');
  } catch (err) {
    assert(false, `Reservation error: ${err.message}`);
  }

  // 12-13. Reviews API
  console.log('\n--- Test 12-13: Reviews API ---');
  try {
    const revRes = await fetch(`${API_BASE}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: 'Aarav Test Patron',
        publication: 'Artisan Cupping Guild',
        quote: 'The single-origin washed lot was roasted to perfection.',
        rating: 5,
        favoriteItem: 'Cappuccino · Classic Fudge Brownie',
        date: 'Sep 2026'
      })
    });
    const revData = await revRes.json();
    assert(revRes.status === 201 && revData.success, 'Create review (POST /api/reviews)');

    const getReviews = await fetch(`${API_BASE}/api/reviews`);
    const allReviews = await getReviews.json();
    assert(Array.isArray(allReviews) && allReviews.some((r) => r.author === 'Aarav Test Patron'), 'GET /api/reviews contains newly saved review');
  } catch (err) {
    assert(false, `Review error: ${err.message}`);
  }

  // 14-16. Orders API (Create, Get ID, Get User Orders, Security)
  console.log('\n--- Test 14-16: Orders API ---');
  let createdOrderId = '';
  try {
    const orderPayload = {
      customerName: 'Aarav Test Patron',
      customerEmail: testEmail,
      customerPhone: testPhone,
      items: [
        { id: 'cappuccino', name: 'Cappuccino', price: 140, quantity: 2 },
        { id: 'classic-fudge-brownie', name: 'Classic Fudge Brownie', price: 110, quantity: 1 }
      ],
      orderType: 'Table Service',
      tableNumber: 'Table 04 · Pavilion',
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-TEST-12345',
        upiId: 'patron@okhdfcbank'
      },
      notes: 'Oat milk if available'
    };

    const orderRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(orderPayload)
    });
    const orderData = await orderRes.json();
    assert(orderRes.status === 201 && orderData.success, 'Create order (POST /api/orders)');
    // Expected: 2 * 140 + 1 * 110 = 390 subtotal. Tax: 390 * 0.05 = 19.5 -> 20. Total: 410.
    const savedOrder = orderData.order || orderData.data;
    assert(savedOrder.subtotal === 390, `Server recalculates subtotal correctly (expected 390, got ${savedOrder.subtotal})`);
    assert(savedOrder.tax === 20, `Server calculates 5% GST correctly (expected 20, got ${savedOrder.tax})`);
    assert(savedOrder.total === 410, `Server calculates grand total correctly (expected 410, got ${savedOrder.total})`);
    assert(savedOrder.status === 'Ordered', 'Order status defaults to "Ordered"');
    assert(savedOrder.userId === testUserId, 'Order uses authenticated identity from JWT token');
    createdOrderId = savedOrder._id;

    // Unauthenticated GET /api/orders/:id rejected
    const unauthGetOrder = await fetch(`${API_BASE}/api/orders/${createdOrderId}`);
    assert(unauthGetOrder.status === 401, 'GET /api/orders/:id without token rejected with 401');

    // Authenticated owner GET /api/orders/:id allowed
    const authGetOrder = await fetch(`${API_BASE}/api/orders/${createdOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const singleOrderData = await authGetOrder.json();
    assert(authGetOrder.status === 200 && (singleOrderData.order || singleOrderData.data)._id === createdOrderId, 'GET /api/orders/:id allows owner');

    // Authenticated owner GET /api/orders/user/:userId allowed
    const getUserOrders = await fetch(`${API_BASE}/api/orders/user/${testUserId}?email=${encodeURIComponent(testEmail)}&phone=${encodeURIComponent(testPhone)}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const userOrdersData = await getUserOrders.json();
    assert(Array.isArray(userOrdersData) && userOrdersData.some((o) => o._id === createdOrderId), 'GET /api/orders/user/:userId returns owner orders');
  } catch (err) {
    assert(false, `Order error: ${err.message}`);
  }

  // 17. Newsletter Subscription
  console.log('\n--- Test 17: Newsletter Subscription API ---');
  const newsletterEmail = `subscriber_${Date.now()}@ateliercoffee.test`;
  try {
    const subRes = await fetch(`${API_BASE}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail })
    });
    const subData = await subRes.json();
    assert(subRes.status === 201 && subData.success, 'Subscribe to newsletter (POST /api/newsletter)');

    // Duplicate subscription is handled safely
    const dupRes = await fetch(`${API_BASE}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail })
    });
    const dupData = await dupRes.json();
    assert(dupRes.status === 200 && dupData.success, 'Duplicate newsletter subscription handled safely (200 OK without duplicating)');
  } catch (err) {
    assert(false, `Newsletter error: ${err.message}`);
  }

  // 18. Admin Login & Authorization
  console.log('\n--- Test 18: Admin Authentication & Access ---');
  let adminToken = '';
  try {
    const adminLoginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@ateliercoffee.com', password: 'AtelierAdmin2026!' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200 && adminLoginData.user.role === 'admin', 'Default administrator login succeeds');
    adminToken = adminLoginData.token;

    const adminDashRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminDashData = await adminDashRes.json();
    assert(adminDashRes.status === 200 && adminDashData.data.totalProducts === 46, 'Authorized admin can access dashboard metrics');

    const adminOrdersRes = await fetch(`${API_BASE}/api/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminOrdersRes.status === 200, 'Admin can access GET /api/orders');

    const adminSubscribersRes = await fetch(`${API_BASE}/api/newsletter`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert(adminSubscribersRes.status === 200, 'Admin can access GET /api/newsletter subscribers');
  } catch (err) {
    assert(false, `Admin test error: ${err.message}`);
  }

  // 19. Comprehensive Security & Authorization Tests (Audit Requirements)
  console.log('\n--- Test 19-30: Comprehensive Security & Vulnerability Defense ---');
  try {
    // 19. Invalid JWT rejected
    const badJwtRes = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: 'Bearer this_is_a_completely_fake_invalid_token' }
    });
    assert(badJwtRes.status === 401, 'Invalid JWT is rejected with 401 Unauthorized');

    // 20. Missing JWT on protected routes
    const missingJwtRes = await fetch(`${API_BASE}/api/admin/dashboard`);
    assert(missingJwtRes.status === 401, 'Missing JWT on admin endpoint rejected with 401 Unauthorized');

    // 21. Normal authenticated user denied admin endpoints
    const nonAdminDashRes = await fetch(`${API_BASE}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(nonAdminDashRes.status === 403, 'Normal user accessing admin dashboard rejected with 403 Forbidden');

    const nonAdminAllOrdersRes = await fetch(`${API_BASE}/api/orders`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(nonAdminAllOrdersRes.status === 403, 'Normal user accessing GET /api/orders rejected with 403 Forbidden');

    const nonAdminDeleteOrderRes = await fetch(`${API_BASE}/api/orders/${createdOrderId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(nonAdminDeleteOrderRes.status === 403, 'Normal user attempting DELETE /api/orders/:id rejected with 403 Forbidden');

    // 22. IDOR Prevention: Normal user accessing another user's profile
    const fakeOtherUserId = new mongoose.Types.ObjectId().toString();
    const otherProfileRes = await fetch(`${API_BASE}/api/users/${fakeOtherUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(otherProfileRes.status === 403, 'Normal user accessing another user profile rejected with 403 Forbidden');

    // 23. IDOR Prevention: Normal user accessing another user's orders
    const otherOrdersRes = await fetch(`${API_BASE}/api/orders/user/${fakeOtherUserId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(otherOrdersRes.status === 403, 'Normal user accessing another user orders rejected with 403 Forbidden');

    // 24. Mass Assignment Prevention: Normal user cannot elevate role to admin via profile update
    const roleTamperRes = await fetch(`${API_BASE}/api/users/${testUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        name: 'Aarav Updated Patron',
        role: 'admin' // Attempting privilege escalation
      })
    });
    const roleTamperData = await roleTamperRes.json();
    assert(roleTamperRes.status === 200 && roleTamperData.user.role === 'user', 'Mass assignment of role=admin rejected; user remains role=user');

    // 25. User impersonation prevention on order creation
    const spoofOrderRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        userId: fakeOtherUserId, // Client attempts to spoof different user
        customerName: 'Aarav Test Patron',
        customerPhone: testPhone,
        items: [{ id: 'cappuccino', name: 'Cappuccino', price: 140, quantity: 1 }]
      })
    });
    const spoofOrderData = await spoofOrderRes.json();
    assert(spoofOrderRes.status === 201 && spoofOrderData.order.userId === testUserId, 'Server overrides spoofed userId with authenticated token ID');

    // 26. Invalid ObjectId format returns 400 Bad Request
    const badIdRes = await fetch(`${API_BASE}/api/orders/not-a-valid-object-id`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert(badIdRes.status === 400, 'Invalid ObjectId returns 400 Bad Request');

    // 27. Normal user cannot create products (admin only)
    const createProdNormalUser = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({ name: 'Hacked Coffee', price: 10, category: 'Coffee' })
    });
    assert(createProdNormalUser.status === 403, 'Normal user creating product rejected with 403 Forbidden');

    // 28. Duplicate registration email rejected
    const dupRegRes = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Another Patron',
        email: testEmail,
        phone: '+91 99999 88888',
        password: 'Password123!'
      })
    });
    assert(dupRegRes.status === 409, 'Duplicate user registration rejected with 409 Conflict');

    // 29. Short password rejected
    const shortPassRes = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Pass User',
        email: 'shortpass@test.com',
        phone: '+91 11111 22222',
        password: '123'
      })
    });
    assert(shortPassRes.status === 400, 'Invalid input (short password) rejected with 400 Bad Request');

    // 30. Reservation outside operating hours rejected
    const badTimeRes = await fetch(`${API_BASE}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Late Night Patron',
        date: '2026-10-15',
        time: '03:30' // 3:30 AM is outside operating hours
      })
    });
    assert(badTimeRes.status === 400, 'Reservation outside operating hours rejected with 400 Bad Request');
  } catch (err) {
    assert(false, `Security test error: ${err.message}`);
  }

  // 31. Verify records in MongoDB Atlas
  console.log('\n--- Test 31: Direct MongoDB Atlas Record Verification ---');
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const dbOrder = await mongoose.connection.collection('orders').findOne({ _id: new mongoose.Types.ObjectId(createdOrderId) });
    assert(Boolean(dbOrder), `Order record successfully persisted in MongoDB Atlas 'orders' collection (ID: ${createdOrderId})`);

    const dbSubscriber = await mongoose.connection.collection('subscribers').findOne({ email: newsletterEmail });
    assert(Boolean(dbSubscriber), `Subscriber record successfully persisted in MongoDB Atlas 'subscribers' collection (${newsletterEmail})`);

    await mongoose.disconnect();
    assert(true, 'MongoDB Atlas verified and disconnected cleanly');
  } catch (err) {
    assert(false, `Direct MongoDB verification error: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
