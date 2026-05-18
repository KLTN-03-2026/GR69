export interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

export interface ProductItem {
  id: number;
  name: string;
  price: number | string;
  image?: string;
  category?: string;
  weight?: string;
  unit?: string;
  stock?: number;
}

export interface CartItem {
  name: string;
  qty: string;
  price: number;
}

export interface ConversationState {
  stage: "idle" | "awaiting_quantity" | "awaiting_address" | "awaiting_phone";
  pendingProduct?: string;
  pendingPrice?: number;
  pendingComboItems?: ProductItem[];
  cart: CartItem[];
  address?: string;
  currentKeyword?: string;
  pendingUnit?: string;
  pendingWeight?: number;
}

export type LocalResponse = {
  text: string;
  quickReplies?: string[];
  newState?: Partial<ConversationState>
};