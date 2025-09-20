import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, Package, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Pendapatan",
      value: "Rp 194.258.000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Pengeluaran",
      value: "Rp 82.450.000",
      change: "-3.2%",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600"
    },
    {
      title: "Invoice Pending",
      value: "23",
      change: "+5 dari kemarin",
      trend: "neutral",
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Stok Produk",
      value: "1,234",
      change: "-12 item",
      trend: "down",
      icon: Package,
      color: "text-purple-600"
    }
  ];

  const recentTransactions = [
    { id: "INV-001", type: "Invoice", customer: "PT. ABC Indonesia", amount: "Rp 15.000.000", status: "Paid", date: "2024-01-20" },
    { id: "INV-002", type: "Invoice", customer: "CV. XYZ Trading", amount: "Rp 8.500.000", status: "Pending", date: "2024-01-19" },
    { id: "PO-003", type: "Purchase", customer: "Supplier Materials", amount: "Rp 12.300.000", status: "Paid", date: "2024-01-18" },
    { id: "INV-004", type: "Invoice", customer: "PT. DEF Corp", amount: "Rp 22.100.000", status: "Overdue", date: "2024-01-15" }
  ];

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
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Selamat datang kembali! Berikut ringkasan bisnis Anda hari ini.</p>
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
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex justify-around mb-4">
                  <div className="bg-green-500 h-20 w-8 rounded"></div>
                  <div className="bg-red-500 h-16 w-8 rounded"></div>
                  <div className="bg-green-500 h-24 w-8 rounded"></div>
                  <div className="bg-red-500 h-12 w-8 rounded"></div>
                  <div className="bg-green-500 h-28 w-8 rounded"></div>
                  <div className="bg-red-500 h-14 w-8 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">Grafik Arus Kas</p>
              </div>
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
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <span className="text-sm font-medium">Buat Invoice</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <span className="text-sm font-medium">Tambah Produk</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <span className="text-sm font-medium">Tambah Customer</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <span className="text-sm font-medium">Lihat Laporan</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;