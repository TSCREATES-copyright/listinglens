export type CategoryAnchor = {
  category: string;
  subcategory: string;
  basePrice: number;
  volatility: number;
  demandTier: 'high' | 'medium' | 'low';
  isPro?: boolean;
};

export const CATEGORY_ANCHORS: CategoryAnchor[] = [
  { category: 'Electronics', subcategory: 'Wireless Headphones', basePrice: 80, volatility: 0.1, demandTier: 'high' },
  { category: 'Electronics', subcategory: 'Gaming Console', basePrice: 200, volatility: 0.05, demandTier: 'high' },
  { category: 'Electronics', subcategory: 'Laptop', basePrice: 350, volatility: 0.15, demandTier: 'high' },
  { category: 'Electronics', subcategory: 'Smartphone', basePrice: 250, volatility: 0.1, demandTier: 'high' },
  { category: 'Furniture', subcategory: 'Office Chair', basePrice: 75, volatility: 0.2, demandTier: 'medium' },
  { category: 'Furniture', subcategory: 'Desk', basePrice: 100, volatility: 0.2, demandTier: 'medium' },
  { category: 'Furniture', subcategory: 'Couch', basePrice: 250, volatility: 0.3, demandTier: 'low' },
  { category: 'Tools', subcategory: 'Power Drill', basePrice: 55, volatility: 0.1, demandTier: 'high' },
  { category: 'Tools', subcategory: 'Circular Saw', basePrice: 80, volatility: 0.1, demandTier: 'medium' },
  { category: 'Tools', subcategory: 'Tool Set', basePrice: 120, volatility: 0.15, demandTier: 'high' },
  { category: 'Baby Gear', subcategory: 'Stroller', basePrice: 80, volatility: 0.2, demandTier: 'medium' },
  { category: 'Baby Gear', subcategory: 'Car Seat', basePrice: 50, volatility: 0.2, demandTier: 'low' },
  { category: 'Fitness', subcategory: 'Dumbbells', basePrice: 40, volatility: 0.1, demandTier: 'high' },
  { category: 'Fitness', subcategory: 'Treadmill', basePrice: 150, volatility: 0.3, demandTier: 'low' },
  { category: 'Appliances', subcategory: 'Microwave', basePrice: 30, volatility: 0.1, demandTier: 'medium' },
  { category: 'Appliances', subcategory: 'Mini Fridge', basePrice: 60, volatility: 0.15, demandTier: 'high' },
  // Pro Categories
  { category: 'Vehicles', subcategory: 'Sedan', basePrice: 5000, volatility: 0.1, demandTier: 'high', isPro: true },
  { category: 'Vehicles', subcategory: 'SUV', basePrice: 8000, volatility: 0.15, demandTier: 'high', isPro: true },
  { category: 'Vehicles', subcategory: 'Motorcycle', basePrice: 3000, volatility: 0.2, demandTier: 'medium', isPro: true },
  { category: 'Collectibles', subcategory: 'Trading Cards', basePrice: 100, volatility: 0.4, demandTier: 'high', isPro: true },
  { category: 'Collectibles', subcategory: 'Vintage Toys', basePrice: 150, volatility: 0.3, demandTier: 'medium', isPro: true },
  { category: 'Luxury', subcategory: 'Designer Bag', basePrice: 800, volatility: 0.2, demandTier: 'high', isPro: true },
  { category: 'Luxury', subcategory: 'Watch', basePrice: 1200, volatility: 0.15, demandTier: 'medium', isPro: true },
];
