import { useMemo, useState } from 'react';
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
  initialStockTree,
  type StockParent,
  type StockProduct,
  type StockSub,
} from '@/mock/stockManagementData';

const BASE = '/dashboard/stock-management';

type StockDetailRouterProps = {
  parentId?: string;
  subId?: string;
  productId?: string;
  parent?: StockParent;
  sub?: StockSub;
  product?: StockProduct;
};

function StockDetailRouter({
  parentId,
  subId,
  productId,
  parent,
  sub,
  product,
}: StockDetailRouterProps) {
  if (!parentId) return <StockDetailEmpty />;
  if (!parent) return <StockDetailEmpty />;
  if (!subId) return <StockParentDetail parent={parent} basePath={BASE} />;
  if (!sub) return <StockDetailEmpty />;
  if (!productId) return <StockSubDetail parent={parent} sub={sub} basePath={BASE} />;
  if (!product) return <StockDetailEmpty />;
  return <StockProductDetail product={product} />;
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
  const [tree, setTree] = useState<StockParent[]>(initialStockTree);
  const [searchQuery, setSearchQuery] = useState('');

  const phase = useMemo(() => getPhase(parentId, subId, productId), [parentId, subId, productId]);

  const parent = parentId ? findParent(tree, parentId) : undefined;
  const sub = parent && subId ? findSub(parent, subId) : undefined;
  const product = sub && productId ? findProduct(sub, productId) : undefined;

  const guideHighlightParentId = phase === 'home' ? tree[0]?.id : undefined;

  const addParent = () => {
    const id = `p-new-${Date.now()}`;
    const newParent: StockParent = {
      id,
      name: 'New parent',
      queue: 0,
      totalProducts: 0,
      totalSubs: 0,
      statusOn: true,
      subs: [],
    };
    setTree((prev) => [...prev, newParent]);
    navigate(`${BASE}/parent/${id}`);
  };

  return (
    <>
      <Helmet>
        <title>AutoHub — Stock Management</title>
      </Helmet>
      <div className="flex w-full min-w-0 flex-1 flex-col gap-4">
        <StockManagementToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExportAll={() => undefined}
          onImport={() => undefined}
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
              parentId={parentId}
              subId={subId}
              productId={productId}
              parent={parent}
              sub={sub}
              product={product}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
