import { useEffect, useState } from 'react';
import AddReviewModal from './AddReviewModal';

const defaultTestimonials = [
	{
		id: '1',
		quote: '“The Dirty Matcha paired with the house Tiramisu represents the finest sensory morning ritual in the city.”',
		author: 'Aarav Mehta',
		publication: 'Specialty Coffee Chronicle',
		rating: 5,
		favoriteItem: 'Dirty Matcha · Artisanal Tiramisu'
	},
	{
		id: '2',
		quote: '“An architectural jewel. The ability to scan a quiet bronze puck at the table and have single-origin pour-overs arrive warm is extraordinary.”',
		author: 'Devika Rao',
		publication: 'Architectural Gastronomy',
		rating: 5,
		favoriteItem: 'Single-Origin Pour-over'
	},
	{
		id: '3',
		quote: '“Their Yirgacheffe washed lot extracted on the Slayer has an unmatched clarity of jasmine and bergamot. Flawless roasting.”',
		author: 'Kabir Singhania',
		publication: 'Q-Grader & Roaster Guild',
		rating: 5,
		favoriteItem: 'Yirgacheffe Washed Lot'
	}
];

export default function TestimonialsSection({ onShowToast }) {
	const [reviews, setReviews] = useState(() => {
		try {
			const saved = localStorage.getItem('atelier_reviews');
			return saved ? JSON.parse(saved) : defaultTestimonials;
		} catch (e) {
			return defaultTestimonials;
		}
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		try {
			localStorage.setItem('atelier_reviews', JSON.stringify(reviews));
		} catch (e) {
			console.warn('Unable to save reviews to localStorage', e);
		}
	}, [reviews]);

	const handleAddReview = (newReview) => {
		// Prepend newly added review so it immediately appears at the front
		setReviews((prev) => [newReview, ...prev]);

		if (onShowToast) {
			onShowToast(`Thank you, ${newReview.author}! Your review is now published.`);
		}

		// FUTURE MONGODB SYNC HOOK:
		// When the user provides the MongoDB URI / API route:
		// fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newReview) })
		//   .catch(err => console.error('MongoDB sync error:', err));
	};

	return (
		<section className="w-full bg-[#fff8f5] py-20 lg:py-24" id="testimonials-section">
			<div className="max-w-7xl mx-auto px-6 lg:px-12">
				{/* Section Header with "Add a Review" button */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10">
					<div className="space-y-1.5">
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#a34824] uppercase tracking-widest block">
							Guest Voices &amp; Editorial
						</span>
						<h2 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl text-[#1f1b18]">
							Community &amp; Cupping Notes
						</h2>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] max-w-lg">
							Real sensory impressions from visiting Q-graders, culinary critics, and café patrons.
						</p>
					</div>

					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow-sm transition-all transform hover:scale-[1.02] border-0 cursor-pointer flex-shrink-0"
					>
						<span className="material-symbols-outlined text-[18px] mr-1.5">rate_review</span>
						Add a Review
					</button>
				</div>

				{/* Review Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{reviews.map((item) => (
						<article
							key={item.id}
							className="space-y-4 p-7 rounded-2xl bg-[#fbf2ec] border border-[#ebdcd5] hover:shadow-md transition-all flex flex-col justify-between"
						>
							<div className="space-y-3">
								{/* Star Rating */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-1 text-[#a34824]">
										{[...Array(item.rating || 5)].map((_, starIndex) => (
											<span
												key={starIndex}
												className="material-symbols-outlined text-[18px]"
												style={{ fontVariationSettings: "'FILL' 1" }}
											>
												star
											</span>
										))}
									</div>
									{item.date && (
										<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] text-[#89726a]">
											{item.date}
										</span>
									)}
								</div>

								{/* Quote */}
								<p className="font-['Playfair_Display',serif] text-lg sm:text-xl text-[#1f1b18] leading-snug">
									{item.quote}
								</p>

								{/* Optional Favorite Drink Badge */}
								{item.favoriteItem && (
									<div className="pt-1">
										<span className="inline-block px-2.5 py-1 rounded-full bg-[#f6ece7] text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-semibold">
											☕ {item.favoriteItem}
										</span>
									</div>
								)}
							</div>

							<div className="pt-3 border-t border-[#ebddd4]/70">
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-bold text-[#1f1b18] m-0">
									{item.author}
								</p>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] m-0 mt-0.5">
									{item.publication}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>

			{/* Add Review Interactive Modal */}
			<AddReviewModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAddReview={handleAddReview}
			/>
		</section>
	);
}
