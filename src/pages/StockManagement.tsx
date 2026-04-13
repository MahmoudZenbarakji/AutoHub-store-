import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  StockDetailEmpty,
  StockParentDetail,
  StockProductDetail,
  StockSubDetail,
} from '@/components/stock/StockDetailViews';
import { StockFlowGuide, type StockGuidePhase } from '@/components/stock/StockFlowGuide';
import { StockManagementToolbar } from '@/components/stock/StockManagementToolbar';
import { StockTreeSidebar } from '@/components/stock/StockTreeSidebar';
import {
  findParent,
  findProduct,
  findSub,
  type StockParent,
  type StockProduct,
  type StockSub,
} from '@/mock/stockManagementData';
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  exportStock,
  getCategoriesTree,
  getProducts,
  importStock,
  searchStock,
  updateCategory,
  updateProduct,
} from '@/services/stockService';
import {
  isProductRow,
  mapProduct,
  mergeProductsIntoTree,
  normalizeStockTreePayload,
  unwrapIdFromCreateResponse,
  unwrapList,
} from '@/utils/stockNormalize';

const BASE = '/dashboard/stock-management';

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function categoryPayload(p: StockParent | StockSub) {
  return {
    name: p.name,
    queue: p.queue,
    status_on: p.statusOn,
  };
}

function productPayload(p: StockProduct) {
  return {
    name: p.name,
    description: p.description,
    queue: p.queue,
    price: p.price,
    quantity: p.quantity,
    tags: p.tags,
    features: p.features,
    vehicles_fit: p.vehiclesFit,
    status_on: p.statusOn,
  };
}

type StockDetailRouterProps = {
  basePath: string;
  parentId?: string;
  subId?: string;
  productId?: string;
  parent?: StockParent;
  sub?: StockSub;
  product?: StockProduct;
  onParentStatusChange?: (parent: StockParent, checked: boolean) => void | Promise<void>;
  onParentDelete?: (parentId: string) => void | Promise<void>;
  onParentUpdate?: (parent: StockParent) => void | Promise<void>;
  onAddSub?: (parent: StockParent) => void | Promise<void>;
  onSubStatusChange?: (parent: StockParent, sub: StockSub, checked: boolean) => void | Promise<void>;
  onSubDelete?: (parentId: string, subId: string) => void | Promise<void>;
  onSubUpdate?: (parent: StockParent, sub: StockSub) => void | Promise<void>;
  onAddProduct?: (parent: StockParent, sub: StockSub) => void | Promise<void>;
  onProductStatusChange?: (product: StockProduct, checked: boolean) => void | Promise<void>;
  onProductDelete?: (productId: string) => void | Promise<void>;
  onProductUpdate?: (product: StockProduct) => void | Promise<void>;
};

function StockDetailRouter({
  basePath,
  parentId,
  subId,
  productId,
  parent,
  sub,
  product,
  onParentStatusChange,
  onParentDelete,
  onParentUpdate,
  onAddSub,
  onSubStatusChange,
  onSubDelete,
  onSubUpdate,
  onAddProduct,
  onProductStatusChange,
  onProductDelete,
  onProductUpdate,
}: StockDetailRouterProps) {
  if (!parentId) return <StockDetailEmpty />;
  if (!parent) return <StockDetailEmpty />;
  if (!subId) {
    return (
      <StockParentDetail
        parent={parent}
        basePath={basePath}
        onStatusChange={onParentStatusChange}
        onDelete={onParentDelete}
        onUpdate={onParentUpdate}
        onAddSub={onAddSub}
      />
    );
  }
  if (!sub) return <StockDetailEmpty />;
  if (!productId) {
    return (
      <StockSubDetail
        parent={parent}
        sub={sub}
        basePath={basePath}
        onStatusChange={onSubStatusChange}
        onDelete={onSubDelete}
        onUpdate={onSubUpdate}
        onAddProduct={onAddProduct}
      />
    );
  }
  if (!product) return <StockDetailEmpty />;
  return (
    <StockProductDetail
      product={product}
      onStatusChange={onProductStatusChange}
      onDelete={onProductDelete}
      onUpdate={onProductUpdate}
    />
  );
}

function getPhase(parentId?: string, subId?: string, productId?: string): StockGuidePhase {
  if (productId) return 'product';
  if (subId) return 'sub';
  if (parentId) return 'parent';
  return 'home';
}

