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
import ExcelProcessor from './components/ExcelProcessor';
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
      case 'sales-invoice':
        return <SalesInvoice />;
      case 'products':
        return <Products />;
      case 'balance-sheet':
      case 'profit-loss':
      case 'cash-flow':
      case 'aging-report':
      case 'reports':
        return <Reports />;
      case 'manufacturing':
      case 'production-orders':
      case 'bom':
      case 'workstations':
      case 'quality-control':
        return <Manufacturing />;
      case 'marketing':
      case 'campaigns':
      case 'leads':
      case 'analytics':
      case 'automation':
        return <Marketing />;
      case 'franchise':
      case 'partners':
      case 'territories':
      case 'royalty':
      case 'performance':
        return <Franchise />;
      case 'excel-processor':
        return <ExcelProcessor />;
      case 'data-manager':
      case 'data-modules':
      case 'api-builder':
        return <DataManager />;
      case 'settings':
        return <Customization />;
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
      'sales-order': 'Sales Order',
      'sales-quotation': 'Quotation',
      'sales-customer': 'Customer',
      'purchase-invoice': 'Invoice Pembelian',
      'purchase-order': 'Purchase Order',
      'purchase-vendor': 'Vendor',
      'inventory': 'Inventory',
      'stock-opname': 'Stock Opname',
      'stock-transfer': 'Transfer Stock',
      'chart-accounts': 'Chart of Accounts',
      'journal-entry': 'Jurnal Umum',
      'bank-reconciliation': 'Rekonsiliasi Bank',
      'users': 'Pengguna',
      'settings': 'Pengaturan'
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