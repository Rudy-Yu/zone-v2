import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Factory,
  Target,
  Store,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '../lib/utils';

const Sidebar = ({ activeModule, setActiveModule }) => {
  const [expandedSections, setExpandedSections] = useState({
    sales: false,
    purchase: false,
    inventory: false,
    manufacturing: false,
    marketing: false,
    franchise: false,
    'data-manager': false,
    accounting: false,
    reports: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      type: 'single'
    },
    {
      id: 'sales',
      label: 'Penjualan',
      icon: TrendingUp,
      type: 'expandable',
      submenu: [
        { id: 'sales-invoice', label: 'Invoice Penjualan' },
        { id: 'sales-order', label: 'Sales Order' },
        { id: 'sales-quotation', label: 'Quotation' },
        { id: 'sales-customer', label: 'Customer' }
      ]
    },
    {
      id: 'purchase',
      label: 'Pembelian',
      icon: ShoppingCart,
      type: 'expandable',
      submenu: [
        { id: 'purchase-invoice', label: 'Invoice Pembelian' },
        { id: 'purchase-order', label: 'Purchase Order' },
        { id: 'purchase-vendor', label: 'Vendor' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      type: 'expandable',
      submenu: [
        { id: 'products', label: 'Produk' },
        { id: 'stock-opname', label: 'Stock Opname' },
        { id: 'stock-transfer', label: 'Transfer Stock' }
      ]
    },
    {
      id: 'manufacturing',
      label: 'Manufaktur',
      icon: Factory,
      type: 'expandable',
      submenu: [
        { id: 'production-order', label: 'Production Order' },
        { id: 'production-orders', label: 'Order Produksi' },
        { id: 'bom', label: 'Bill of Materials' },
        { id: 'workstations', label: 'Workstation' },
        { id: 'quality-control', label: 'Quality Control' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing & CRM',
      icon: Target,
      type: 'expandable',
      submenu: [
        { id: 'marketing-campaign', label: 'Marketing Campaign' },
        { id: 'campaigns', label: 'Campaigns' },
        { id: 'leads', label: 'Lead Management' },
        { id: 'analytics', label: 'Marketing Analytics' },
        { id: 'automation', label: 'Automation' }
      ]
    },
    {
      id: 'franchise',
      label: 'Sistem Franchise',
      icon: Store,
      type: 'expandable',
      submenu: [
        { id: 'franchise-partner', label: 'Franchise Partner' },
        { id: 'partners', label: 'Mitra Franchise' },
        { id: 'territories', label: 'Territory' },
        { id: 'royalty', label: 'Royalty' },
        { id: 'performance', label: 'Performance' }
      ]
    },
    {
      id: 'accounting',
      label: 'Akuntansi',
      icon: FileText,
      type: 'expandable',
      submenu: [
        { id: 'chart-accounts', label: 'Chart of Accounts' },
        { id: 'journal-entry', label: 'Jurnal Umum' },
        { id: 'bank-reconciliation', label: 'Rekonsiliasi Bank' }
      ]
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: FileText,
      type: 'expandable',
      submenu: [
        { id: 'balance-sheet', label: 'Neraca' },
        { id: 'profit-loss', label: 'Laba Rugi' },
        { id: 'cash-flow', label: 'Arus Kas' },
        { id: 'aging-report', label: 'Aging Report' }
      ]
    },
    {
      id: 'data-manager',
      label: 'Data Manager',
      icon: Database,
      type: 'expandable',
      submenu: [
        { id: 'excel-processor', label: 'Excel to Module' },
        { id: 'data-modules', label: 'Data Modules' },
        { id: 'api-builder', label: 'API Builder' }
      ]
    },
    {
      id: 'users',
      label: 'Pengguna',
      icon: Users,
      type: 'single'
    },
    {
      id: 'settings',
      label: 'Pengaturan',
      icon: Settings,
      type: 'single'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">Zone</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-1">
            {item.type === 'single' ? (
              <button
                onClick={() => setActiveModule(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-gray-50",
                  activeModule === item.id 
                    ? "text-red-600 bg-red-50 border-r-2 border-red-600" 
                    : "text-gray-700"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ) : (
              <>
                <button
                  onClick={() => toggleSection(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expandedSections[item.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSections[item.id] && (
                  <div className="bg-gray-50">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveModule(subItem.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-8 py-2 text-sm transition-colors hover:bg-gray-100",
                          activeModule === subItem.id 
                            ? "text-red-600 bg-red-50 border-r-2 border-red-600" 
                            : "text-gray-600"
                        )}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="border-t border-gray-200 p-4">
        <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-800 transition-colors">
          <HelpCircle className="h-4 w-4" />
          Bantuan & Support
        </button>
      </div>
    </div>
  );
};

export default Sidebar;