export function StockManagement() {
  const { parentId, subId, productId } = useParams<{
    parentId?: string;
    subId?: string;
    productId?: string;
  }>();
  const navigate = useNavigate();
  const [tree, setTree] = useState<StockParent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const phase = useMemo(() => getPhase(parentId, subId, productId), [parentId, subId, productId]);

  const parent = parentId ? findParent(tree, parentId) : undefined;
  const sub = parent && subId ? findSub(parent, subId) : undefined;
  const product = sub && productId ? findProduct(sub, productId) : undefined;

  const guideHighlightParentId = phase === 'home' ? tree[0]?.id : undefined;

  const selectedCategoryId = subId ?? parentId ?? '';

  const loadStock = useCallback(async () => {
    const q = debouncedSearch.trim();
    const catId = selectedCategoryId;
    try {
      if (q) {
        const body = await searchStock(q);
        setTree(normalizeStockTreePayload(body));
        return;
      }
      const full = await getCategoriesTree();
      let baseTree = normalizeStockTreePayload(full);
      if (catId) {
        const body = await getProducts('', catId);
        const list = unwrapList(body);
        if (list.length && isProductRow(list[0])) {
          baseTree = mergeProductsIntoTree(
            baseTree,
            catId,
            list.map(mapProduct),
          );
        }
      }
      setTree(baseTree);
    } catch {
      setTree([]);
    }
  }, [debouncedSearch, selectedCategoryId]);

  useEffect(() => {
    void loadStock();
  }, [loadStock]);

  const refreshAfterMutation = useCallback(async () => {
    await loadStock();
  }, [loadStock]);

  const addParent = async () => {
    try {
      const res = await createCategory({ name: 'New parent' });
      const newId = unwrapIdFromCreateResponse(res);
      await refreshAfterMutation();
      if (newId) navigate(`${BASE}/parent/${newId}`);
    } catch {
      /* silent */
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportStock();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'stock.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      /* silent */
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      await importStock(file);
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleParentStatus = async (p: StockParent, checked: boolean) => {
    try {
      await updateCategory(p.id, { ...categoryPayload(p), status_on: checked });
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleParentDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      await refreshAfterMutation();
      navigate(BASE);
    } catch {
      /* silent */
    }
  };

  const handleParentUpdate = async (p: StockParent) => {
    try {
      await updateCategory(p.id, categoryPayload(p));
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleAddSub = async (p: StockParent) => {
    try {
      const res = await createCategory({
        name: 'New sub',
        parent_id: p.id,
        queue: 0,
      });
      const newId = unwrapIdFromCreateResponse(res);
      await refreshAfterMutation();
      if (newId) navigate(`${BASE}/parent/${p.id}/sub/${newId}`);
    } catch {
      /* silent */
    }
  };

  const handleSubStatus = async (_parent: StockParent, s: StockSub, checked: boolean) => {
    try {
      await updateCategory(s.id, { ...categoryPayload(s), status_on: checked });
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleSubDelete = async (_parentId: string, sid: string) => {
    try {
      await deleteCategory(sid);
      await refreshAfterMutation();
      navigate(parentId ? `${BASE}/parent/${parentId}` : BASE);
    } catch {
      /* silent */
    }
  };

  const handleSubUpdate = async (_parent: StockParent, s: StockSub) => {
    try {
      await updateCategory(s.id, categoryPayload(s));
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleAddProduct = async (p: StockParent, s: StockSub) => {
    try {
      const res = await createProduct({
        category_id: s.id,
        name: 'New product',
        description: '',
        queue: 0,
        price: '0',
        quantity: 0,
        tags: '',
        features: '',
        vehicles_fit: '',
        status_on: true,
      });
      const newId = unwrapIdFromCreateResponse(res);
      await refreshAfterMutation();
      if (newId) navigate(`${BASE}/parent/${p.id}/sub/${s.id}/product/${newId}`);
    } catch {
      /* silent */
    }
  };

  const handleProductStatus = async (p: StockProduct, checked: boolean) => {
    try {
      await updateProduct(p.id, { ...productPayload(p), status_on: checked });
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  const handleProductDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await refreshAfterMutation();
      if (parentId && subId) navigate(`${BASE}/parent/${parentId}/sub/${subId}`);
      else navigate(BASE);
    } catch {
      /* silent */
    }
  };

  const handleProductUpdate = async (p: StockProduct) => {
    try {
      await updateProduct(p.id, productPayload(p));
      await refreshAfterMutation();
    } catch {
      /* silent */
    }
  };

  return (
    <>
      <Helmet>
        <title>AutoHub — Stock Management</title>
      </Helmet>
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        aria-hidden
        onChange={handleImportChange}
      />
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        <StockManagementToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportAll={handleExport}
          onImport={handleImportClick}
        />
        <StockFlowGuide phase={phase} />
        <div className="flex min-h-[60vh] w-full min-w-0 flex-col gap-4 lg:flex-row">
          <StockTreeSidebar
            tree={tree}
            selectedParentId={parentId}
            selectedSubId={subId}
            selectedProductId={productId}
            searchQuery={searchQuery}
            onSelectParent={(id) => navigate(`${BASE}/parent/${id}`)}
            onSelectSub={(p, s) => navigate(`${BASE}/parent/${p}/sub/${s}`)}
            onSelectProduct={(p, s, pr) =>
              navigate(`${BASE}/parent/${p}/sub/${s}/product/${pr}`)
            }
            onAddParent={addParent}
            guideHighlightParentId={guideHighlightParentId}
          />
          <motion.div
            className="min-w-0 flex-1"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StockDetailRouter
              basePath={BASE}
              parentId={parentId}
              subId={subId}
              productId={productId}
              parent={parent}
              sub={sub}
              product={product}
              onParentStatusChange={handleParentStatus}
              onParentDelete={handleParentDelete}
              onParentUpdate={handleParentUpdate}
              onAddSub={handleAddSub}
              onSubStatusChange={handleSubStatus}
              onSubDelete={handleSubDelete}
              onSubUpdate={handleSubUpdate}
              onAddProduct={handleAddProduct}
              onProductStatusChange={handleProductStatus}
              onProductDelete={handleProductDelete}
              onProductUpdate={handleProductUpdate}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
