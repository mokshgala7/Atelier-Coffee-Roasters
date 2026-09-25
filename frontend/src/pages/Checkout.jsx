import { useState, useId } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';
import atelierLogo from '../assets/images/logo.webp';

export default function Checkout({ onNavigate }) {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Order Details
  const [orderType, setOrderType] = useState('Table Service');
  const [tableNumber, setTableNumber] = useState('Table 04 · Pavilion');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');

  // Payment Method: 'UPI' | 'Card' | 'Bar'
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Dummy UPI State
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Dummy Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Aarav Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('382');

  // Submission / Loading / Success States
  const [processing, setProcessing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const tax = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!items.length) {
      setErrorMessage('Your cart is empty. Please add items to checkout.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setProcessing(true);

    // Simulate realistic 1.2s dummy payment processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const payload = {
      userId: user?.id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim(),
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        customizations: i.customizations,
        image: i.image
      })),
      subtotal,
      tax,
      total: grandTotal,
      orderType,
      tableNumber: orderType === 'Table Service' ? tableNumber : 'Bar Pickup',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash at Bar' ? 'Pending' : 'Paid',
      paymentDetails: {
        transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
        cardLast4: paymentMethod === 'Card' ? cardNumber.slice(-4) : undefined
      },
      notes: notes.trim()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order in database');
      }

      clearCart();
      setPlacedOrder(data.order);
    } catch (err) {
      console.error('Order error:', err);
      setErrorMessage(err.message || 'Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // If order was successfully placed, display the luxury receipt
  if (placedOrder) {
    return (
      <div className="min-h-screen bg-[#fff8f5] pt-28 pb-20 px-6 lg:px-12 flex items-center justify-center">
        <div className="max-w-xl w-full bg-[#fbf2ec] border border-[#ebdcd5] rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px]">check_circle</span>
          </div>

          <div className="space-y-1">
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest">
              Payment Completed · Order Placed
            </span>
            <h2 className="font-['Playfair_Display',serif] text-3xl font-bold text-[#1f1b18]">
              Receipt Confirmed
            </h2>
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55]">
              Order #{placedOrder._id?.slice(-8).toUpperCase()} · Saved directly to MongoDB Atlas
            </p>
          </div>

          {/* Itemized Receipt Details */}
          <div className="p-5 bg-[#fff8f5] rounded-2xl border border-[#ebdcd5] text-left space-y-3 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#56423c]">
            <div className="flex justify-between border-b border-[#ebddd4] pb-2">
              <span className="font-semibold">Service Type:</span>
              <strong className="text-[#1f1b18]">{placedOrder.orderType} ({placedOrder.tableNumber})</strong>
            </div>
            <div className="flex justify-between border-b border-[#ebddd4] pb-2">
              <span className="font-semibold">Customer:</span>
              <strong className="text-[#1f1b18]">{placedOrder.customerName} · {placedOrder.customerPhone}</strong>
            </div>
            <div className="flex justify-between border-b border-[#ebddd4] pb-2">
              <span className="font-semibold">Payment Method:</span>
              <span className="inline-flex items-center gap-1 font-bold text-[#84310e]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                {placedOrder.paymentMethod} ({placedOrder.paymentStatus})
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="font-bold text-[#1f1b18] block">Items Ordered:</span>
              {placedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#665c55]">
                  <span>{item.quantity}x {item.name} {item.customizations?.milk ? `(${item.customizations.milk})` : ''}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ebddd4] pt-2 flex justify-between font-bold text-sm text-[#1f1b18]">
              <span>Grand Total:</span>
              <span className="text-[#84310e]">₹{placedOrder.total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className="flex-1 py-3.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-sm border-0 cursor-pointer"
            >
              View in My Orders
            </button>
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="flex-1 py-3.5 rounded-full bg-[#f6ece7] hover:bg-[#ebdcd5] text-[#56423c] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer"
            >
              Order More Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#fff8f5] pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#fbf2ec] border border-[#ebdcd5] rounded-3xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
          </div>
          <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1f1b18]">
            Your Cart is Empty
          </h2>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-relaxed">
            Explore our single-origin coffees, ceremonial matchas, and handcrafted bakes before proceeding to checkout.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="px-8 py-3.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow-sm transition-all transform hover:scale-[1.02] border-0 cursor-pointer"
            >
              Explore The Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="pb-8 space-y-1">
          <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest">
            Seat-Side &amp; Roastery Checkout
          </span>
          <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl text-[#1f1b18]">
            Complete Your Atelier Order
          </h1>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55]">
            Seamless digital table service and instant dummy payments (UPI, Cards, Cash).
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-['Plus_Jakarta_Sans',sans-serif] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Dining Details & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Dining Details Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#ebdcd5] pb-3">
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1f1b18] m-0">
                  1. Service &amp; Dining Location
                </h3>
                {!isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-[#a34824] hover:text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    Have an account? Sign In
                  </button>
                ) : (
                  <span className="text-emerald-700 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    Logged in as {user.name}
                  </span>
                )}
              </div>

              {/* Service Type Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('Table Service')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    orderType === 'Table Service'
                      ? 'bg-white border-[#a34824] shadow-xs ring-1 ring-[#a34824]'
                      : 'bg-[#fff8f5] border-[#ebdcd5] hover:border-[#a34824]'
                  }`}
                >
                  <strong className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#1f1b18]">
                    🍽️ Seat-Side Table Service
                  </strong>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#665c55] mt-0.5 block">
                    Served in handcrafted ceramic ware
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('Roastery Bar Pickup')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    orderType === 'Roastery Bar Pickup'
                      ? 'bg-white border-[#a34824] shadow-xs ring-1 ring-[#a34824]'
                      : 'bg-[#fff8f5] border-[#ebdcd5] hover:border-[#a34824]'
                  }`}
                >
                  <strong className="block font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#1f1b18]">
                    ☕ Bar Pickup
                  </strong>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#665c55] mt-0.5 block">
                    Pick up warm at the Slayer extraction bar
                  </span>
                </button>
              </div>

              {orderType === 'Table Service' && (
                <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                  <span>Your Table Number</span>
                  <select
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                  >
                    <option>Table 01 · Sunlit Terrace</option>
                    <option>Table 02 · Garden Pergola</option>
                    <option>Table 03 · Roaster View Counter</option>
                    <option>Table 04 · Pavilion (Active)</option>
                    <option>Table 05 · Library Alcove</option>
                    <option>Table 06 · Central Hearth</option>
                    <option>Table 07 · Courtyard Bench</option>
                    <option>Table 08 · Slayer Bar Counter</option>
                    <option>Table 09 · Cupping Room</option>
                    <option>Table 10 · Mezzanine Lounge</option>
                    <option>Table 11 · Glass Atrium</option>
                    <option>Table 12 · Master Roaster Bay</option>
                  </select>
                </label>
              )}

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                  <span>Your Name *</span>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                  />
                </label>

                <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                  <span>Mobile Number *</span>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                  />
                </label>
              </div>

              <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                <span>Email Address (for instant receipt)</span>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. aarav@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                />
              </label>

              <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                <span>Kitchen / Barista Notes (Optional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra hot milk, sugar on the side"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                />
              </label>
            </div>

            {/* 2. Interactive Payment Methods Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#ebdcd5] pb-3">
                <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1f1b18] m-0">
                  2. Payment Method
                </h3>
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-[#a34824] bg-[#f6ece7] px-2.5 py-0.5 rounded-full">
                  Dummy Payment Simulation
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'UPI'
                      ? 'bg-white border-[#a34824] shadow-xs ring-1 ring-[#a34824]'
                      : 'bg-[#fff8f5] border-[#ebdcd5] hover:border-[#a34824]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#a34824] text-[22px]">qr_code_2</span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18]">
                    UPI / QR
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Card'
                      ? 'bg-white border-[#a34824] shadow-xs ring-1 ring-[#a34824]'
                      : 'bg-[#fff8f5] border-[#ebdcd5] hover:border-[#a34824]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#a34824] text-[22px]">credit_card</span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18]">
                    Cards
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash at Bar')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'Cash at Bar'
                      ? 'bg-white border-[#a34824] shadow-xs ring-1 ring-[#a34824]'
                      : 'bg-[#fff8f5] border-[#ebdcd5] hover:border-[#a34824]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#a34824] text-[22px]">payments</span>
                  <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18]">
                    Cash at Bar
                  </span>
                </button>
              </div>

              {/* UPI Tab View */}
              {paymentMethod === 'UPI' && (
                <div className="p-5 bg-white rounded-xl border border-[#ebdcd5] space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Simulated QR Code */}
                    <div className="p-3 bg-[#fff8f5] border-2 border-dashed border-[#dcc1b8] rounded-2xl flex flex-col items-center text-center shadow-xs">
                      <div className="w-32 h-32 bg-gradient-to-br from-[#3c2a21] via-[#84310e] to-[#1f1b18] rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                          <img src={atelierLogo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                        </div>
                      </div>
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#665c55] mt-1.5 font-bold">
                        Scan to Pay ₹{grandTotal}
                      </span>
                    </div>

                    {/* App Picker & UPI ID */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="space-y-1.5">
                        <label className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c] block">
                          Instant UPI Apps
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                setSelectedUpiApp(app);
                                setUpiId(`patron@${app.toLowerCase().replace(/\s+/g, '')}`);
                              }}
                              className={`px-3 py-1 rounded-md text-[11px] font-['Plus_Jakarta_Sans',sans-serif] font-medium border cursor-pointer transition-colors ${
                                selectedUpiApp === app
                                  ? 'bg-[#a34824] text-white border-[#a34824]'
                                  : 'bg-[#fff8f5] text-[#56423c] border-[#ebdcd5] hover:border-[#a34824]'
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>

                      <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                        <span>Enter UPI ID / VPA</span>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. patron@okaxis"
                          className="w-full px-3 py-2 rounded-lg bg-[#fff8f5] border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Tab View */}
              {paymentMethod === 'Card' && (
                <div className="p-5 bg-white rounded-xl border border-[#ebdcd5] space-y-4">
                  {/* Luxury Digital Card Preview */}
                  <div className="h-44 w-full max-w-sm mx-auto bg-gradient-to-tr from-[#2d221c] via-[#4a3528] to-[#84310e] rounded-2xl p-5 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] tracking-widest uppercase text-[#ffdbcf]">
                        Atelier Roasters Patron Card
                      </span>
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider">
                        VISA
                      </span>
                    </div>

                    <div className="w-10 h-7 bg-amber-200/70 rounded-md border border-amber-300/80 shadow-xs" />

                    <div>
                      <p className="font-mono text-base tracking-widest text-[#fbf2ec] m-0">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </p>
                      <div className="flex justify-between text-[10px] text-[#ebdcd5] mt-2 font-['Plus_Jakarta_Sans',sans-serif]">
                        <span>{cardHolder || 'CARDHOLDER NAME'}</span>
                        <span>EXP: {cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Inputs */}
                  <div className="space-y-3 pt-2">
                    <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                      <span>Card Number</span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full px-3 py-2 rounded-lg bg-[#fff8f5] border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                        <span>Expiry Date</span>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-lg bg-[#fff8f5] border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                        />
                      </label>

                      <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
                        <span>CVV</span>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 rounded-lg bg-[#fff8f5] border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Cash at Bar Tab View */}
              {paymentMethod === 'Cash at Bar' && (
                <div className="p-5 bg-white rounded-xl border border-[#ebdcd5] flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#a34824] text-[24px]">storefront</span>
                  <div className="space-y-1">
                    <h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18] m-0">
                      Seat-Side / Barista Counter Payment
                    </h4>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#665c55] leading-relaxed m-0">
                      Your order will be queued immediately in our kitchen roastery. You may settle via Cash, Card, or UPI upon delivery at your table or counter pickup.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs space-y-5 sticky top-28">
              <h3 className="font-['Playfair_Display',serif] text-xl font-bold text-[#1f1b18] border-b border-[#ebdcd5] pb-3 m-0">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} Items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => {
                  const itemKey = item.cartItemId || item.id;
                  return (
                    <div key={itemKey} className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#ebdcd5]">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[#ebdcd5] flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18] truncate m-0">
                          {item.name}
                        </p>
                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a] m-0">
                          Qty: {item.quantity} × ₹{item.price}
                          {item.customizations?.milk ? ` · ${item.customizations.milk}` : ''}
                        </p>
                      </div>
                      <strong className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#84310e]">
                        ₹{item.price * item.quantity}
                      </strong>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation */}
              <div className="border-t border-[#ebddd4] pt-4 space-y-2 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#56423c]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <div className="flex justify-between">
                  <span>GST &amp; Roastery Service (5%)</span>
                  <strong>₹{tax}</strong>
                </div>
                <div className="border-t border-[#ebddd4] pt-2 flex justify-between text-base font-bold text-[#1f1b18]">
                  <span>Total Amount</span>
                  <span className="text-[#84310e]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.01] shadow-md border-0 cursor-pointer disabled:opacity-50"
              >
                {processing ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    Processing Dummy Payment...
                  </span>
                ) : (
                  `Pay ₹${grandTotal} via ${paymentMethod} & Place Order`
                )}
              </button>

              <div className="text-center pt-1">
                <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#89726a]">
                  🔒 Simulated Payment · Order records saved live to MongoDB Atlas
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
