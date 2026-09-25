import { createContext, useMemo, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
	const [items, setItems] = useState([]);

	function addToCart(product, customizations = {}) {
		const cartItemId = `${product.id}-${JSON.stringify(customizations)}`;
		setItems((currentItems) => {
			const existing = currentItems.find((item) => (item.cartItemId || item.id) === cartItemId);
			if (existing) {
				return currentItems.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
			}
			return [...currentItems, { ...product, cartItemId, customizations, quantity: 1 }];
		});
	}

	function updateQuantity(key, quantity) {
		setItems((currentItems) => currentItems.flatMap((item) => (item.cartItemId || item.id) === key
			? (quantity > 0 ? [{ ...item, quantity }] : [])
			: [item]));
	}

	const value = useMemo(() => ({
		items,
		addToCart,
		removeFromCart: (key) => updateQuantity(key, 0),
		increaseQuantity: (key) => {
			const item = items.find((entry) => (entry.cartItemId || entry.id) === key);
			if (item) updateQuantity(key, item.quantity + 1);
		},
		decreaseQuantity: (key) => {
			const item = items.find((entry) => (entry.cartItemId || entry.id) === key);
			if (item) updateQuantity(key, item.quantity - 1);
		},
		clearCart: () => setItems([]),
		totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
		subtotal: items.reduce((total, item) => total + item.price * item.quantity, 0),
	}), [items]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
