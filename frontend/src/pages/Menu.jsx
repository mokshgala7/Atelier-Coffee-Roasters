import { useEffect, useMemo, useState } from 'react';
import CategoryNav from '../components/menu/CategoryNav';
import CategorySection from '../components/menu/CategorySection';
import CategorySidebar from '../components/menu/CategorySidebar';
import ProductDetails from '../components/menu/ProductDetails';
import CartBar from '../components/cart/CartBar';
import CartDrawer from '../components/cart/CartDrawer';
import { categories, menuProducts } from '../data/menuData';
import { useCart } from '../hooks/useCart';

export default function Menu({ onOpenCart }) {
	const [activeCategory, setActiveCategory] = useState(categories[0].id);
	const [search, setSearch] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const { addToCart } = useCart();
	const filteredCategories = useMemo(() => categories.map((category) => ({ ...category, products: category.products.filter((product) => `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())) })).filter((category) => category.products.length), [search]);
	useEffect(() => { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActiveCategory(entry.target.id); }), { rootMargin: '-25% 0px -65% 0px' }); categories.forEach((category) => { const element = document.getElementById(category.id); if (element) observer.observe(element); }); return () => observer.disconnect(); }, [search]);
	const add = (product, customizations) => addToCart(product, customizations);
	return (
		<div className="menu-page">
			<header className="menu-header">
				<div>
					<p className="brand-kicker">Atelier Coffee Roasters · SVKM Flagship</p>
					<h1>Menu</h1>
				</div>
				<div className="header-actions">
					<span>Table 04 · SVKM Roastery Pavilion</span>
					<label className="search-box">
						⌕
						<input
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder={`Filter ${menuProducts.length} artisanal selections...`}
						/>
					</label>
				</div>
			</header>
			<CategoryNav categories={categories} activeCategory={activeCategory} />
			<div className="menu-layout">
				<CategorySidebar categories={categories} activeCategory={activeCategory} />
				<main className="menu-content">
					{filteredCategories.length ? (
						filteredCategories.map((category) => (
							<CategorySection
								key={category.id}
								category={category}
								onDetails={setSelectedProduct}
								onBuyNow={setSelectedProduct}
								onAdd={add}
							/>
						))
					) : (
						<div className="empty-results">No selections match “{search}”.</div>
					)}
				</main>
			</div>
			<div className="roastery-banner">
				<center>
					<span>Precision temperature &amp; pour</span>
					<p>Every cup is calibrated for clarity, balance, and a lingering finish.</p>
				</center>
			</div>
			<CartBar onOpen={onOpenCart} />
			<ProductDetails
				product={selectedProduct}
				onClose={() => setSelectedProduct(null)}
				onAdd={add}
				onBuyNow={() => {
					setSelectedProduct(null);
					onOpenCart();
				}}
			/>
		</div>
	);
}
