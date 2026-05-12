export interface CartItemRaw {
  id?: string;
  itemId?: string;
  courseId?: string;
  itemName?: string;
  title?: string;
  imgUrl?: string;
  price?: number | string;
  basePrice?: number | string;
  quantity?: number | string;
  itemType?: number | string;
}

export interface CleanCartItem {
  id: string;
  courseId: string;
  title: string;
  imgUrl: string | null;
  price: number;
  quantity: number;
  subTotal: number;
  itemType: 1 | 2;
}

export interface CleanCart {
  items: CleanCartItem[];
  totalCartPrice: number;
}
