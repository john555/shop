import { Order } from './types';

export function getFormattedOrderNumber(
  order: Pick<Order, 'orderNumber'>,
  store: { orderPrefix?: string | null; orderSuffix?: string | null }
): string {
  const prefix = store.orderPrefix || '';
  const suffix = store.orderSuffix || '';
  return `${prefix}${order.orderNumber}${suffix}`;
}
