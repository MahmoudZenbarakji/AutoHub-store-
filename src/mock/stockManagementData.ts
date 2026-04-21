export type StockProductOption = {
  option_name: string;
  option_value: string;
};

export type StockVehicleFit = {
  vehicle_make: string;
  vehicle_model: string;
  vehicle_trim: string | null;
  year_from: number;
  year_to: number;
};

export type StockProduct = {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  queue: number;
  price: string;
  quantity: number;
  tags: string[];
  features: string[];
  options: StockProductOption[];
  vehicleFits: StockVehicleFit[];
  categoryIds: string[];
  dynamicLabelIds: number[];
  imageUrls: string[];
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

export function defaultStockProduct(subCategoryId: string): StockProduct {
  return {
    id: '',
    name: 'Product',
    nameAr: 'منتج',
    nameEn: 'Product',
    description: '',
    descriptionAr: '',
    descriptionEn: '',
    queue: 0,
    price: '19.99',
    quantity: 10,
    tags: ['tag1'],
    features: [],
    options: [{ option_name: 'Size', option_value: 'M' }],
    vehicleFits: [
      {
        vehicle_make: 'Toyota',
        vehicle_model: 'Camry',
        vehicle_trim: null,
        year_from: 2020,
        year_to: 2024,
      },
    ],
    categoryIds: [subCategoryId],
    dynamicLabelIds: [],
    imageUrls: [],
    statusOn: true,
  };
}
