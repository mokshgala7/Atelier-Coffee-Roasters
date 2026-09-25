import { createContext } from 'react';
export const OrderContext = createContext(null);
export function OrderProvider({ children }) { return <OrderContext.Provider value={{ orders: [] }}>{children}</OrderContext.Provider>; }
