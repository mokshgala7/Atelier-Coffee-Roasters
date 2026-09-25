import { useEffect, useState } from 'react';
import { addOnOptions } from '../../data/menuData';

export default function ProductDetails({ product, onClose, onAdd, onBuyNow }) {
	const [quantity, setQuantity] = useState(1);
	const [milk, setMilk] = useState('Whole milk');
	const [selectedAddOns, setSelectedAddOns] = useState([]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [onClose]);

	if (!product) return null;

	const toggleAddOn = (addon) => {
		setSelectedAddOns((prev) =>
			prev.some((item) => item.id === addon.id)
				? prev.filter((item) => item.id !== addon.id)
				: [...prev, addon]
		);
	};

	const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
	const unitPrice = product.price + addOnsTotal;

	const showMilkOption = product.category.toLowerCase().includes('coffee') ||
		product.category.toLowerCase().includes('chocolate') ||
		product.category.toLowerCase().includes('matcha') ||
		product.category.toLowerCase().includes('shake');

	const add = (buyNow = false) => {
		for (let index = 0; index < quantity; index += 1) {
			onAdd(
				{ ...product, price: unitPrice },
				{ milk: showMilkOption ? milk : undefined, addOns: selectedAddOns }
			);
		}
		if (buyNow) onBuyNow();
		else onClose();
	};

	return (
		<div className="modal-backdrop" role="presentation" onClick={onClose}>
			<section className="product-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
				<button className="close-button" type="button" onClick={onClose} aria-label="Close modal">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
				<div className="modal-media-pane">
					<div className="modal-image-frame">
						<img src={product.image} alt={product.name} />
					</div>
					<div className="modal-media-caption">
						<span className="modal-category-badge">{product.category}</span>
						<span className="modal-nutrition-preview">{product.nutrition.calories}</span>
					</div>
				</div>
				<div className="modal-content">
					<span className="eyebrow">{product.category}</span>
					<div className="product-heading">
						<h2>{product.name}</h2>
						<strong>₹{unitPrice}</strong>
					</div>
					<p>{product.description}</p>
					<div className="detail-nutrition">
						<b>Nutrition</b>
						<span>{product.nutrition.calories} · {product.nutrition.protein} protein · {product.nutrition.carbs} carbs</span>
					</div>

					{showMilkOption && (
						<label>
							Milk Selection
							<select value={milk} onChange={(event) => setMilk(event.target.value)}>
								<option>Whole milk</option>
								<option>Oat milk</option>
								<option>Almond milk</option>
							</select>
						</label>
					)}

					<div className="custom-addons-group">
						<span className="addons-title">Add-ons &amp; Extras</span>
						<div className="addons-picker">
							{addOnOptions.map((addon) => {
								const isSelected = selectedAddOns.some((item) => item.id === addon.id);
								return (
									<button
										key={addon.id}
										type="button"
										className={`addon-option ${isSelected ? 'selected' : ''}`}
										onClick={() => toggleAddOn(addon)}
										title={addon.description}
									>
										<img src={addon.image} alt={addon.name} className="addon-thumbnail" />
										<div className="addon-meta">
											<span className="addon-name">{addon.name}</span>
											<span className="addon-price">+₹{addon.price}</span>
										</div>
										<span className="addon-check">{isSelected ? '✓' : '＋'}</span>
									</button>
								);
							})}
						</div>
					</div>

					<div className="quantity-control">
						<button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
						<b>{quantity}</b>
						<button type="button" onClick={() => setQuantity(quantity + 1)}>＋</button>
					</div>
					<div className="modal-actions">
						<button className="button button-muted" type="button" onClick={() => add(false)}>
							Add to cart · ₹{unitPrice * quantity}
						</button>
						<button className="button button-primary" type="button" onClick={() => add(true)}>
							Buy now · ₹{unitPrice * quantity}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
