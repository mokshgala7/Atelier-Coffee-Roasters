export default function RoastingPhilosophy() {
	return (
		<section className="w-full bg-[#f6ece7] py-20 lg:py-28" id="roasting-philosophy">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Story Column */}
					<div className="lg:col-span-6 space-y-6">
						<div className="space-y-2">
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest">
								Our Sacred Standard
							</span>
							<h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl lg:text-5xl text-[#1f1b18] leading-tight">
								From Highland Terroir <br />
								<span className="italic font-normal">to First Pour.</span>
							</h2>
						</div>

						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-base text-[#665c55] leading-relaxed">
							We source exclusively from single-estate smallholders across Yirgacheffe, Huehuetenango, and Coorg. Every batch is roasted in our vintage cast-iron drum roaster, developing nuanced notes of stone fruit, caramelized amber, and dark cacao.
						</p>

						<div className="space-y-5 pt-2">
							{/* Item 1 */}
							<div className="flex items-start gap-4">
								<div className="w-11 h-11 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center flex-shrink-0 text-[#a34824] shadow-xs">
									<span className="material-symbols-outlined text-[22px]">handshake</span>
								</div>
								<div className="space-y-1">
									<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
										Single-Origin Sourcing
									</h4>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] leading-normal">
										Direct trade partnerships that honor producers with above-market premiums and guaranteed regenerative soil practices.
									</p>
								</div>
							</div>

							{/* Item 2 */}
							<div className="flex items-start gap-4">
								<div className="w-11 h-11 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center flex-shrink-0 text-[#a34824] shadow-xs">
									<span className="material-symbols-outlined text-[22px]">science</span>
								</div>
								<div className="space-y-1">
									<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
										Precision Cupping
									</h4>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] leading-normal">
										Daily morning cupping rituals to track development curves, moisture loss, and bean density before release.
									</p>
								</div>
							</div>

							{/* Item 3 */}
							<div className="flex items-start gap-4">
								<div className="w-11 h-11 rounded-full bg-[#fff8f5] border border-[#ebdcd5] flex items-center justify-center flex-shrink-0 text-[#a34824] shadow-xs">
									<span className="material-symbols-outlined text-[22px]">eco</span>
								</div>
								<div className="space-y-1">
									<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-semibold text-[#1f1b18]">
										Sustainable Roasting
									</h4>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] leading-normal">
										Low-emission catalytic reburners, zero synthetic additives, and coffee chaff repurposed for suburban compost.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Visual Roastery Display */}
					<div className="lg:col-span-6 relative">
						<div className="relative rounded-2xl overflow-hidden shadow-xl bg-[#eae1db] border border-[#dcc1b8]/60 group">
							<img
								alt="Atelier Roastery and Cupping Table"
								className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuAccycV5Ag4lHLpQiuMBir6odBa2bDi4PwDbxtMUTYDSKyx4s8eCOPz8UjupSCjlcVOq37tOxwdZRvwnZRe25RX-TnyozRK3Noy5RKBP5iF9L_1rCH8DiOK8nrPQaMt1OQnSsS6P0cZrbfa77ah97401vHpaD9GWkASwjoJIUtmNAqPfsnmubDr2HeRBNZe0wT6XNJedTN3Be1Cw8nk5AzyYRJ0ryCJSdpXgK6gahF_xrQJDkn5sI_Y"
							/>
							{/* Overlaid Live Profile Badge */}
							<div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-[#fff8f5]/90 backdrop-blur-md shadow-md border border-[#ebdcd5] flex items-center justify-between">
								<div>
									<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#a34824] font-bold uppercase tracking-wider block">
										Live Profile
									</span>
									<span className="font-['Plus_Jakarta_Sans',sans-serif] text-sm sm:text-base font-semibold text-[#1f1b18]">
										Batch No. 842 — Coorg Honey Process
									</span>
								</div>
								<span className="px-3 py-1 rounded-full bg-[#ebddd4] text-[#56423c] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold">
									In Roaster
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
