import React, { lazy } from 'react';
import ProtectedRoute from 'component/ProtectedRoute';
import MainLayout from 'layout/MainLayout';
import Loadable from 'component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/Dashboard/Default')));
const UtilsTypography = Loadable(lazy(() => import('views/Utils/Typography')));
const SamplePage = Loadable(lazy(() => import('views/SamplePage')));
const UserManagementPage = Loadable(lazy(() => import('pages/UserManagementPage')));
const CustomerManagementPage = Loadable(lazy(() => import('pages/CustomerManagementPage')));
const ProductManagementPage = Loadable(lazy(() => import('pages/ProductManagementPage')));
const SalesTransactionPage = Loadable(lazy(() => import('pages/SalesTransactionPage')));
const ReceivingTransactionPage = Loadable(lazy(() => import('pages/ReceivingTransactionPage')));
const ReportsPage = Loadable(lazy(() => import('pages/ReportsPage')));
const CustomerMenuTabletPage = Loadable(lazy(() => import('pages/CustomerMenuTabletPage')));
const NotFoundPage = Loadable(lazy(() => import('pages/NotFoundPage')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <ProtectedRoute />,
  children: [
    {
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <DashboardDefault />
        },
        {
          path: 'dashboard/default',
          element: <DashboardDefault />
        },
        { path: 'utils/util-typography', element: <UtilsTypography /> },
        { path: 'sample-page', element: <SamplePage /> },
        { path: 'user-management', element: <UserManagementPage /> },
        { path: 'customer-management', element: <CustomerManagementPage /> },
        { path: 'product-management', element: <ProductManagementPage /> },
        { path: 'sales-transaction', element: <SalesTransactionPage /> },
        { path: 'receiving-transaction', element: <ReceivingTransactionPage /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'customer-menu-tablet', element: <CustomerMenuTabletPage /> },
        { path: '*', element: <NotFoundPage /> }
      ]
    }
  ]
};

export default MainRoutes;
