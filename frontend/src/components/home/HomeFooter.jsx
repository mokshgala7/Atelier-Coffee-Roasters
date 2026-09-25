import { useState } from 'react';
import atelierLogo from '../../assets/images/logo.webp';

export default function HomeFooter({ onShowToast, onNavigate }) {
	const [email, setEmail] = useState('');

	const handleSubscribe = (e) => {
		e.preventDefault();
		if (!email.trim() || !email.includes('@')) {
			onShowToast('Please enter a valid email address');
			return;
		}
		onShowToast(`Subscribed ${email} to Atelier Roastery Dispatch`);
		setEmail('');
	};

	return (
		<footer className="w-full bg-[#fbf2ec] text-[#56423c] border-t border-[#ebddd4]">
			<div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-[#ebddd4]/70">
					{/* Brand Column */}
					<div className="lg:col-span-2 space-y-4">
						<div className="flex items-center gap-3">
							<img
								src={atelierLogo}
								alt="Atelier Coffee Roasters Logo"
								className="w-10 h-10 rounded-full object-cover border border-[#ebdcd5] shadow-2xs"
							/>
							<span className="font-['Playfair_Display',serif] text-xl font-semibold text-[#84310e]">
								Atelier Roasters
							</span>
						</div>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] max-w-sm leading-relaxed">
							Dedicated to the mindful craft of single-origin terroir, small-batch profiling, and tactile sensory rituals. Sourced with integrity, roasted with architectural precision.
						</p>
						<div className="flex items-center gap-3 pt-1">
							<button
								type="button"
								onClick={() => onNavigate('menu')}
								className="w-9 h-9 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center text-[#56423c] hover:bg-[#84310e] hover:text-white transition-colors cursor-pointer"
								title="Explore Menu"
							>
								<span className="material-symbols-outlined text-[18px]">coffee</span>
							</button>
							<a
								href="http://google.com/maps/place/SVKM's+Shri+Bhagubhai+Mafatlal+Polytechnic+and+College+of+Engineering/@19.1076102,72.8378213,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9c651c56f9b:0xc32173e36e9d804f!8m2!3d19.1076102!4d72.8378213!16s%2Fm%2F0cr51bd?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D"
								target="_blank"
								rel="noopener noreferrer"
								className="w-9 h-9 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center text-[#56423c] hover:bg-[#84310e] hover:text-white transition-colors"
								title="SVKM Campus Location"
							>
								<span className="material-symbols-outlined text-[18px]">storefront</span>
							</a>
							<button
								type="button"
								onClick={() => {
									const el = document.getElementById('roasting-philosophy');
									if (el) el.scrollIntoView({ behavior: 'smooth' });
								}}
								className="w-9 h-9 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center text-[#56423c] hover:bg-[#84310e] hover:text-white transition-colors cursor-pointer"
								title="Roasting Philosophy"
							>
								<span className="material-symbols-outlined text-[18px]">menu_book</span>
							</button>
						</div>
					</div>

					{/* Locations Column */}
					<div className="space-y-3">
						<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18] uppercase tracking-wider">
							Atelier Locations
						</h4>
						<ul className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] list-none p-0 m-0">
							<li className="font-semibold text-[#1f1b18]">The Roastery Pavilion</li>
							<li>SVKM&apos;s College Campus</li>
							<li>Vile Parle West, Mumbai 400056</li>
							<li className="pt-2 font-semibold text-[#1f1b18]">The Courtyard Atelier</li>
							<li>Opposite Cooper Hospital, Irla</li>
							<li>Mumbai 400056</li>
						</ul>
					</div>

					{/* Hours Column */}
					<div className="space-y-3">
						<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18] uppercase tracking-wider">
							Hours &amp; Rituals
						</h4>
						<ul className="space-y-2 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] list-none p-0 m-0">
							<li>
								<span className="font-semibold text-[#1f1b18]">Monday – Sunday</span>
								<br />
								07:00 AM – 11:59 PM
							</li>
							<li className="pt-1">
								<span className="font-semibold text-[#a34824]">Live Roasting Sessions</span>
								<br />
								Tue &amp; Fri mornings
							</li>
						</ul>
					</div>

					{/* Newsletter Column */}
					<div className="space-y-3">
						<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18] uppercase tracking-wider">
							Roastery Dispatch
						</h4>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-normal">
							Receive monthly harvest arrivals, cupping notes, and private tastings.
						</p>
						<form onSubmit={handleSubscribe} className="space-y-2">
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								placeholder="Enter your email"
								className="w-full px-3.5 py-2.5 rounded-lg bg-[#fff8f5] border border-[#ebdcd5] text-[#1f1b18] placeholder:text-[#89726a] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
							/>
							<button
								type="submit"
								className="w-full px-4 py-2.5 rounded-lg bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider uppercase transition-colors border-0 cursor-pointer shadow-xs"
							>
								Subscribe to Dispatch
							</button>
						</form>
					</div>
				</div>

				{/* Bottom Legal / Copyright */}
				<div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55]">
					<p className="m-0">© 2025 Atelier Roasters Ltd. Mindfully crafted specialty coffee.</p>
					<div className="flex items-center gap-6">
						<button
							type="button"
							onClick={() => onShowToast('Provenance: 100% ethically sourced single-origin Arabica from Karnataka, Kerala & Ethiopia')}
							className="bg-transparent border-0 p-0 text-[#665c55] hover:text-[#1f1b18] cursor-pointer"
						>
							Provenance &amp; Ethics
						</button>
						<button
							type="button"
							onClick={() => onShowToast('Privacy: We respect your sensory and digital space. No tracking.')}
							className="bg-transparent border-0 p-0 text-[#665c55] hover:text-[#1f1b18] cursor-pointer"
						>
							Privacy Policy
						</button>
						<button
							type="button"
							onClick={() => onShowToast('Hospitality: Artisanal table service with warm intention')}
							className="bg-transparent border-0 p-0 text-[#665c55] hover:text-[#1f1b18] cursor-pointer"
						>
							Terms of Hospitality
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
}
