import { useCart } from '../../hooks/useCart';

export default function CartDrawer({ isOpen, onClose, onNavigate }) {
	const { items, subtotal, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useCart();
	if (!isOpen) return null;

	const handleCheckout = () => {
		onClose();
		if (onNavigate) {
			onNavigate('checkout');
		} else {
			window.location.hash = 'checkout';
		}
	};
	return (
		<div className="drawer-backdrop" role="presentation" onClick={onClose}>
			<aside className="cart-drawer" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
				<div className="drawer-header">
					<div>
						<span className="eyebrow">Your order</span>
						<h2>Cart</h2>
					</div>
					<button className="close-button" type="button" onClick={onClose} aria-label="Close cart">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</svg>
					</button>
				</div>
				{items.length ? (
					<>
						<div className="cart-items">
							{items.map((item) => {
								const itemKey = item.cartItemId || item.id;
								return (
									<div className="cart-item" key={itemKey}>
										<img src={item.image} alt={item.name} />
										<div>
											<b>{item.name}</b>
											<small>
												₹{item.price}{item.customizations?.milk ? ` · ${item.customizations.milk}` : ''}
												{item.customizations?.addOns?.length ? ` + ${item.customizations.addOns.map((a) => a.name).join(', ')}` : ''}
											</small>
											<div className="quantity-control">
												<button type="button" onClick={() => decreaseQuantity(itemKey)}>−</button>
												<span>{item.quantity}</span>
												<button type="button" onClick={() => increaseQuantity(itemKey)}>＋</button>
											</div>
										</div>
										<strong>₹{item.price * item.quantity}</strong>
										<button className="remove-item" type="button" onClick={() => removeFromCart(itemKey)}>Remove</button>
									</div>
								);
							})}
						</div>
						<div className="cart-summary">
							<div>
								<span>Subtotal</span>
								<b>₹{subtotal}</b>
							</div>
							<button className="button button-primary" type="button" onClick={handleCheckout}>Continue to checkout</button>
							<button className="clear-button" type="button" onClick={clearCart}>Clear cart</button>
						</div>
					</>
				) : (
					<p className="empty-cart">Your cart is waiting for something warm.</p>
				)}
			</aside>
		</div>
	);
}
