import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import atelierLogo from '../../assets/images/logo.webp';

export default function AuthModal({ onShowToast }) {
  const { isAuthModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeAuthModal();
    };
    if (isAuthModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setError('');
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill out all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register({ name, email, phone, password });
    setLoading(false);

    if (result.success) {
      if (onShowToast) onShowToast(`Welcome to Atelier Roasters, ${result.user.name}!`);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } else {
      setError(result.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !loginPassword) {
      setError('Please enter your email/mobile and password.');
      return;
    }

    setLoading(true);
    const result = await login(loginIdentifier, loginPassword);
    setLoading(false);

    if (result.success) {
      if (onShowToast) onShowToast(`Welcome back, ${result.user.name}!`);
      setLoginIdentifier('');
      setLoginPassword('');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={closeAuthModal}>
      <div
        className="relative max-w-md w-full bg-[#fff8f5] border border-[#ebdcd5] rounded-2xl shadow-2xl p-7 max-h-[92vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="close-button absolute top-5 right-5"
          aria-label="Close modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <img
            src={atelierLogo}
            alt="Atelier Logo"
            className="w-14 h-14 rounded-full mx-auto object-cover border border-[#dcc1b8] shadow-xs"
          />
          <h3 className="font-['Playfair_Display',serif] text-2xl font-bold text-[#1f1b18]">
            {authModalTab === 'login' ? 'Patron Sign In' : 'Join Atelier Guild'}
          </h3>
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] max-w-xs mx-auto">
            {authModalTab === 'login'
              ? 'Access your orders, personalized roasts, and seat-side service.'
              : 'Create an account to save past orders and unlock curated cupping privileges.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f6ece7] p-1 rounded-full border border-[#ebdcd5] mb-5">
          <button
            type="button"
            onClick={() => { setAuthModalTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-['Plus_Jakarta_Sans',sans-serif] font-bold rounded-full transition-all border-0 cursor-pointer ${
              authModalTab === 'login'
                ? 'bg-[#a34824] text-white shadow-xs'
                : 'bg-transparent text-[#665c55] hover:text-[#1f1b18]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-['Plus_Jakarta_Sans',sans-serif] font-bold rounded-full transition-all border-0 cursor-pointer ${
              authModalTab === 'register'
                ? 'bg-[#a34824] text-white shadow-xs'
                : 'bg-transparent text-[#665c55] hover:text-[#1f1b18]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-['Plus_Jakarta_Sans',sans-serif]">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {authModalTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Email Address or Mobile Number</span>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="e.g. aarav@example.com or 9876543210"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Password</span>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.01] shadow-sm border-0 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Sign-Up Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Full Name *</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Mobile Number * (for order updates)</span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Email Address *</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <label className="block space-y-1 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
              <span>Password * (min 6 characters, encrypted)</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.01] shadow-sm border-0 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="pt-4 text-center">
          <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a] m-0">
            Protected with bcrypt salt hashing · Saved directly to MongoDB Atlas
          </p>
        </div>
      </div>
    </div>
  );
}
