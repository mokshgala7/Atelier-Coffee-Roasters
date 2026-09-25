export default function CategoryNav({ categories, activeCategory }) {
	return <nav className="category-pills" aria-label="Menu categories">{categories.map((category) => <a className={activeCategory === category.id ? 'active' : ''} key={category.id} href={`#${category.id}`}>{category.name} <span>{category.products.length}</span></a>)}</nav>;
}
