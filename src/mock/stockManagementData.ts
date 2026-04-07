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

export const initialStockTree: StockParent[] = [
  {
    id: 'p1',
    name: 'Parent n',
    queue: 1,
    totalProducts: 12,
    totalSubs: 3,
    statusOn: true,
    subs: [
      {
        id: 'p1-s1',
        name: 'Sub n',
        queue: 2,
        totalProducts: 4,
        statusOn: true,
        products: [
          {
            id: 'p1-s1-pr1',
            name: 'Product 1',
            description: 'OEM quality part',
            queue: 1,
            price: '9$',
            quantity: 24,
            tags: 'Brake, OEM',
            features: 'Color: Black · Size: M',
            vehiclesFit: 'BMW X5 2018–2022',
            statusOn: true,
          },
          {
            id: 'p1-s1-pr2',
            name: 'Product 2',
            description: 'Aftermarket',
            queue: 2,
            price: '20$',
            quantity: 0,
            tags: 'Service',
            features: 'Color: Silver',
            vehiclesFit: 'Universal',
            statusOn: false,
          },
        ],
      },
      {
        id: 'p1-s2',
        name: 'Sub n+1',
        queue: 3,
        totalProducts: 8,
        statusOn: true,
        products: [
          {
            id: 'p1-s2-pr1',
            name: 'Product 3',
            description: '—',
            queue: 1,
            price: '15$',
            quantity: 10,
            tags: '—',
            features: '—',
            vehiclesFit: '—',
            statusOn: true,
          },
        ],
      },
    ],
  },
  {
    id: 'p2',
    name: 'Parent n+1',
    queue: 2,
    totalProducts: 6,
    totalSubs: 2,
    statusOn: true,
    subs: [
      {
        id: 'p2-s1',
        name: 'Sub n',
        queue: 1,
        totalProducts: 2,
        statusOn: true,
        products: [
          {
            id: 'p2-s1-pr1',
            name: 'Product 4',
            description: '—',
            queue: 1,
            price: '33$',
            quantity: 5,
            tags: '—',
            features: '—',
            vehiclesFit: '—',
            statusOn: true,
          },
        ],
      },
    ],
  },
];

export function findParent(tree: StockParent[], parentId: string): StockParent | undefined {
  return tree.find((p) => p.id === parentId);
}

export function findSub(parent: StockParent, subId: string): StockSub | undefined {
  return parent.subs.find((s) => s.id === subId);
}

export function findProduct(sub: StockSub, productId: string): StockProduct | undefined {
  return sub.products.find((pr) => pr.id === productId);
}
