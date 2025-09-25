import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

// Components
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SalesInvoice from './components/SalesInvoice';
import Products from './components/Products';
import Reports from './components/Reports';
import Manufacturing from './components/Manufacturing';
import Marketing from './components/Marketing';
import Franchise from './components/Franchise';
import Customization from './components/Customization';
import DataManager from './components/DataManager';
import ApiBuilder from './components/ApiBuilder';
import ExcelProcessor from './components/ExcelProcessor';

// New Sales Modules
import Customer from './components/Customer';
import SalesOrder from './components/SalesOrder';
import Quotation from './components/Quotation';

// New Purchase Modules
import Vendor from './components/Vendor';
import PurchaseOrder from './components/PurchaseOrder';
import PurchaseInvoice from './components/PurchaseInvoice';

// New Inventory Modules
import StockOpname from './components/StockOpname';
import TransferStock from './components/TransferStock';

// New Manufacturing Modules
import ProductionOrder from './components/ProductionOrder';

// New Marketing Modules
import MarketingCampaign from './components/MarketingCampaign';

// New Franchise Modules
import FranchisePartner from './components/FranchisePartner';

// New Accounting Modules
import ChartOfAccounts from './components/ChartOfAccounts';
import GeneralJournal from './components/GeneralJournal';
import BankReconciliation from './components/BankReconciliation';

// New System Modules
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';

import { Toaster } from './components/ui/toaster';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');

  // Check for existing auth on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('zoneUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('zoneUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setActiveModule('dashboard');
    localStorage.removeItem('zoneUser');
  };

  const renderActiveComponent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      
      // Sales Modules
      case 'sales-invoice':
        return <SalesInvoice />;
      case 'sales-customer':
        return <Customer />;
      case 'sales-order':
        return <SalesOrder />;
      case 'sales-quotation':
        return <Quotation />;
      
      // Purchase Modules
      case 'purchase-invoice':
        return <PurchaseInvoice />;
      case 'purchase-order':
        return <PurchaseOrder />;
      case 'purchase-vendor':
        return <Vendor />;
      
      // Inventory Modules
      case 'products':
        return <Products />;
      case 'stock-opname':
        return <StockOpname />;
      case 'stock-transfer':
        return <TransferStock />;
      
      // Manufacturing Modules
      case 'manufacturing':
      case 'production-orders':
      case 'bom':
      case 'workstations':
      case 'quality-control':
        return <Manufacturing />;
      case 'production-order':
        return <ProductionOrder />;
      
      // Marketing Modules
      case 'marketing':
      case 'campaigns':
      case 'leads':
      case 'analytics':
      case 'automation':
        return <Marketing />;
      case 'marketing-campaign':
        return <MarketingCampaign />;
      
      // Franchise Modules
      case 'franchise':
      case 'partners':
      case 'territories':
      case 'royalty':
      case 'performance':
        return <Franchise />;
      case 'franchise-partner':
        return <FranchisePartner />;
      
      // Accounting Modules
      case 'chart-accounts':
        return <ChartOfAccounts />;
      case 'journal-entry':
        return <GeneralJournal />;
      case 'bank-reconciliation':
        return <BankReconciliation />;
      case 'balance-sheet':
      case 'profit-loss':
      case 'cash-flow':
      case 'aging-report':
      case 'reports':
        return <Reports />;
      
      // System Modules
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <Settings />;
      
      // Other Modules
      case 'excel-processor':
        return <ExcelProcessor />;
      case 'data-manager':
      case 'data-modules':
        return <DataManager />;
      case 'api-builder':
        return <ApiBuilder />;
      
      default:
        return (
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {getModuleName(activeModule)}
              </h2>
              <p className="text-gray-600">
                Modul ini sedang dalam pengembangan
              </p>
            </div>
          </div>
        );
    }
  };

  const getModuleName = (moduleId) => {
    const moduleNames = {
      // Sales Modules
      'sales-customer': 'Customer Management',
      'sales-order': 'Sales Order',
      'sales-quotation': 'Quotation',
      'sales-invoice': 'Sales Invoice',
      
      // Purchase Modules
      'purchase-vendor': 'Vendor Management',
      'purchase-order': 'Purchase Order',
      'purchase-invoice': 'Invoice Pembelian',
      
      // Inventory Modules
      'products': 'Products',
      'stock-opname': 'Stock Opname',
      'stock-transfer': 'Transfer Stock',
      
      // Manufacturing Modules
      'production-order': 'Production Order',
      'manufacturing': 'Manufacturing',
      
      // Marketing Modules
      'marketing-campaign': 'Marketing Campaign',
      'marketing': 'Marketing',
      
      // Franchise Modules
      'franchise-partner': 'Franchise Partner',
      'franchise': 'Franchise',
      
      // Accounting Modules
      'chart-accounts': 'Chart of Accounts',
      'journal-entry': 'General Journal',
      'balance-sheet': 'Balance Sheet',
      'profit-loss': 'Profit & Loss',
      'cash-flow': 'Cash Flow',
      'aging-report': 'Aging Report',
      'reports': 'Reports',
      
      // System Modules
      'users': 'User Management',
      'settings': 'System Settings',
      
      // Other Modules
      'excel-processor': 'Excel Processor',
      'data-manager': 'Data Manager',
      'api-builder': 'API Builder',
      'dashboard': 'Dashboard'
    };
    return moduleNames[moduleId] || 'Modul';
  };

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div className="App">
          <LoginPage onLogin={handleLogin} />
          <Toaster />
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="App">
        <div className="h-screen flex bg-gray-50">
          {/* Sidebar */}
          <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <Header user={user} onLogout={handleLogout} />
            
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
              {renderActiveComponent()}
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;