import atelierLogo from '../../assets/images/logo.webp';

export default function CategorySidebar({ categories, activeCategory }) {
	const totalItems = categories.reduce((sum, cat) => sum + cat.products.length, 0);
	return (
		<aside className="category-sidebar">
			<div className="sidebar-title">
				<div>
					<h2>Selections</h2>
					<p>{totalItems} handcrafted items</p>
				</div>
				<img src={atelierLogo} alt="Atelier Logo" className="w-8 h-8 rounded-full object-cover border border-[#ebdcd5]" />
			</div>
			<nav>
				{categories.map((category) => (
					<a className={activeCategory === category.id ? 'active' : ''} key={category.id} href={`#${category.id}`}>
						<span className="dot" />
						{category.name}
						<b>{category.products.length}</b>
					</a>
				))}
			</nav>
			<div className="roastery-note">
				<strong>Atelier Craft</strong>
				<p>Every beverage is precision poured and paired with artisanal add-ons.</p>
				<small>Batch roasted weekly</small>
			</div>
		</aside>
	);
}
