import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, Package, Users, RefreshCw, Settings, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = ({ setActiveModule }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [errorType, setErrorType] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    stats: true,
    transactions: true,
    chart: true
  });
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 30000);
    
    // Keyboard shortcut for refresh (Ctrl+R or Cmd+R)
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        fetchDashboardData();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (showRefreshMenu && !event.target.closest('.relative')) {
        setShowRefreshMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showRefreshMenu]);

  const fetchDashboardData = async (isAuto = false, retryAttempt = 0) => {
    try {
      if (!isAuto) {
        setLoading(true);
      }
      setIsAutoRefresh(isAuto);
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/dashboard`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorType = 'network';
        
        if (response.status === 404) {
          errorMessage = 'API endpoint tidak ditemukan';
          errorType = 'not_found';
        } else if (response.status === 500) {
          errorMessage = 'Server mengalami error internal';
          errorType = 'server_error';
        } else if (response.status === 401) {
          errorMessage = 'Unauthorized - silakan login kembali';
          errorType = 'unauthorized';
        }
        
        throw new Error(errorMessage, { cause: { type: errorType, status: response.status } });
      }
      
      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date());
      setError(null);
      setErrorType(null);
      setRetryCount(0);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      
      let errorMessage = err.message;
      let errorType = 'unknown';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout - server tidak merespon';
        errorType = 'timeout';
      } else if (err.cause?.type) {
        errorType = err.cause.type;
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server';
        errorType = 'connection';
      }
      
      setError(errorMessage);
      setErrorType(errorType);
      
      // Auto retry for certain error types (max 3 attempts)
      if (retryAttempt < 3 && ['timeout', 'connection'].includes(errorType) && !isAuto) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1);
          fetchDashboardData(isAuto, retryAttempt + 1);
        }, Math.pow(2, retryAttempt) * 1000); // Exponential backoff
      }
      
      // Fallback to mock data if API fails
      setDashboardData({
        stats: {
          total_revenue: 194258000,
          total_expense: 82450000,
          pending_invoices: 23,
          total_products: 1234,
          revenue_change: 12.5,
          expense_change: -3.2,
          invoice_change: 5,
          product_change: -12
        },
        recent_transactions: [
          { id: "INV-001", type: "Invoice", customer: "PT. ABC Indonesia", amount: "Rp 15.000.000", status: "Paid", date: "2024-01-20" },
          { id: "INV-002", type: "Invoice", customer: "CV. XYZ Trading", amount: "Rp 8.500.000", status: "Pending", date: "2024-01-19" },
          { id: "PO-003", type: "Purchase", customer: "Supplier Materials", amount: "Rp 12.300.000", status: "Paid", date: "2024-01-18" },
          { id: "INV-004", type: "Invoice", customer: "PT. DEF Corp", amount: "Rp 22.100.000", status: "Overdue", date: "2024-01-15" }
        ],
        cash_flow_data: [
          { month: "Agustus", revenue: 150000000, expense: 80000000 },
          { month: "September", revenue: 180000000, expense: 90000000 },
          { month: "Oktober", revenue: 165000000, expense: 75000000 },
          { month: "November", revenue: 200000000, expense: 95000000 },
          { month: "Desember", revenue: 220000000, expense: 100000000 },
          { month: "Januari", revenue: 194258000, expense: 82450000 }
        ]
      });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setIsAutoRefresh(false);
    }
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format number helper
  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch (action) {
      case 'create-invoice':
        setActiveModule('sales-invoice');
        break;
      case 'add-product':
        setActiveModule('products');
        break;
      case 'add-customer':
        setActiveModule('sales-customer');
        break;
      case 'view-reports':
        setActiveModule('reports');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Skeleton loading components
  const StatsSkeleton = () => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="p-3 rounded-full bg-gray-200 animate-pulse">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChartSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-around mb-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-16 w-8 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TransactionSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded-full w-12 animate-pulse"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
          <StatsSkeleton />
        </div>

        {/* Charts and Recent Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <TransactionSkeleton />
        </div>

        {/* Quick Actions Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 rounded-lg">
                  <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !dashboardData) {
    const getErrorIcon = () => {
      switch (errorType) {
        case 'timeout': return '⏱️';
        case 'connection': return '🌐';
        case 'server_error': return '🔧';
        case 'not_found': return '🔍';
        case 'unauthorized': return '🔒';
        default: return '⚠️';
      }
    };

    const getErrorSuggestion = () => {
      switch (errorType) {
        case 'timeout': return 'Coba lagi dalam beberapa saat atau periksa koneksi internet Anda.';
        case 'connection': return 'Periksa koneksi internet dan pastikan server backend berjalan.';
        case 'server_error': return 'Server sedang mengalami masalah. Silakan coba lagi nanti.';
        case 'not_found': return 'Endpoint API tidak ditemukan. Periksa konfigurasi backend.';
        case 'unauthorized': return 'Sesi Anda mungkin telah berakhir. Silakan login kembali.';
        default: return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
      }
    };

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">{getErrorIcon()}</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Data Dashboard</h2>
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500 mb-6">{getErrorSuggestion()}</p>
            
            {retryCount > 0 && (
              <p className="text-sm text-orange-600 mb-4">
                Mencoba lagi... ({retryCount}/3)
              </p>
            )}
            
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => fetchDashboardData()}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mencoba...
                  </>
                ) : (
                  'Coba Lagi'
                )}
              </button>
              
              {errorType === 'connection' && (
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Refresh Halaman
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform API data to component format
  const stats = [
    {
      title: "Total Pendapatan",
      value: formatCurrency(dashboardData.stats.total_revenue),
      change: `${dashboardData.stats.revenue_change > 0 ? '+' : ''}${dashboardData.stats.revenue_change}%`,
      trend: dashboardData.stats.revenue_change > 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Pengeluaran",
      value: formatCurrency(dashboardData.stats.total_expense),
      change: `${dashboardData.stats.expense_change > 0 ? '+' : ''}${dashboardData.stats.expense_change}%`,
      trend: dashboardData.stats.expense_change > 0 ? "up" : "down",
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      title: "Invoice Pending",
      value: formatNumber(dashboardData.stats.pending_invoices),
      change: `+${dashboardData.stats.invoice_change} dari kemarin`,
      trend: dashboardData.stats.invoice_change > 0 ? "up" : "neutral",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Stok Produk",
      value: formatNumber(dashboardData.stats.total_products),
      change: `${dashboardData.stats.product_change > 0 ? '+' : ''}${dashboardData.stats.product_change} item`,
      trend: dashboardData.stats.product_change > 0 ? "up" : "down",
      icon: Package,
      color: "text-purple-600"
    }
  ];

  const recentTransactions = dashboardData.recent_transactions;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Overdue': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.
            {error && (
              <span className="ml-2 text-orange-600 text-sm">
                (Menggunakan data offline)
              </span>
            )}
            {lastUpdated && (
              <span className="ml-2 text-gray-500 text-sm">
                Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
              </span>
            )}
            {isAutoRefresh && (
              <span className="ml-2 text-blue-500 text-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Memperbarui otomatis...
              </span>
            )}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowRefreshMenu(!showRefreshMenu)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <div className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </div>
            {loading ? 'Memuat...' : 'Refresh'}
          </button>
          
          {showRefreshMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    fetchDashboardData();
                    setShowRefreshMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Manual
                </button>
                <button
                  onClick={() => {
                    fetchDashboardData(true);
                    setShowRefreshMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Refresh Otomatis
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <div className="px-4 py-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Settings className="w-3 h-3" />
                    Interval: {refreshInterval}s
                  </div>
                </div>
                <div className="px-4 py-2 text-xs text-gray-400">
                  Shortcut: Ctrl+R
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 flex items-center gap-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                    {stat.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Arus Kas</CardTitle>
            <CardDescription>Perbandingan pemasukan dan pengeluaran 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.cash_flow_data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip 
                    formatter={(value, name) => [
                      formatCurrency(value), 
                      name === 'revenue' ? 'Pemasukan' : 'Pengeluaran'
                    ]}
                    labelFormatter={(label) => `Bulan: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    formatter={(value) => value === 'revenue' ? 'Pemasukan' : 'Pengeluaran'}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981" 
                    name="revenue"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expense" 
                    fill="#ef4444" 
                    name="expense"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>Aktivitas terkini dalam sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{transaction.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{transaction.customer}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{transaction.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Shortcut untuk aktivitas yang sering digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('create-invoice')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 text-center group"
            >
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Buat Invoice</span>
            </button>
            <button 
              onClick={() => handleQuickAction('add-product')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-all duration-200 text-center group"
            >
              <Package className="h-8 w-8 mx-auto mb-2 text-green-600 group-hover:text-green-700 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tambah Produk</span>
            </button>
            <button 
              onClick={() => handleQuickAction('add-customer')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all duration-200 text-center group"
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600 group-hover:text-purple-700 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Tambah Customer</span>
            </button>
            <button 
              onClick={() => handleQuickAction('view-reports')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-all duration-200 text-center group"
            >
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-red-600 group-hover:text-red-700 transition-colors" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Lihat Laporan</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;