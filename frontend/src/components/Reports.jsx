import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, FileText, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const reportTypes = [
    {
      id: 'balance-sheet',
      title: 'Neraca',
      description: 'Posisi keuangan perusahaan',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'profit-loss',
      title: 'Laba Rugi',
      description: 'Pendapatan dan beban perusahaan',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'cash-flow',
      title: 'Arus Kas',
      description: 'Aliran kas masuk dan keluar',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'aging-report',
      title: 'Aging Report',
      description: 'Umur piutang dan hutang',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const financialSummary = {
    revenue: 'Rp 194.258.000',
    expense: 'Rp 82.450.000',
    profit: 'Rp 111.808.000',
    margin: '57.5%'
  };

  const topCustomers = [
    { name: 'PT. ABC Indonesia', amount: 'Rp 45.000.000', percentage: 23 },
    { name: 'CV. XYZ Trading', amount: 'Rp 32.500.000', percentage: 17 },
    { name: 'PT. DEF Corp', amount: 'Rp 28.750.000', percentage: 15 },
    { name: 'Toko Maju Jaya', amount: 'Rp 21.000.000', percentage: 11 }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 15000000, expense: 8000000 },
    { month: 'Feb', revenue: 18000000, expense: 9500000 },
    { month: 'Mar', revenue: 22000000, expense: 11000000 },
    { month: 'Apr', revenue: 19000000, expense: 10200000 },
    { month: 'Mei', revenue: 24000000, expense: 12500000 },
    { month: 'Jun', revenue: 21000000, expense: 11000000 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Laporan</h1>
          <p className="text-gray-600">Analisis keuangan dan performa bisnis Anda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Pilih Periode
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">{financialSummary.revenue}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">{financialSummary.expense}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600 rotate-180" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Laba Bersih</p>
                <p className="text-2xl font-bold text-blue-600">{financialSummary.profit}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margin Keuntungan</p>
                <p className="text-2xl font-bold text-purple-600">{financialSummary.margin}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Laporan Detail</TabsTrigger>
          <TabsTrigger value="custom">Custom Report</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tren Pendapatan vs Pengeluaran</CardTitle>
                <CardDescription>6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
                  {monthlyData.map((data) => (
                    <div key={data.month} className="flex flex-col items-center gap-2">
                      <div className="flex gap-1 items-end">
                        <div 
                          className="bg-green-500 w-6 rounded-t"
                          style={{ height: `${(data.revenue / 25000000) * 120}px` }}
                        ></div>
                        <div 
                          className="bg-red-500 w-6 rounded-t"
                          style={{ height: `${(data.expense / 25000000) * 120}px` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">{data.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Pendapatan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">Pengeluaran</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Customer</CardTitle>
                <CardDescription>Berdasarkan nilai transaksi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${customer.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-gray-800">{customer.amount}</p>
                        <p className="text-sm text-gray-600">{customer.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Report Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`p-4 ${report.bgColor} rounded-lg inline-block mb-4`}>
                    <report.icon className={`h-8 w-8 ${report.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Laporan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Laporan Laba Rugi - Januari 2024', date: '2024-01-31', status: 'Ready' },
                  { name: 'Neraca - Desember 2023', date: '2024-01-15', status: 'Ready' },
                  { name: 'Arus Kas - Q4 2023', date: '2024-01-10', status: 'Processing' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{report.name}</p>
                      <p className="text-sm text-gray-600">{report.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {report.status}
                      </Badge>
                      {report.status === 'Ready' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Buat laporan sesuai kebutuhan Anda</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Custom Report Builder</h3>
              <p className="text-gray-600 mb-6">Fitur ini memungkinkan Anda membuat laporan khusus dengan filter dan parameter yang dapat disesuaikan.</p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Mulai Buat Laporan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;