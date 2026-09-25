import ProductGrid from './ProductGrid';

export default function CategorySection({ category, onDetails, onBuyNow, onAdd }) {
  return <section className="category-section" id={category.id}>
    <div className="category-heading"><div><div className="category-title"><span /> <h2>{category.name}</h2></div><p>Handcrafted selections, prepared with precision and a little patience.</p></div><small>{category.products.length} creations</small></div>
    <ProductGrid products={category.products} onDetails={onDetails} onBuyNow={onBuyNow} onAdd={onAdd} />
  </section>;
}
