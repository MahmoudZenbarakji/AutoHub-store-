import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
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
  defaultStockProduct,
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
  updateCategory,
  updateProduct,
} from '@/services/stockService';
import { getAxiosErrorMessage } from '@/utils/apiError';
import {
  buildProductCreateBody,
  buildProductUpdateBody,
  isProductRow,
  mapProduct,
  mergeProductsIntoTree,
  mergeProductsIntoTreeByCategoryIds,
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
  parentNameForProduct?: string;
  subNameForProduct?: string;
};

function StockDetailRouter({
  basePath,
  parentId,
  subId,
  productId,
  parent,
  sub,
  product,
  parentNameForProduct,
  subNameForProduct,
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
  if (!parentId) return <StockDetailEmpty variant="home" />;
  if (!parent) return <StockDetailEmpty variant="not-found" />;
  if (!subId) {
    return (
      <StockParentDetail
        parent={parent}
        basePath={basePath}
        onStatusChange={onParentStatusChange}
        onDelete={onParentDelete}
        onUpdate={onParentUpdate}
        onAddSub={onAddSub}
        onAddProduct={onAddProduct}
      />
    );
  }
  if (!sub) return <StockDetailEmpty variant="not-found" />;
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
  if (!product) return <StockDetailEmpty variant="not-found" />;
  return (
    <StockProductDetail
      product={product}
      parentName={parentNameForProduct}
      subName={subNameForProduct}
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
      const full = await getCategoriesTree();
      let baseTree = normalizeStockTreePayload(full);
      if (q) {
        const body = await getProducts(q, catId || '');
        const list = unwrapList(body);
        if (list.length && isProductRow(list[0])) {
          baseTree = mergeProductsIntoTreeByCategoryIds(baseTree, list.map(mapProduct));
        }
        setTree(baseTree);
        return;
      }
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
      const body = buildProductCreateBody(s.id, defaultStockProduct(s.id));
      const res = await createProduct(body);
      const newId = unwrapIdFromCreateResponse(res);
      await refreshAfterMutation();
      if (newId) navigate(`${BASE}/parent/${p.id}/sub/${s.id}/product/${newId}`);
      toast.success('Product created');
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const handleProductStatus = async (p: StockProduct, checked: boolean) => {
    try {
      await updateProduct(p.id, { status: checked });
      await refreshAfterMutation();
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const handleProductDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await refreshAfterMutation();
      if (parentId && subId) navigate(`${BASE}/parent/${parentId}/sub/${subId}`);
      else navigate(BASE);
      toast.success('Product deleted');
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
    }
  };

  const handleProductUpdate = async (p: StockProduct) => {
    try {
      await updateProduct(p.id, buildProductUpdateBody(p));
      await refreshAfterMutation();
      toast.success('Product updated');
    } catch (err) {
      toast.error(getAxiosErrorMessage(err));
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
        <StockFlowGuide
          phase={phase}
          parentName={parent?.name}
          subName={sub?.name}
          productName={product?.name}
        />
        <div className="flex min-h-[60vh] w-full min-w-0 flex-col gap-4 lg:flex-row">
          <StockTreeSidebar
            tree={tree}
            selectedParentId={parentId}
            selectedSubId={subId}
            selectedProductId={productId}
            searchQuery={searchQuery}
            serverSearchActive={Boolean(debouncedSearch.trim())}
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
              parentNameForProduct={parent?.name}
              subNameForProduct={sub?.name}
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
