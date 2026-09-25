export default function TableInfoModal({ isOpen, onClose, onNavigate }) {
	if (!isOpen) return null;

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<div
				className="relative max-w-md w-full bg-[#fff8f5] border border-[#ebdcd5] rounded-2xl shadow-2xl p-6"
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					className="close-button absolute top-5 right-5"
					aria-label="Close table info"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				<div className="space-y-4">
					<div className="flex items-center gap-2.5">
						<span className="w-3 h-3 rounded-full bg-[#a34824] animate-pulse" />
						<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider text-[#a34824]">
							Active Session
						</span>
					</div>

					<h3 className="font-['Playfair_Display',serif] text-2xl text-[#1f1b18]">
						Table 04 · Pavilion
					</h3>

					<p className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#665c55] leading-relaxed">
						You are connected to Table 04 at <strong>SVKM&apos;s Flagship Roastery Atelier</strong>. Any items added to your order are calibrated for seat-side service in handcrafted ceramic ware.
					</p>

					<div className="p-4 bg-[#fbf2ec] rounded-xl border border-[#ebdcd5] space-y-2 font-['Plus_Jakarta_Sans',sans-serif] text-xs">
						<div className="flex justify-between text-[#665c55]">
							<span>Roaster on Duty:</span>
							<strong className="text-[#1f1b18]">Batch 842 (Coorg)</strong>
						</div>
						<div className="flex justify-between text-[#665c55]">
							<span>Estimated Brew Speed:</span>
							<strong className="text-[#1f1b18]">8–10 mins</strong>
						</div>
						<div className="flex justify-between text-[#665c55]">
							<span>Payment Methods:</span>
							<strong className="text-[#1f1b18]">UPI · Cards · Cash at Bar</strong>
						</div>
					</div>

					<button
						type="button"
						onClick={() => {
							onClose();
							onNavigate('menu');
						}}
						className="w-full py-3.5 rounded-full bg-[#a34824] hover:bg-[#84310e] text-white font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold uppercase tracking-wider transition-all transform hover:scale-[1.02] shadow-sm border-0 cursor-pointer"
					>
						Order to Table 04
					</button>
				</div>
			</div>
		</div>
	);
}
