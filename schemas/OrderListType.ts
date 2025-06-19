import { orderStatusType } from './OrderStatusType';

export type OrderListType = {
  id: string;
  orderNumber: string;
  user: { name: string; email: string } | null;
  address: { addressLine: string; city?: string; postalCode?: string | null } | null;
  total: number;
  status: orderStatusType;
  createdAt: string;
  itemsCount: number;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    name: string;
    description: string;
    category: string;
    brand: string;
    discount: number;
    imageUrl: string;
  }[];
}; 