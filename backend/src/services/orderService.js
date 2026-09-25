export function calculateOrderTotal(items = []) { return items.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0); }
