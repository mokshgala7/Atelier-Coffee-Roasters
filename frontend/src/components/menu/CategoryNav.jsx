export default function CategoryNav({ categories, activeCategory }) {
	const handleCategoryClick = (e, categoryId) => {
		e.preventDefault();
		const el = document.getElementById(categoryId);
		if (el) {
			const navHeight = 120;
			const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	return (
		<nav className="category-pills" aria-label="Menu categories">
			{categories.map((category) => (
				<a
					className={activeCategory === category.id ? 'active' : ''}
					key={category.id}
					href={`#${category.id}`}
					onClick={(e) => handleCategoryClick(e, category.id)}
				>
					{category.name} <span>{category.products.length}</span>
				</a>
			))}
		</nav>
	);
}
