import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { navigationItems } from '@/mock/dashboardData';

export function MainLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed((previous) => !previous);
  }, []);

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <>
      <div className="flex min-h-screen w-full min-w-0 bg-background">
        <Sidebar
          items={navigationItems}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
        />
        <div className="flex min-w-0 w-full flex-1 flex-col">
          <Header onOpenMobileSidebar={openMobileSidebar} />
          <main className="flex w-full min-w-0 flex-1 flex-col overflow-x-hidden p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
