import { useEffect, useState } from 'react';

export default function TastingModal({ isOpen, onClose, onShowToast }) {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [guests, setGuests] = useState('2 Guests');
	const [session, setSession] = useState('Single-Origin Cupping (Coorg & Yirgacheffe)');
	const [slot, setSlot] = useState('Tomorrow · 11:00 AM');
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		const handleKey = (e) => {
			if (e.key === 'Escape') onClose();
		};
		if (isOpen) {
			window.addEventListener('keydown', handleKey);
		}
		return () => window.removeEventListener('keydown', handleKey);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim()) {
			onShowToast('Please enter your name');
			return;
		}
		setIsSubmitted(true);
		onShowToast(`Tasting table confirmed for ${name} (${guests})!`);
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
					aria-label="Close tasting modal"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				{!isSubmitted ? (
					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-bold text-[#a34824] uppercase tracking-wider block">
								Artisanal Reservation
							</span>
							<h3 className="font-['Playfair_Display',serif] text-2xl text-[#1f1b18] mt-1">
								Reserve a Tasting Experience
							</h3>
							<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-1">
								Hosted live at the SVKM Flagship Roastery Pavilion, Vile Parle West.
							</p>
						</div>

						{/* Session Selection */}
						<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
							<span>Tasting Experience</span>
							<select
								value={session}
								onChange={(e) => setSession(e.target.value)}
								className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
							>
								<option>Single-Origin Cupping (Coorg &amp; Yirgacheffe)</option>
								<option>Espresso Calibration &amp; Extraction Masterclass</option>
								<option>Ceremonial Japanese Matcha Whisking &amp; Pairing</option>
								<option>Sensory Patisserie &amp; Pour-over Flight</option>
							</select>
						</label>

						{/* Slot and Guests */}
						<div className="grid grid-cols-2 gap-3">
							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Session Time</span>
								<select
									value={slot}
									onChange={(e) => setSlot(e.target.value)}
									className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								>
									<option>Today · 04:00 PM</option>
									<option>Tomorrow · 11:00 AM</option>
									<option>Thursday · 11:00 AM (Cupping Day)</option>
									<option>Saturday · 11:00 AM (Live Roasting)</option>
									<option>Sunday · 04:30 PM (Sensory Hour)</option>
								</select>
							</label>

							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Party Size</span>
								<select
									value={guests}
									onChange={(e) => setGuests(e.target.value)}
									className="w-full px-3 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								>
									<option>1 Guest</option>
									<option>2 Guests</option>
									<option>3 Guests</option>
									<option>4 Guests</option>
									<option>Private Guild (6 Guests)</option>
								</select>
							</label>
						</div>

						{/* Guest Details */}
						<div className="space-y-3">
							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Full Name</span>
								<input
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g. Aarav Sharma"
									className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								/>
							</label>

							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Phone Number</span>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="+91 98765 43210"
									className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								/>
							</label>
						</div>

						<div className="p-3 bg-[#fbf2ec] rounded-xl border border-[#ebdcd5] flex items-center gap-3">
							<span className="material-symbols-outlined text-[#a34824] text-[20px]">location_on</span>
							<p className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#665c55] m-0">
								SVKM&apos;s College of Engineering Campus, Irla, Vile Parle West.
							</p>
						</div>

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
								Confirm Tasting
							</button>
						</div>
					</form>
				) : (
					<div className="text-center py-6 space-y-4">
						<div className="w-16 h-16 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center mx-auto shadow-sm">
							<span className="material-symbols-outlined text-[32px]">check_circle</span>
						</div>
						<h3 className="font-['Playfair_Display',serif] text-2xl text-[#1f1b18]">
							Reservation Calibrated
						</h3>
						<p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm text-[#665c55] max-w-sm mx-auto leading-relaxed">
							Thank you, <strong className="text-[#1f1b18]">{name}</strong>. Your tasting table for <strong className="text-[#1f1b18]">{guests}</strong> has been secured for <strong className="text-[#1f1b18]">{slot}</strong> at our SVKM Flagship Roastery.
						</p>
						<div className="pt-3">
							<button
								type="button"
								onClick={() => {
									setIsSubmitted(false);
									onClose();
								}}
								className="px-8 py-3 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-colors border-0 cursor-pointer"
							>
								Done
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
