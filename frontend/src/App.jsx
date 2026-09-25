import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import HomeNavbar from './components/home/HomeNavbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import CartDrawer from './components/cart/CartDrawer';
import AuthModal from './components/auth/AuthModal';

function AppContent() {
	const [activePage, setActivePage] = useState('home');
	const [cartOpen, setCartOpen] = useState(false);
	const [toastText, setToastText] = useState('');
	const [showToast, setShowToast] = useState(false);

	const triggerToast = (msg) => {
		setToastText(msg);
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 3500);
	};

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace('#', '');
			if (hash === 'menu') {
				setActivePage('menu');
			} else if (hash === 'checkout') {
				setActivePage('checkout');
			} else if (hash === 'profile' || hash === 'orders') {
				setActivePage('profile');
			} else if (hash === 'home' || hash === '') {
				setActivePage('home');
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		handleHashChange();
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const navigate = (page) => {
		setActivePage(page);
		window.location.hash = page === 'home' ? '' : page;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<div className="min-h-screen bg-[#fff8f5]">
			{/* Toast Notification Banner */}
			<div
				className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-2.5 bg-[#342f2c] text-[#f9efe9] px-5 py-3 rounded-full shadow-2xl ${
					showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
				}`}
				id="toast-banner"
			>
				<span className="material-symbols-outlined text-[#ffdbcf] text-[20px]">check_circle</span>
				<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#f9efe9]">
					{toastText}
				</span>
			</div>

			{/* Persistent Luxury Navigation Header */}
			<HomeNavbar
				activePage={activePage}
				onNavigate={navigate}
				onOpenCart={() => setCartOpen(true)}
			/>

			{/* Active View Router */}
			{activePage === 'home' && (
				<Home
					onNavigate={navigate}
					onOpenCart={() => setCartOpen(true)}
					onShowToast={triggerToast}
				/>
			)}

			{activePage === 'menu' && (
				<Menu
					onNavigate={navigate}
					onOpenCart={() => setCartOpen(true)}
					onShowToast={triggerToast}
				/>
			)}

			{activePage === 'checkout' && (
				<Checkout
					onNavigate={navigate}
					onShowToast={triggerToast}
				/>
			)}

			{activePage === 'profile' && (
				<Profile
					onNavigate={navigate}
					onShowToast={triggerToast}
				/>
			)}

			{/* Global Interactive Cart Drawer */}
			<CartDrawer
				isOpen={cartOpen}
				onClose={() => setCartOpen(false)}
				onNavigate={navigate}
			/>

			{/* Global Authentication Modal (Sign In / Register) */}
			<AuthModal onShowToast={triggerToast} />
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<AppContent />
			</CartProvider>
		</AuthProvider>
	);
}
