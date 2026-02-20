export type UserRole = 'owner' | 'staff';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  address?: string;
  gstNumber?: string;
  totalGoldGiven: number;
  totalGoldDelivered: number;
  createdAt: string;
}

// Updated types to reflect Gold/Silver selection
export type JewelleryType = 'gold' | 'silver';
export type OrderStage = 'received' | 'making' | 'polishing' | 'ready' | 'delivered';

export interface StageHistory {
  stage: OrderStage;
  timestamp: string;
  notes?: string;
  updatedBy: string;
}

export interface DeliveryProof {
  photo?: string;
  signature: string;
  timestamp: string;
  deliveredBy: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  jewelleryType: JewelleryType;
  // --- New Logic Fields ---
  totalDelivered: number;     // The raw weight delivered
  stoneWeight: number;        // Weight of Stone/Diamond/etc
  quality: number;            // Purity/Quality multiplier (e.g., 98)
  netGoldUsed: number;        // (Total Delivered - Stone Weight)
  fineGold: number;           // (Net Gold Used * Quality)
  // ------------------------
  expectedDeliveryDate: string;
  currentStage: OrderStage;
  stageHistory: StageHistory[];
  deliveryProof?: DeliveryProof;
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
  wastage?: number;
  finalWeight?: number;
}

export interface GoldRates {
  gold24k: number;
  gold22k: number;
  lastUpdated: string;
}

export interface Settings {
  language: 'en' | 'hi' | 'bn';
  theme: 'light' | 'dark';
  goldRates: GoldRates;
}

export interface DashboardMetrics {
  ordersReceivedToday: number;
  totalDeliveredToday: number; // Updated from goldReceivedToday
  fineGoldToday: number;       // Updated from profitGoldToday
  pendingDeliveries: number;
  deliveredToday: number;
  overdueOrders: number;
  readyOrders: number;
}