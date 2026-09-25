export default function HeroSection({ onNavigate, onOpenTastingModal }) {
	return (
		<section className="relative w-full overflow-hidden bg-[#fbf2ec] min-h-[92vh] flex items-center justify-center">
			{/* Cinematic Hero Background */}
			<div
				className="absolute inset-0 z-0 bg-cover bg-center"
				style={{
					backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9q-yOmPyvnRJ3o_HDsdXR0UmwHmRJ0oGi8lltSRbt88yVQCRHvckvzp4gDzyfYf2BG9qmCR_Q-oLdIvCYFevtQWJpKZx06IngKnyhQa4OBpLrp8_5bacAoFakSMDKZ-lig-dFcH2T8-fOeGo2J-apo_Cy7o-uKMgzwj5B3LzA23DZQ8K4YRJKo1P2tlqC4CXDj-bGIgv0eSHwdDzM_IcDszXVOzPm-FVxO57psuFzkWr9S9aTFh2J')`
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-[#fff8f5] via-[#fff8f5]/90 to-[#fff8f5]/40" />
				<div className="absolute inset-0 bg-gradient-to-t from-[#fff8f5] via-transparent to-transparent" />
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28 flex flex-col justify-center w-full">
				<div className="max-w-2xl space-y-6">
					{/* Atelier Pill Tag */}
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ebddd4]/80 backdrop-blur-md text-[#6b615a]">
						<span className="w-2 h-2 rounded-full bg-[#a34824] animate-pulse" />
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold uppercase tracking-widest text-[#a34824]">
							Single-Origin Roastery &amp; Tea Atelier
						</span>
					</div>

					{/* Editorial Headline */}
					<h1 className="font-['Playfair_Display',serif] text-4xl sm:text-5xl lg:text-6xl text-[#1f1b18] tracking-tight leading-[1.15]">
						Crafted with Reverence. <br />
						<span className="italic font-normal text-[#a34824]">Roasted by Hand.</span>
					</h1>

					{/* Sensory Subtext */}
					<p className="font-['Plus_Jakarta_Sans',sans-serif] text-base sm:text-lg text-[#665c55] max-w-xl leading-relaxed">
						Single-origin micro-lots, ceremonial Japanese matchas, and handcrafted European patisserie — roasted on-site and served with artisanal intention.
					</p>

					{/* Interactive Action Buttons */}
					<div className="flex flex-wrap items-center gap-4 pt-2">
						<button
							type="button"
							onClick={() => onNavigate('menu')}
							className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] border-0 cursor-pointer"
						>
							Explore The Menu
							<span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
						</button>

						<button
							type="button"
							onClick={onOpenTastingModal}
							className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-[#f0e6e1]/80 hover:bg-[#eae1db] backdrop-blur-sm text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold transition-all border border-[#dcc1b8] cursor-pointer"
						>
							Reserve a Tasting Experience
						</button>
					</div>

					{/* Pillar Micro-Badges */}
					<div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="flex items-center gap-2.5 bg-[#fff8f5]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#ebdcd5] shadow-xs">
							<span className="material-symbols-outlined text-[#a34824] text-[20px]">verified</span>
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#1f1b18]">
								100% Arabica Micro-Lots
							</span>
						</div>
						<div className="flex items-center gap-2.5 bg-[#fff8f5]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#ebdcd5] shadow-xs">
							<span className="material-symbols-outlined text-[#a34824] text-[20px]">local_fire_department</span>
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#1f1b18]">
								Small-Batch Drum Roasted
							</span>
						</div>
						<div className="flex items-center gap-2.5 bg-[#fff8f5]/85 backdrop-blur-md p-3.5 rounded-xl border border-[#ebdcd5] shadow-xs">
							<span className="material-symbols-outlined text-[#a34824] text-[20px]">qr_code_scanner</span>
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#1f1b18]">
								Table QR &amp; Online Order
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
