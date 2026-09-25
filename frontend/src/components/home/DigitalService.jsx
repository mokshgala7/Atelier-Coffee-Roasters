export default function DigitalService({ onNavigate }) {
	return (
		<section className="w-full bg-[#fff8f5] py-20 lg:py-28" id="digital-service">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				<div className="p-8 lg:p-14 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] shadow-xs">
					<div className="max-w-3xl mx-auto text-center space-y-2 mb-14">
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest">
							Effortless Hospitality
						</span>
						<h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl text-[#1f1b18]">
							Atelier Digital Table Service
						</h2>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-base text-[#665c55] max-w-2xl mx-auto leading-relaxed">
							Experience quiet luxury. Settle into any seat in our sunlit pavilion, scan your table marker, and let our baristas craft your order with no interruptions.
						</p>
					</div>

					{/* 4 Step Interactive Pathway */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Step 1 */}
						<div className="p-6 rounded-xl bg-[#fff8f5] border border-[#ebdcd5] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all">
							<div className="space-y-2">
								<span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#ffb59b]">
									01
								</span>
								<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
									Scan Table QR
								</h4>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-normal">
									Point your camera at the bronze disc on your table or browse on the web before arrival.
								</p>
							</div>
							<div className="pt-2 flex items-center text-[#a34824] text-[24px]">
								<span className="material-symbols-outlined">qr_code_scanner</span>
							</div>
						</div>

						{/* Step 2 */}
						<div className="p-6 rounded-xl bg-[#fff8f5] border border-[#ebdcd5] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all">
							<div className="space-y-2">
								<span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#ffb59b]">
									02
								</span>
								<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
									Customize Roast &amp; Milk
								</h4>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-normal">
									Select your extraction method, single-origin profile, oat/almond blends, and ice preferences.
								</p>
							</div>
							<div className="pt-2 flex items-center text-[#a34824] text-[24px]">
								<span className="material-symbols-outlined">tune</span>
							</div>
						</div>

						{/* Step 3 */}
						<div className="p-6 rounded-xl bg-[#fff8f5] border border-[#ebdcd5] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all">
							<div className="space-y-2">
								<span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#ffb59b]">
									03
								</span>
								<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
									Crafted in 10–12 Mins
								</h4>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-normal">
									Watch real-time status updates as our team doses, tamps, and plates fresh from the oven.
								</p>
							</div>
							<div className="pt-2 flex items-center text-[#a34824] text-[24px]">
								<span className="material-symbols-outlined">timer</span>
							</div>
						</div>

						{/* Step 4 */}
						<div className="p-6 rounded-xl bg-[#fff8f5] border border-[#ebdcd5] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all">
							<div className="space-y-2">
								<span className="font-['Playfair_Display',serif] text-2xl font-bold text-[#ffb59b]">
									04
								</span>
								<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
									Delivered to Seat
								</h4>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-normal">
									Served directly to your seat in handmade ceramic ware with complete origin notes.
								</p>
							</div>
							<div className="pt-2 flex items-center text-[#a34824] text-[24px]">
								<span className="material-symbols-outlined">table_bar</span>
							</div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
