import { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import RoastingPhilosophy from '../components/home/RoastingPhilosophy';
import DigitalService from '../components/home/DigitalService';
import TestimonialsSection from '../components/home/TestimonialsSection';
import VisitRoastery from '../components/home/VisitRoastery';
import HomeFooter from '../components/home/HomeFooter';
import TastingModal from '../components/home/TastingModal';

export default function Home({ onNavigate, onOpenCart }) {
	const [toastText, setToastText] = useState('');
	const [showToast, setShowToast] = useState(false);
	const [isTastingOpen, setIsTastingOpen] = useState(false);

	const triggerToast = (msg) => {
		setToastText(msg);
		setShowToast(true);
		setTimeout(() => {
			setShowToast(false);
		}, 3000);
	};

	return (
		<div className="w-full bg-[#fff8f5] text-[#1f1b18] min-h-screen pt-20">
			{/* Toast Notification Banner */}
			<div
				className={`fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-2.5 bg-[#342f2c] text-[#f9efe9] px-5 py-3 rounded-full shadow-2xl ${
					showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
				}`}
				id="toast-banner"
			>
				<span className="material-symbols-outlined text-[#ffdbcf] text-[20px]">check_circle</span>
				<span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs text-[#f9efe9]">
					{toastText}
				</span>
			</div>

			{/* 1. Cinematic Hero Section */}
			<HeroSection
				onNavigate={onNavigate}
				onOpenTastingModal={() => setIsTastingOpen(true)}
			/>

			{/* 2. Roasting Craft & Terroir Standard */}
			<RoastingPhilosophy />

			{/* 3. Digital Table Service Experience */}
			<DigitalService onNavigate={onNavigate} />

			{/* 4. Editorial Testimonials with Add Review */}
			<TestimonialsSection onShowToast={triggerToast} />

			{/* 5. Visit the Roastery (SVKM College Campus) */}
			<VisitRoastery
				onOpenTastingModal={() => setIsTastingOpen(true)}
			/>

			{/* 6. Footer with Dispatch Subscription */}
			<HomeFooter
				onShowToast={triggerToast}
				onNavigate={onNavigate}
			/>

			{/* Interactive Tasting Modal */}
			<TastingModal
				isOpen={isTastingOpen}
				onClose={() => setIsTastingOpen(false)}
				onShowToast={triggerToast}
			/>
		</div>
	);
}
