import { useCart } from '../../hooks/useCart';

export default function CartBar({ onOpen }) {
	const { totalQuantity, subtotal } = useCart();
	if (!totalQuantity) return null;
	return <button className="cart-bar" type="button" onClick={onOpen}><span><b>{totalQuantity} item{totalQuantity === 1 ? '' : 's'}</b> in your order</span><strong>₹{subtotal} · View cart</strong></button>;
}
