import { useEffect, useRef, useState } from 'react';

export default function TastingModal({ isOpen, onClose, onShowToast }) {
	const todayStr = new Date().toISOString().split('T')[0];

	// Date & Time state
	const [selectedDate, setSelectedDate] = useState(() => {
		// Default to tomorrow or today
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		return tomorrow.toISOString().split('T')[0];
	});
	const [selectedTime, setSelectedTime] = useState('11:00');

	// Guest info
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [guests, setGuests] = useState('2 Guests');
	const [notes, setNotes] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const dateInputRef = useRef(null);
	const timeInputRef = useRef(null);

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

	const getFormattedDate = (dateStr) => {
		if (!dateStr) return '';
		const [year, month, day] = dateStr.split('-').map(Number);
		const d = new Date(year, month - 1, day);
		return d.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	};

	const formatTimeDisplay = (timeStr) => {
		if (!timeStr) return '';
		const [hours, minutes] = timeStr.split(':').map(Number);
		const period = hours >= 12 ? 'PM' : 'AM';
		const h12 = hours % 12 || 12;
		const m = minutes.toString().padStart(2, '0');
		return `${h12}:${m} ${period}`;
	};

	const quickTimeSlots = [
		{ label: '10:00 AM', value: '10:00' },
		{ label: '11:30 AM', value: '11:30' },
		{ label: '02:00 PM', value: '14:00' },
		{ label: '04:00 PM', value: '16:00' },
		{ label: '05:30 PM', value: '17:30' },
		{ label: '07:00 PM', value: '19:00' }
	];

	const handleOpenDatePicker = () => {
		if (dateInputRef.current) {
			if (typeof dateInputRef.current.showPicker === 'function') {
				dateInputRef.current.showPicker();
			} else {
				dateInputRef.current.focus();
			}
		}
	};

	const handleOpenTimePicker = () => {
		if (timeInputRef.current) {
			if (typeof timeInputRef.current.showPicker === 'function') {
				timeInputRef.current.showPicker();
			} else {
				timeInputRef.current.focus();
			}
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim()) {
			onShowToast('Please enter your name');
			return;
		}
		if (!selectedDate) {
			onShowToast('Please select a date from the calendar');
			return;
		}
		if (!selectedTime) {
			onShowToast('Please select a time from the clock');
			return;
		}

		setIsSubmitted(true);
		onShowToast(`Tasting reserved for ${name} on ${getFormattedDate(selectedDate)} at ${formatTimeDisplay(selectedTime)}!`);
	};

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<div
				className="relative max-w-lg w-full bg-[#fff8f5] border border-[#ebdcd5] rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
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
								Artisanal Cupping &amp; Roastery Tour
							</span>
							<h3 className="font-['Playfair_Display',serif] text-2xl text-[#1f1b18] mt-1">
								Reserve Tasting Experience
							</h3>
							<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] mt-1">
								Available all 7 days of the week at SVKM Flagship Roastery Pavilion, Vile Parle West.
							</p>
						</div>

						{/* Single Dedicated Tasting Experience Badge */}
						<div className="p-4 rounded-xl bg-[#fbf2ec] border border-[#dcc1b8] flex items-start gap-3.5 shadow-xs">
							<div className="w-10 h-10 rounded-full bg-[#f6ece7] text-[#a34824] flex items-center justify-center flex-shrink-0 mt-0.5">
								<span className="material-symbols-outlined text-[22px]">coffee_maker</span>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<h4 className="font-['Playfair_Display',serif] text-base font-bold text-[#1f1b18] m-0">
										Signature Atelier Tasting Experience
									</h4>
									<span className="px-2 py-0.5 rounded-full bg-[#a34824] text-white font-['Plus_Jakarta_Sans',sans-serif] text-[10px] font-bold uppercase tracking-wider">
										Curated
									</span>
								</div>
								<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-relaxed m-0">
									A 90-minute multi-sensory cupping session featuring single-origin Coorg &amp; Yirgacheffe washed lots, live Diedrich drum roast observation, Slayer espresso extraction demo, and house patisserie flight.
								</p>
							</div>
						</div>

						{/* Date Picker (Calendar Pop-up) */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
									Select Date (Any day of the week)
								</label>
								<button
									type="button"
									onClick={handleOpenDatePicker}
									className="text-[#a34824] hover:text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
								>
									<span className="material-symbols-outlined text-[15px]">calendar_month</span>
									Open Calendar
								</button>
							</div>

							<div
								onClick={handleOpenDatePicker}
								className="relative flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] hover:border-[#a34824] cursor-pointer transition-colors shadow-2xs"
							>
								<div className="flex items-center gap-2.5 text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-medium">
									<span className="material-symbols-outlined text-[#a34824] text-[18px]">calendar_today</span>
									<span>{selectedDate ? getFormattedDate(selectedDate) : 'Choose date'}</span>
								</div>
								<input
									ref={dateInputRef}
									type="date"
									min={todayStr}
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
									aria-label="Select tasting date"
								/>
								<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a] uppercase font-bold tracking-wider">
									Pick Day ▾
								</span>
							</div>
						</div>

						{/* Time Picker (Clock Pop-up & Quick Selection) */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
									Select Time (Clock &amp; Custom Hour)
								</label>
								<button
									type="button"
									onClick={handleOpenTimePicker}
									className="text-[#a34824] hover:text-[#84310e] font-['Plus_Jakarta_Sans',sans-serif] text-[11px] font-semibold flex items-center gap-1 bg-transparent border-0 cursor-pointer p-0"
								>
									<span className="material-symbols-outlined text-[15px]">schedule</span>
									Open Clock
								</button>
							</div>

							{/* Interactive Clock Input */}
							<div
								onClick={handleOpenTimePicker}
								className="relative flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] hover:border-[#a34824] cursor-pointer transition-colors shadow-2xs"
							>
								<div className="flex items-center gap-2.5 text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs font-medium">
									<span className="material-symbols-outlined text-[#a34824] text-[18px]">schedule</span>
									<span>Selected Time: <strong>{formatTimeDisplay(selectedTime)}</strong></span>
								</div>
								<input
									ref={timeInputRef}
									type="time"
									value={selectedTime}
									onChange={(e) => setSelectedTime(e.target.value)}
									className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
									aria-label="Select tasting time"
								/>
								<span className="font-['Plus_Jakarta_Sans',sans-serif] text-[11px] text-[#89726a] uppercase font-bold tracking-wider">
									Pick Clock ▾
								</span>
							</div>

							{/* Quick Time Slots */}
							<div className="flex flex-wrap gap-1.5 pt-0.5">
								{quickTimeSlots.map((slot) => {
									const isActive = selectedTime === slot.value;
									return (
										<button
											key={slot.value}
											type="button"
											onClick={() => setSelectedTime(slot.value)}
											className={`px-2.5 py-1 rounded-md text-[11px] font-['Plus_Jakarta_Sans',sans-serif] font-medium transition-all border cursor-pointer ${
												isActive
													? 'bg-[#a34824] text-white border-[#a34824] shadow-xs'
													: 'bg-[#fff8f5] text-[#56423c] border-[#ebdcd5] hover:border-[#a34824]'
											}`}
										>
											{slot.label}
										</button>
									);
								})}
							</div>
						</div>

						{/* Guests & Guest Contact Details */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
									<option>5 Guests</option>
									<option>Private Guild (6 Guests)</option>
								</select>
							</label>

							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Full Name *</span>
								<input
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="e.g. Aarav Sharma"
									className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								/>
							</label>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

							<label className="block space-y-1.5 font-['Plus_Jakarta_Sans',sans-serif] text-xs font-semibold text-[#56423c]">
								<span>Palate Preferences (Optional)</span>
								<input
									type="text"
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="e.g. Prefer fruity light roasts"
									className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#ebdcd5] text-[#1f1b18] font-['Plus_Jakarta_Sans',sans-serif] text-xs outline-none focus:border-[#84310e]"
								/>
							</label>
						</div>

						{/* Roastery Location Note */}
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
							Thank you, <strong className="text-[#1f1b18]">{name}</strong>. Your <strong className="text-[#1f1b18]">Signature Atelier Tasting Experience</strong> for <strong className="text-[#1f1b18]">{guests}</strong> has been secured for <strong className="text-[#1f1b18]">{getFormattedDate(selectedDate)} at {formatTimeDisplay(selectedTime)}</strong> at our SVKM Flagship Roastery.
						</p>
						<div className="p-3 bg-[#fbf2ec] rounded-xl border border-[#ebdcd5] text-left max-w-sm mx-auto space-y-1 text-xs text-[#56423c]">
							<div>📅 <strong>Date:</strong> {getFormattedDate(selectedDate)}</div>
							<div>⏰ <strong>Time:</strong> {formatTimeDisplay(selectedTime)}</div>
							<div>👥 <strong>Party:</strong> {guests}</div>
							<div>📍 <strong>Location:</strong> SVKM&apos;s Flagship Roastery Pavilion, Vile Parle West</div>
						</div>
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
