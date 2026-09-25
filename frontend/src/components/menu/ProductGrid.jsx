import ProductCard from './ProductCard';

export default function ProductGrid({ products, onDetails, onBuyNow, onAdd }) {
	return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onDetails={onDetails} onBuyNow={onBuyNow} onAdd={onAdd} />)}</div>;
}
