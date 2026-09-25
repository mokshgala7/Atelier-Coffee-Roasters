import { useEffect, useState } from 'react';

export default function AddReviewModal({ isOpen, onClose, onAddReview }) {
	const [author, setAuthor] = useState('');
	const [publication, setPublication] = useState('');
	const [quote, setQuote] = useState('');
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(5);
	const [favoriteItem, setFavoriteItem] = useState('');

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) {
			window.addEventListener('keydown', handleKeyDown);
		}
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!author.trim() || !quote.trim()) return;

		const newReview = {
			id: Date.now().toString(),
			author: author.trim(),
			publication: publication.trim() || 'Verified Guest',
			quote: quote.startsWith('“') ? quote.trim() : `“${quote.trim()}”`,
			rating,
			favoriteItem: favoriteItem.trim() || undefined,
			date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
		};

		onAddReview(newReview);
		setAuthor('');
		setPublication('');
		setQuote('');
		setRating(5);
		setFavoriteItem('');
		onClose();
	};

	const ratingLabels = {
		1: 'Subtle (1★)',
		2: 'Developing (2★)',
		3: 'Harmonious (3★)',
		4: 'Superb (4★)',
		5: 'Exceptional (5★)'
	};

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<div
				className="relative max-w-lg w-full bg-[#fff8f5] border border-[#ebdcd5] rounded-2xl shadow-2xl p-7 max-h-[90vh] overflow-y-auto"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					className="close-button absolute top-5 right-5"
					aria-label="Close review modal"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold text-[#a34824] uppercase tracking-wider block">
							Share Your Palate
						</span>
						<h3 className="font-['Playfair_Display',serif] text-2xl text-[#1f1b18] mt-1">
							Add an Atelier Review
						</h3>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-1">
							Your cupping impressions will appear live in our guest testimonials and saved to our database.
						</p>
					</div>

					{/* Star Rating Picker */}
					<div className="space-y-1.5">
						<label className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c] block">
							Sensory Rating ({ratingLabels[hoverRating || rating]})
						</label>
						<div className="flex items-center gap-2">
							{[1, 2, 3, 4, 5].map((star) => (
								<button
									key={star}
									type="button"
									onClick={() => setRating(star)}
									onMouseEnter={() => setHoverRating(star)}
									onMouseLeave={() => setHoverRating(rating)}
									className="p-1 text-[#a34824] hover:scale-125 transition-transform bg-transparent border-0 cursor-pointer"
									title={`${star} Star`}
								>
									<span
										className="material-symbols-outlined text-[28px]"
										style={{
											fontVariationSettings: (hoverRating || rating) >= star ? "'FILL' 1" : "'FILL' 0"
										}}
									>
										star
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Name & Role Inputs */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
							<span>Your Name *</span>
							<input
								type="text"
								required
								value={author}
								onChange={(e) => setAuthor(e.target.value)}
								placeholder="e.g. Priya Sharma"
								className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
							/>
						</label>

						<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
							<span>Role or Designation</span>
							<input
								type="text"
								value={publication}
								onChange={(e) => setPublication(e.target.value)}
								placeholder="e.g. Specialty Coffee Lover"
								className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
							/>
						</label>
					</div>

					{/* Favorite Drink */}
					<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
						<span>Favorite Drink / Bake (Optional)</span>
						<input
							type="text"
							value={favoriteItem}
							onChange={(e) => setFavoriteItem(e.target.value)}
							placeholder="e.g. Dirty Matcha · Artisanal Tiramisu"
							className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
						/>
					</label>

					{/* Review Text */}
					<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
						<span>Your Experience &amp; Notes *</span>
						<textarea
							required
							rows={4}
							value={quote}
							onChange={(e) => setQuote(e.target.value)}
							placeholder="Share your thoughts on the roast profiles, ambiance, or pairing notes..."
							className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e] resize-none"
						/>
					</label>

					{/* Action Buttons */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 py-3 rounded-full bg-[#f6ece7] hover:bg-[#ebdcd5] text-[#56423c] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="flex-1 py-3 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-sm border-0 cursor-pointer"
						>
							Publish Review
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
