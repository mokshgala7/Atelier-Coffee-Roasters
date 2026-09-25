export default function VisitRoastery() {
	const collegeName = "SVKM's Shri Bhagubhai Mafatlal Polytechnic and College of Engineering";
	const collegeAddress = "Irla, N. R. G. Marg, Opposite Cooper Hospital, JVPD Scheme, Vile Parle West, Mumbai, Maharashtra 400056";
	const mapsUrl = "http://google.com/maps/place/SVKM's+Shri+Bhagubhai+Mafatlal+Polytechnic+and+College+of+Engineering/@19.1076102,72.8378213,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7c9c651c56f9b:0xc32173e36e9d804f!8m2!3d19.1076102!4d72.8378213!16s%2Fm%2F0cr51bd?entry=ttu&g_ep=EgoyMDI2MDkyMi4wIKXMDSoASAFQAw%3D%3D";

	return (
		<section className="w-full bg-[#fbf2ec] py-20 lg:py-28" id="visit-roastery">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Left Information Column */}
					<div className="lg:col-span-5 space-y-6">
						<div className="space-y-2">
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest">
								Sanctuary of Craft
							</span>
							<h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl text-[#1f1b18]">
								Visit the Roastery
							</h2>
							<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm sm:text-base text-[#665c55] leading-relaxed">
								Step inside our sunlit pavilion where you can smell green lots arriving, observe roasting profiles in motion, and converse directly with our roasting guild.
							</p>
						</div>

						{/* Info Card */}
						<div className="p-6 rounded-2xl bg-[#fff8f5] border border-[#ebdcd5] shadow-xs space-y-5">
							{/* Location Row */}
							<div className="flex items-start gap-3.5">
								<div className="w-9 h-9 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="material-symbols-outlined text-[20px]">pin_drop</span>
								</div>
								<div>
									<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18]">
										{collegeName}
									</h4>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-0.5 leading-normal">
										{collegeAddress}
									</p>
								</div>
							</div>

							{/* Opening Hours Row */}
							<div className="flex items-start gap-3.5">
								<div className="w-9 h-9 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center flex-shrink-0 mt-0.5">
									<span className="material-symbols-outlined text-[20px]">schedule</span>
								</div>
								<div>
									<h4 className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18]">
										Opening Hours
									</h4>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-0.5">
										Monday – Sunday : 07:00 AM – 10:00 PM
									</p>
									<p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold text-[#a34824] mt-1">
										Live Roasting Sessions: Tue &amp; Fri mornings
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="pt-1">
							<a
								href={mapsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-6 py-3.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] inline-flex items-center gap-2 shadow-sm text-decoration-none"
							>
								<span className="material-symbols-outlined text-[18px]">directions</span>
								Get Directions
							</a>
						</div>
					</div>

					{/* Right Interactive Map Card */}
					<div className="lg:col-span-7">
						<a
							href={mapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="block group relative w-full h-96 lg:h-[460px] rounded-2xl bg-cover bg-center shadow-lg overflow-hidden border border-[#dcc1b8]"
							style={{
								backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZChcwT6msL7FcVEhM18Rx4BsXNhWX0rcrRtDWB9Sm_DpZ-wRj3T7Z9BazDat-Sfrc285j_HrGxpRJa9ivvNZpvP9fnRUXUNFwFDouaYFF91r1K8keckDnYzxzoB0Sly-McASOgFVxXf7Xd5-XUiCEyrUo1KAtsred4_ZrWwnnyvE3DqYqrL3Fi-eZr3tJKaLk3vwIIGvuHckeV7djJwK7EPujcUFFylXFEYygudX9OY2UOX-Rzi0H')`
							}}
							title="Click to open SVKM College campus location on Google Maps"
						>
							<div className="absolute inset-0 bg-[#84310e]/10 group-hover:bg-[#84310e]/5 transition-colors" />

							{/* Map Pin Marker */}
							<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
								<div className="w-12 h-12 rounded-full bg-[#a34824] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
									<span className="material-symbols-outlined text-[24px]">coffee</span>
								</div>
								<span className="mt-1 px-3 py-1 rounded-full bg-[#1f1b18]/90 text-white font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold tracking-wider uppercase shadow-md">
									Atelier Roasters @ SVKM
								</span>
							</div>

							{/* Overlaid Location Badge */}
							<div className="absolute bottom-6 left-6 right-6 sm:right-auto p-4 rounded-xl bg-[#fff8f5]/95 backdrop-blur-md shadow-md border border-[#ebdcd5] max-w-md group-hover:shadow-lg transition-shadow">
								<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#a34824] font-bold uppercase tracking-wider block">
									SVKM&apos;s Campus Atelier
								</span>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#1f1b18] mt-0.5">
									Opposite Cooper Hospital, JVPD Scheme, Vile Parle West
								</p>
								<div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#665c55]">
									<span className="material-symbols-outlined text-[14px] text-[#a34824]">open_in_new</span>
									<span>Click to open in Google Maps</span>
								</div>
							</div>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
