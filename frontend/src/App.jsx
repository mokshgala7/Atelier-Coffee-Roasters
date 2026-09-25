import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import HomeNavbar from './components/home/HomeNavbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import CartDrawer from './components/cart/CartDrawer';
function AppContent() {
	const [activePage, setActivePage] = useState('home');
	const [cartOpen, setCartOpen] = useState(false);

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace('#', '');
			if (hash === 'menu') {
				setActivePage('menu');
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
			{/* Persistent Luxury Navigation Header */}
			<HomeNavbar
				activePage={activePage}
				onNavigate={navigate}
				onOpenCart={() => setCartOpen(true)}
			/>

			{/* Active View Router */}
			{activePage === 'home' ? (
				<Home
					onNavigate={navigate}
					onOpenCart={() => setCartOpen(true)}
				/>
			) : (
				<Menu
					onNavigate={navigate}
					onOpenCart={() => setCartOpen(true)}
				/>
			)}

			{/* Global Interactive Cart Drawer */}
			<CartDrawer
				isOpen={cartOpen}
				onClose={() => setCartOpen(false)}
			/>
		</div>
	);
}

export default function App() {
	return (
		<CartProvider>
			<AppContent />
		</CartProvider>
	);
}
