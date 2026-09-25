import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../hooks/useCart';
import atelierLogo from '../assets/images/logo.webp';

export default function Profile({ onNavigate, onShowToast }) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations'

  // Fetch past orders and reservations from MongoDB Atlas
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Query orders by userId, email, or phone
        let orderUrl = '/api/orders';
        if (user?.id) {
          orderUrl = `/api/orders/user/${user.id}?email=${encodeURIComponent(user.email || '')}&phone=${encodeURIComponent(user.phone || '')}`;
        }

        const [ordersRes, resvRes] = await Promise.all([
          fetch(orderUrl).catch(() => null),
          fetch('/api/reservations').catch(() => null)
        ]);

        if (ordersRes && ordersRes.ok) {
          const ordersData = await ordersRes.json();
          // If logged in, filter or sort
          if (Array.isArray(ordersData)) {
            setOrders(ordersData);
          }
        }

        if (resvRes && resvRes.ok) {
          const resvData = await resvRes.json();
          if (Array.isArray(resvData)) {
            // Filter reservations matching user phone or email if logged in
            if (user?.phone || user?.name) {
              const userResvs = resvData.filter(
                (r) => r.phone === user.phone || r.name?.toLowerCase().includes(user.name?.toLowerCase())
              );
              setReservations(userResvs.length ? userResvs : resvData);
            } else {
              setReservations(resvData);
            }
          }
        }
      } catch (err) {
        console.warn('Error fetching user data from MongoDB:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleReorder = (order) => {
    if (!order.items || !order.items.length) return;
    order.items.forEach((item) => {
      addToCart(item, item.customizations || {});
    });
    if (onShowToast) {
      onShowToast(`Added ${order.items.length} items from Order #${order._id?.slice(-6).toUpperCase()} to cart!`);
    }
    onNavigate('menu');
  };

  const handleLogout = () => {
    logout();
    if (onShowToast) onShowToast('You have been logged out.');
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs">
          <div className="flex items-center gap-4">
            <img
              src={atelierLogo}
              alt="Atelier Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#dcc1b8] shadow-xs"
            />
            <div>
              <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold text-[#a34824] uppercase tracking-wider block">
                Patron Profile &amp; History
              </span>
              <h1 className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-[#1f1b18] mt-0.5">
                {isAuthenticated ? user.name : 'Guest Patron'}
              </h1>
              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-0.5">
                {isAuthenticated
                  ? `${user.phone} · ${user.email}`
                  : 'Sign in to access your saved order history, mobile checkout, and cupping notes.'}
              </p>
            </div>
          </div>

          <div>
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-full bg-[#f6ece7] hover:bg-[#ebdcd5] text-[#56423c] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-colors border border-[#ebdcd5] cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-sm border-0 cursor-pointer"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-[#ebdcd5] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider uppercase pb-2 transition-all border-b-2 cursor-pointer bg-transparent border-0 ${
              activeTab === 'orders'
                ? 'text-[#a34824] border-b-[#a34824] border-b-solid'
                : 'text-[#665c55] hover:text-[#1f1b18] border-b-transparent'
            }`}
          >
            Past Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reservations')}
            className={`font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider uppercase pb-2 transition-all border-b-2 cursor-pointer bg-transparent border-0 ${
              activeTab === 'reservations'
                ? 'text-[#a34824] border-b-[#a34824] border-b-solid'
                : 'text-[#665c55] hover:text-[#1f1b18] border-b-transparent'
            }`}
          >
            Tasting Reservations ({reservations.length})
          </button>
        </div>

        {/* Orders Tab View */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loading ? (
              <div className="p-12 text-center text-[#665c55] font-['Plus_Jakarta_Sans',sans-serif] text-xs">
                <span className="material-symbols-outlined text-[28px] animate-spin text-[#a34824] block mb-2">refresh</span>
                Retrieving order records from MongoDB Atlas...
              </div>
            ) : orders.length > 0 ? (
              orders.map((order) => {
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                return (
                  <article
                    key={order._id}
                    className="p-6 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs space-y-4 hover:shadow-md transition-shadow"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebddd4] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-sm text-[#1f1b18]">
                            #{order._id?.slice(-8).toUpperCase()}
                          </strong>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-bold uppercase tracking-wider">
                            {order.status || 'Preparing'}
                          </span>
                        </div>
                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#665c55] mt-0.5 block">
                          Placed on {dateStr} · {order.orderType} ({order.tableNumber})
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full bg-[#f6ece7] text-[#84310e] text-[11px] font-['Plus_Jakarta_Sans',sans-serif] font-semibold">
                          💳 {order.paymentMethod} ({order.paymentStatus || 'Paid'})
                        </span>
                        <strong className="font-['Plus_Jakarta_Sans',sans-serif] text-base text-[#84310e]">
                          ₹{order.total}
                        </strong>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#ebdcd5]">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#1f1b18] truncate m-0">
                                {item.name}
                              </p>
                              <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#89726a] m-0">
                                Qty: {item.quantity} · ₹{item.price}
                                {item.customizations?.milk ? ` (${item.customizations.milk})` : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#ebddd4]/60">
                      <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a]">
                        Customer: {order.customerName} ({order.customerPhone})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">replay</span>
                        Reorder All
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] space-y-3">
                <span className="material-symbols-outlined text-[36px] text-[#a34824]">receipt_long</span>
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1f1b18]">
                  No Past Orders Recorded Yet
                </h3>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] max-w-sm mx-auto">
                  When you place orders through our seat-side digital table service or bar pickup, they will appear here live.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('menu')}
                    className="px-6 py-2.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider border-0 cursor-pointer shadow-xs"
                  >
                    Browse Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tasting Reservations Tab View */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length > 0 ? (
              reservations.map((resv) => (
                <article
                  key={resv._id}
                  className="p-6 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-['Playfair_Display',serif] text-base font-bold text-[#1f1b18]">
                        Signature Atelier Tasting Experience
                      </strong>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-['Plus_Jakarta_Sans',sans-serif] font-bold uppercase tracking-wider">
                        {resv.status || 'Confirmed'}
                      </span>
                    </div>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] m-0">
                      📅 Date: <strong>{resv.date}</strong> · ⏰ Time: <strong>{resv.time}</strong> · 👥 Party: <strong>{resv.guests}</strong>
                    </p>
                    <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a] m-0">
                      Reserved for: {resv.name} ({resv.phone}) {resv.notes ? `· Palate notes: "${resv.notes}"` : ''}
                    </p>
                  </div>

                  <span className="text-[#a34824] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold">
                    📍 SVKM Flagship Pavilion
                  </span>
                </article>
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] space-y-3">
                <span className="material-symbols-outlined text-[36px] text-[#a34824]">calendar_today</span>
                <h3 className="font-['Playfair_Display',serif] text-lg font-bold text-[#1f1b18]">
                  No Tasting Reservations Found
                </h3>
                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] max-w-sm mx-auto">
                  Book a multi-sensory cupping session at our SVKM Roastery Pavilion.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="px-6 py-2.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider border-0 cursor-pointer shadow-xs"
                  >
                    View Roastery Sessions
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
