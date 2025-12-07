import React, { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, FileText, DollarSign, Filter, Settings, BarChart3, PieChart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isPeriodDialogOpen, setIsPeriodDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [reportData, setReportData] = useState({
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      growthRate: 0
    },
    inventory: {
      totalProducts: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0
    },
    production: {
      totalOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0,
      efficiency: 0
    }
  });

  const [periodFilter, setPeriodFilter] = useState({
    startDate: '',
    endDate: '',
    period: 'month',
    reportType: 'all'
  });

  const [exportSettings, setExportSettings] = useState({
    format: 'pdf',
    reportType: 'all',
    includeCharts: true,
    includeDetails: true
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reports`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setReportData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message);
      setReportData({
        sales: {
          totalRevenue: 194258000,
          totalOrders: 156,
          averageOrderValue: 1245000,
          growthRate: 12.5
        },
        inventory: {
          totalProducts: 1234,
          lowStockItems: 23,
          outOfStockItems: 5,
          totalValue: 4500000000
        },
        production: {
          totalOrders: 45,
          completedOrders: 32,
          inProgressOrders: 13,
          efficiency: 85.2
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodFilter = () => {
    console.log('Period filter applied:', periodFilter);
    setIsPeriodDialogOpen(false);
    fetchReportData();
  };

  const handleExport = () => {
    console.log('Exporting report with settings:', exportSettings);
    setIsExportDialogOpen(false);
    // In a real app, this would trigger a download
    alert('Report export functionality would be implemented here');
  };

  const reportTypes = [
    {
      id: 'sales',
      name: 'Sales Report',
      description: 'Revenue, orders, and sales performance',
      icon: DollarSign,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels, movements, and valuation',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'production',
      name: 'Production Report',
      description: 'Manufacturing orders and efficiency',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'P&L, cash flow, and financial metrics',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data laporan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Laporan</h1>
          <p className="text-gray-600">
            Analisis dan laporan bisnis
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPeriodDialogOpen} onOpenChange={setIsPeriodDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter Periode
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Periode Laporan</DialogTitle>
                <DialogDescription>
                  Pilih periode untuk laporan yang akan ditampilkan
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={periodFilter.startDate}
                    onChange={(e) => setPeriodFilter({...periodFilter, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Akhir</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={periodFilter.endDate}
                    onChange={(e) => setPeriodFilter({...periodFilter, endDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Periode</Label>
                  <Select value={periodFilter.period} onValueChange={(value) => setPeriodFilter({...periodFilter, period: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Minggu ini</SelectItem>
                      <SelectItem value="month">Bulan ini</SelectItem>
                      <SelectItem value="quarter">Kuartal ini</SelectItem>
                      <SelectItem value="year">Tahun ini</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Jenis Laporan</Label>
                  <Select value={periodFilter.reportType} onValueChange={(value) => setPeriodFilter({...periodFilter, reportType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="sales">Penjualan</SelectItem>
                      <SelectItem value="inventory">Inventori</SelectItem>
                      <SelectItem value="production">Produksi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPeriodDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handlePeriodFilter}>
                  Terapkan Filter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Laporan</DialogTitle>
                <DialogDescription>
                  Pilih format dan pengaturan untuk export laporan
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select value={exportSettings.format} onValueChange={(value) => setExportSettings({...exportSettings, format: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Jenis Laporan</Label>
                  <Select value={exportSettings.reportType} onValueChange={(value) => setExportSettings({...exportSettings, reportType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis laporan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="sales">Penjualan</SelectItem>
                      <SelectItem value="inventory">Inventori</SelectItem>
                      <SelectItem value="production">Produksi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleExport} className="bg-red-500 hover:bg-red-600 text-white">
                  Export
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-800">
                  Rp {reportData.sales.totalRevenue.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  +{reportData.sales.growthRate}% dari bulan lalu
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Produk</div>
                <div className="text-2xl font-bold text-gray-800">
                  {reportData.inventory.totalProducts}
                </div>
                <div className="text-xs text-red-600">
                  {reportData.inventory.lowStockItems} stok menipis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Production Orders</div>
                <div className="text-2xl font-bold text-gray-800">
                  {reportData.production.totalOrders}
                </div>
                <div className="text-xs text-green-600">
                  {reportData.production.efficiency}% efisiensi
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">
                  {reportData.sales.totalOrders}
                </div>
                <div className="text-xs text-gray-600">
                  Rp {reportData.sales.averageOrderValue.toLocaleString()} rata-rata
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {report.description}
                </CardDescription>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Laporan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Inventori</CardTitle>
            <CardDescription>Ringkasan kondisi stok</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Produk</span>
                <Badge variant="outline">{reportData.inventory.totalProducts}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stok Menipis</span>
                <Badge className="bg-yellow-100 text-yellow-800">{reportData.inventory.lowStockItems}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Stok Habis</span>
                <Badge className="bg-red-100 text-red-800">{reportData.inventory.outOfStockItems}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Nilai</span>
                <span className="font-semibold">Rp {reportData.inventory.totalValue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Produksi</CardTitle>
            <CardDescription>Ringkasan manufacturing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Orders</span>
                <Badge variant="outline">{reportData.production.totalOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Selesai</span>
                <Badge className="bg-green-100 text-green-800">{reportData.production.completedOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sedang Produksi</span>
                <Badge className="bg-blue-100 text-blue-800">{reportData.production.inProgressOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Efisiensi</span>
                <span className="font-semibold text-green-600">{reportData.production.efficiency}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;