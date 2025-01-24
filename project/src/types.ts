export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartItem extends Product {
  orderQuantity: number;
}

export interface OrderHistory {
  id: string;
  date: string;
  documentNo: string;
  location: string;
  personId: string;
  personName: string;
  items: CartItem[];
  total: number;
}