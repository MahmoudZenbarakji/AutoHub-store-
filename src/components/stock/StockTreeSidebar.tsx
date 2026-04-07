import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import type { StockParent } from '@/mock/stockManagementData';
import { cn } from '@/lib/utils';

type StockTreeSidebarProps = {
  tree: StockParent[];
  selectedParentId?: string;
  selectedSubId?: string;
  selectedProductId?: string;
  searchQuery: string;
  onSelectParent: (parentId: string) => void;
  onSelectSub: (parentId: string, subId: string) => void;
  onSelectProduct: (parentId: string, subId: string, productId: string) => void;
  onAddParent: () => void;
  guideHighlightParentId?: string;
};

function filterTree(tree: StockParent[], query: string): StockParent[] {
  const q = query.trim().toLowerCase();
  if (!q) return tree;
  return tree
    .map((p) => ({
      ...p,
      subs: p.subs
        .map((s) => ({
          ...s,
          products: s.products.filter(
            (pr) =>
              pr.name.toLowerCase().includes(q) ||
              p.name.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q),
          ),
        }))
        .filter((s) => s.products.length > 0 || s.name.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)),
    }))
    .filter((p) => p.subs.length > 0 || p.name.toLowerCase().includes(q));
}

export function StockTreeSidebar({
  tree,
  selectedParentId,
  selectedSubId,
  selectedProductId,
  searchQuery,
  onSelectParent,
  onSelectSub,
  onSelectProduct,
  onAddParent,
  guideHighlightParentId,
}: StockTreeSidebarProps) {
  const [openParents, setOpenParents] = useState<Record<string, boolean>>({});
  const [openSubs, setOpenSubs] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => filterTree(tree, searchQuery), [tree, searchQuery]);

  useEffect(() => {
    if (selectedParentId) {
      setOpenParents((prev) => ({ ...prev, [selectedParentId]: true }));
    }
    if (selectedParentId && selectedSubId) {
      setOpenSubs((prev) => ({ ...prev, [`${selectedParentId}-${selectedSubId}`]: true }));
    }
  }, [selectedParentId, selectedSubId]);

  const toggleParent = (id: string) => {
    setOpenParents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSub = (parentId: string, subId: string) => {
    const key = `${parentId}-${subId}`;
    setOpenSubs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card className="flex w-full min-w-0 shrink-0 flex-col border shadow-xs md:w-80 lg:w-96">
      <div className="border-b border-border p-3">
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={onAddParent}>
          Add Parent Category
        </Button>
      </div>
      <nav className="max-h-[min(70vh,560px)] overflow-y-auto p-2" aria-label="Stock tree">
        {filtered.map((parent) => {
          const isParentOpen = openParents[parent.id] ?? false;
          const isParentSelected = selectedParentId === parent.id;
          return (
            <div key={parent.id} className="mb-1">
              <button
                type="button"
                onClick={() => {
                  toggleParent(parent.id);
                  onSelectParent(parent.id);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                  isParentSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-accent',
                  guideHighlightParentId === parent.id && 'ring-2 ring-blue-500/50',
                )}
              >
                {isParentOpen ? (
                  <ChevronDown className="size-4 shrink-0" />
                ) : (
                  <ChevronRight className="size-4 shrink-0" />
                )}
                <span className="flex size-8 shrink-0 items-center justify-center rounded border border-border bg-muted/50 text-[8px] text-muted-foreground">
                  Img
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">{parent.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 shrink-0 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectParent(parent.id);
                  }}
                >
                  Edit
                </Button>
              </button>
              {isParentOpen ? (
                <div className="ms-6 mt-1 space-y-0.5 border-s border-border ps-2">
                  {parent.subs.map((sub) => {
                    const subKey = `${parent.id}-${sub.id}`;
                    const isSubOpen = openSubs[subKey] ?? false;
                    const isSubSelected = selectedSubId === sub.id && selectedParentId === parent.id;
                    return (
                      <div key={sub.id}>
                        <button
                          type="button"
                          onClick={() => {
                            toggleSub(parent.id, sub.id);
                            onSelectSub(parent.id, sub.id);
                          }}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm',
                            isSubSelected ? 'bg-primary/10 text-primary' : 'hover:bg-accent',
                          )}
                        >
                          {isSubOpen ? (
                            <ChevronDown className="size-3.5 shrink-0" />
                          ) : (
                            <ChevronRight className="size-3.5 shrink-0" />
                          )}
                          <span className="min-w-0 flex-1 truncate">{sub.name}</span>
                        </button>
                        {isSubOpen ? (
                          <div className="ms-5 space-y-0.5 border-s border-border ps-2 pt-1">
                            {sub.products.map((pr) => {
                              const isPrSelected =
                                selectedProductId === pr.id &&
                                selectedSubId === sub.id &&
                                selectedParentId === parent.id;
                              return (
                                <button
                                  key={pr.id}
                                  type="button"
                                  onClick={() => onSelectProduct(parent.id, sub.id, pr.id)}
                                  className={cn(
                                    'flex w-full rounded-md px-2 py-1 text-left text-xs',
                                    isPrSelected ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-accent',
                                  )}
                                >
                                  {pr.name}
                                </button>
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </Card>
  );
}
