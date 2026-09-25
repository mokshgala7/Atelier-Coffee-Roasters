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
import PageTransition from './components/common/PageTransition';

function AppContent() {
	const [activePage, setActivePage] = useState('home');
	const [cartOpen, setCartOpen] = useState(false);
	const [toastText, setToastText] = useState('');
	const [showToast, setShowToast] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const [transitionMsg, setTransitionMsg] = useState('Roasting Fresh Beans');

	const triggerToast = (msg) => {
		setToastText(msg);
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 3500);
	};

	// Trigger on reload / initial page load
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsTransitioning(false);
		}, 1400);
		return () => clearTimeout(timer);
	}, []);

	// Handle browser back/forward or direct hash entry
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace('#', '');
			let target = activePage;
			if (
				hash === 'menu' ||
				hash.includes('coffee') ||
				hash.includes('tea') ||
				hash.includes('dessert') ||
				hash.includes('brownie') ||
				hash.includes('matcha') ||
				hash.includes('shake') ||
				hash.includes('mocktail') ||
				hash.includes('chocolate')
			) {
				target = 'menu';
			} else if (hash === 'checkout') {
				target = 'checkout';
			} else if (hash === 'profile' || hash === 'orders') {
				target = 'profile';
			} else if (hash === 'home' || hash === '' || hash === 'roasting-philosophy' || hash === 'visit-roastery') {
				target = 'home';
			}

			if (target !== activePage) {
				if (target === 'menu') {
					setIsTransitioning(true);
					setTransitionMsg('Artisanal Selections');
					setActivePage(target);
					setTimeout(() => {
						setIsTransitioning(false);
					}, 1200);
				} else {
					setActivePage(target);
				}
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, [activePage]);

	const navigate = (page) => {
		if (page === activePage) return;

		// Video pop-up only plays when going to the menu
		if (page === 'menu') {
			setIsTransitioning(true);
			setTransitionMsg('Artisanal Selections');

			setTimeout(() => {
				setActivePage(page);
				window.location.hash = page;
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}, 200);

			setTimeout(() => {
				setIsTransitioning(false);
			}, 1250);
		} else {
			// Instant navigation for all other pages without video pop-up
			setActivePage(page);
			window.location.hash = page === 'home' ? '' : page;
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
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

			{/* Global Cinematic Coffee Transition Video Overlay */}
			<PageTransition active={isTransitioning} message={transitionMsg} />
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
