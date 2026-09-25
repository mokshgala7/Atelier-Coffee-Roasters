export default function TestimonialsSection() {
	const testimonials = [
		{
			quote: '“The Dirty Matcha paired with the house Tiramisu represents the finest sensory morning ritual in the city.”',
			author: 'Aarav Mehta',
			publication: 'Specialty Coffee Chronicle'
		},
		{
			quote: '“An architectural jewel. The ability to scan a quiet bronze puck at the table and have single-origin pour-overs arrive warm is extraordinary.”',
			author: 'Devika Rao',
			publication: 'Architectural Gastronomy'
		},
		{
			quote: '“Their Yirgacheffe washed lot extracted on the Slayer has an unmatched clarity of jasmine and bergamot. Flawless roasting.”',
			author: 'Kabir Singhania',
			publication: 'Q-Grader & Roaster Guild'
		}
	];

	return (
		<section className="w-full bg-[#fff8f5] py-20 lg:py-24">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{testimonials.map((item, index) => (
						<div
							key={index}
							className="space-y-4 p-7 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] hover:shadow-md transition-all flex flex-col justify-between"
						>
							<div className="space-y-3">
								<div className="flex items-center gap-1 text-[#a34824]">
									{[...Array(5)].map((_, starIndex) => (
										<span key={starIndex} className="material-symbols-outlined text-[18px]">
											star
										</span>
									))}
								</div>
								<p className="font-['Playfair_Display',serif] text-lg sm:text-xl text-[#1f1b18] leading-snug">
									{item.quote}
								</p>
							</div>

							<div className="pt-2 border-t border-[#ebddd4]/60">
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18]">
									{item.author}
								</p>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55]">
									{item.publication}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
