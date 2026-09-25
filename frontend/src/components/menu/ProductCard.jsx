import NutritionInfo from './NutritionInfo';

export default function ProductCard({ product, onDetails, onBuyNow, onAdd }) {
	return <article className="product-card">
		<button className="product-image-button" type="button" onClick={() => onDetails(product)} aria-label={`View ${product.name}`}>
			<img src={product.image} alt={product.name} loading="lazy" />
			<span className="product-badge">{product.category === 'Add Ons' ? 'Add-on' : 'Artisan pick'}</span>
		</button>
		<div className="product-card-copy"><div className="product-heading"><h4>{product.name}</h4><strong>₹{product.price}</strong></div><p>{product.description}</p><NutritionInfo nutrition={product.nutrition} /></div>
		<div className="product-actions"><button className="button button-muted" type="button" onClick={() => onAdd(product)}>＋ Add</button><button className="button button-primary" type="button" onClick={() => onBuyNow(product)}>Customize</button></div>
	</article>;
}
