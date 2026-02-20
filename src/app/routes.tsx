import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { OrdersPage } from './components/OrdersPage';
import { ClientsPage } from './components/ClientsPage';
import { WorkflowPage } from './components/WorkflowPage';
import { BillingPage } from './components/BillingPage';
import { SettingsPage } from './components/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Dashboard /></Layout>,
  },
  {
    path: '/orders',
    element: <Layout><OrdersPage /></Layout>,
  },
  {
    path: '/clients',
    element: <Layout><ClientsPage /></Layout>,
  },
  {
    path: '/workflow',
    element: <Layout><WorkflowPage /></Layout>,
  },
  {
    path: '/billing',
    element: <Layout><BillingPage /></Layout>,
  },
  {
    path: '/settings',
    element: <Layout><SettingsPage /></Layout>,
  },
]);
