export type StockProduct = {
  id: string;
  name: string;
  description: string;
  queue: number;
  price: string;
  quantity: number;
  tags: string;
  features: string;
  vehiclesFit: string;
  statusOn: boolean;
};

export type StockSub = {
  id: string;
  name: string;
  products: StockProduct[];
  queue: number;
  totalProducts: number;
  statusOn: boolean;
};

export type StockParent = {
  id: string;
  name: string;
  queue: number;
  totalProducts: number;
  totalSubs: number;
  statusOn: boolean;
  subs: StockSub[];
};

export function findParent(tree: StockParent[], parentId: string): StockParent | undefined {
  return tree.find((p) => p.id === parentId);
}

export function findSub(parent: StockParent, subId: string): StockSub | undefined {
  return parent.subs.find((s) => s.id === subId);
}

export function findProduct(sub: StockSub, productId: string): StockProduct | undefined {
  return sub.products.find((pr) => pr.id === productId);
}
