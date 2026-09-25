import { useEffect, useMemo, useState } from 'react';
import CategoryNav from '../components/menu/CategoryNav';
import CategorySection from '../components/menu/CategorySection';
import CategorySidebar from '../components/menu/CategorySidebar';
import ProductDetails from '../components/menu/ProductDetails';
import CartBar from '../components/cart/CartBar';
import { categories as defaultCategories, menuProducts, getProductImage } from '../data/menuData';
import { useCart } from '../hooks/useCart';
import api from '../services/api';

export default function Menu({ onOpenCart }) {
	const [categoriesList, setCategoriesList] = useState(defaultCategories);
	const [activeCategory, setActiveCategory] = useState(defaultCategories[0]?.id || 'hot-coffees');
	const [search, setSearch] = useState('');
	const [selectedProduct, setSelectedProduct] = useState(null);
	const { addToCart } = useCart();

	// Load live menu data from MongoDB Atlas API with resilient fallback
	useEffect(() => {
		async function fetchMenu() {
			try {
				const [catRes, prodRes] = await Promise.all([
					api.get('/api/categories').catch(() => null),
					api.get('/api/products').catch(() => null)
				]);

				const apiCategories = catRes?.categories || catRes?.data;
				const apiProducts = prodRes?.products || prodRes?.data;

				if (Array.isArray(apiCategories) && apiCategories.length > 0 && Array.isArray(apiProducts) && apiProducts.length > 0) {
					const structured = apiCategories.map((cat) => {
						const catProducts = apiProducts
							.filter((p) => p.category === cat.name)
							.map((p) => ({
								id: p.slug || p._id,
								name: p.name,
								price: p.price,
								category: p.category,
								description: p.description,
								image: getProductImage(p.slug || p.id),
								nutrition: p.nutrition || { calories: '120 kcal', protein: '6g', carbs: '18g', fat: '6g' }
							}));

						return {
							id: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
							name: cat.name,
							products: catProducts
						};
					});

					if (structured.some((c) => c.products.length > 0)) {
						setCategoriesList(structured);
					}
				}
			} catch (err) {
				console.info('Using bundled menu data (offline fallback):', err.message);
			}
		}

		fetchMenu();
	}, []);

	const filteredCategories = useMemo(
		() =>
			categoriesList
				.map((category) => ({
					...category,
					products: category.products.filter((product) =>
						`${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())
					)
				}))
				.filter((category) => category.products.length),
		[categoriesList, search]
	);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) =>
				entries.forEach((entry) => {
					if (entry.isIntersecting) setActiveCategory(entry.target.id);
				}),
			{ rootMargin: '-25% 0px -65% 0px' }
		);
		categoriesList.forEach((category) => {
			const element = document.getElementById(category.id);
			if (element) observer.observe(element);
		});
		return () => observer.disconnect();
	}, [categoriesList, search]);

	const add = (product, customizations) => addToCart(product, customizations);

	return (
		<div className="menu-page">
			<header className="menu-header">
				<div>
					<p className="brand-kicker">Atelier Coffee Roasters · SVKM Flagship</p>
					<h1>Menu</h1>
				</div>
				<div className="header-actions">
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
			<CategoryNav categories={categoriesList} activeCategory={activeCategory} />
			<div className="menu-layout">
				<CategorySidebar categories={categoriesList} activeCategory={activeCategory} />
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

