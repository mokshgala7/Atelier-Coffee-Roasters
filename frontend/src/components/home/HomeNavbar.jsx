import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import atelierLogo from '../../assets/images/logo.webp';

export default function HomeNavbar({ activePage, onNavigate, onOpenCart }) {
	const { items } = useCart();
	const { user, isAuthenticated, openAuthModal } = useAuth();
	const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

	const handleScrollTo = (sectionId) => {
		if (activePage !== 'home') {
			onNavigate('home');
			setTimeout(() => {
				const el = document.getElementById(sectionId);
				if (el) el.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		} else {
			const el = document.getElementById(sectionId);
			if (el) el.scrollIntoView({ behavior: 'smooth' });
		}
	};

	return (
		<header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#fff8f5]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#ebddd4]/60">
			<div className="h-20 max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between gap-6">
				{/* Brand Logo */}
				<button
					type="button"
					onClick={() => onNavigate('home')}
					className="flex items-center gap-3 text-left bg-transparent border-0 p-0 cursor-pointer group"
				>
					<img
						src={atelierLogo}
						alt="Atelier Coffee Roasters Logo"
						className="w-11 h-11 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform border border-[#dcc1b8]/50"
					/>
					<div className="flex flex-col">
						<span className="font-['Playfair_Display',serif] text-xl font-semibold text-[#84310e] tracking-tight leading-none group-hover:text-[#a34824] transition-colors">
							Atelier Roasters
						</span>
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#665c55] uppercase tracking-widest mt-1">
							Single-Origin Atelier
						</span>
					</div>
				</button>

				{/* Desktop Navigation Links */}
				<nav className="hidden lg:flex items-center gap-2">
					<button
						type="button"
						onClick={() => onNavigate('home')}
						className={`transition-all font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold rounded-full py-1.5 px-4 border-0 cursor-pointer ${
							activePage === 'home'
								? 'bg-[#ebddd4] text-[#1f1b18]'
								: 'bg-transparent text-[#56423c] hover:text-[#1f1b18] hover:bg-[#f6ece7]'
						}`}
					>
						Home
					</button>
					<button
						type="button"
						onClick={() => handleScrollTo('roasting-philosophy')}
						className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#56423c] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-all rounded-full py-1.5 px-3 border-0 bg-transparent cursor-pointer"
					>
						Story &amp; Roastery
					</button>
					<button
						type="button"
						onClick={() => onNavigate('menu')}
						className={`transition-all font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold rounded-full py-1.5 px-4 border-0 cursor-pointer ${
							activePage === 'menu'
								? 'bg-[#ebddd4] text-[#1f1b18]'
								: 'bg-transparent text-[#56423c] hover:text-[#1f1b18] hover:bg-[#f6ece7]'
						}`}
					>
						Menu
					</button>
					<button
						type="button"
						onClick={() => handleScrollTo('visit-roastery')}
						className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-medium text-[#56423c] hover:text-[#1f1b18] hover:bg-[#f6ece7] transition-all rounded-full py-1.5 px-3 border-0 bg-transparent cursor-pointer"
					>
						Locations &amp; Hours
					</button>
				</nav>

				{/* Right Side CTAs */}
				<div className="flex items-center gap-3">
					{/* Sign In / User Profile Pill */}
					{isAuthenticated ? (
						<button
							type="button"
							onClick={() => onNavigate('profile')}
							className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f6ece7] hover:bg-[#ebdcd5] text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold border border-[#ebdcd5] cursor-pointer transition-colors"
						>
							<span className="material-symbols-outlined text-[16px]">account_circle</span>
							<span>{user.name?.split(' ')[0]}</span>
						</button>
					) : (
						<button
							type="button"
							onClick={() => openAuthModal('login')}
							className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#f6ece7] hover:bg-[#ebdcd5] text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold border border-[#ebdcd5] cursor-pointer transition-colors"
						>
							<span className="material-symbols-outlined text-[16px]">login</span>
							<span>Sign In</span>
						</button>
					)}

					{/* Order Online Button */}
					<button
						type="button"
						onClick={() => onNavigate('menu')}
						className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow-sm transition-all transform hover:scale-[1.02] border-0 cursor-pointer"
					>
						Order Online
					</button>

					{/* Cart Trigger Button */}
					<button
						type="button"
						onClick={onOpenCart}
						className="relative w-9 h-9 rounded-full bg-[#f6ece7] hover:bg-[#84310e] text-[#84310e] hover:text-white flex items-center justify-center transition-all border border-[#ebdcd5] cursor-pointer flex-shrink-0"
						aria-label="Open cart"
					>
						<span className="material-symbols-outlined text-[20px]">shopping_bag</span>
						{totalCount > 0 && (
							<span className="absolute -top-1 -right-1 bg-[#84310e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
								{totalCount}
							</span>
						)}
					</button>
				</div>
			</div>
		</header>
	);
}
