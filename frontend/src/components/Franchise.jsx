import React, { useState } from 'react';
import { Store, MapPin, Users, TrendingUp, DollarSign, Award, Settings, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';

const Franchise = () => {
  const franchisePartners = [
    {
      id: 'FP-001',
      name: 'PT. Mitra Jakarta Selatan',
      owner: 'John Doe',
      location: 'Jakarta Selatan',
      territory: 'Jakarta Selatan & Sekitarnya',
      joinDate: '2023-06-15',
      status: 'Active',
      revenue: 'Rp 450.000.000',
      royalty: 'Rp 22.500.000',
      outlets: 3,
      performance: 92
    },
    {
      id: 'FP-002',
      name: 'CV. Mitra Surabaya',
      owner: 'Jane Smith',
      location: 'Surabaya',
      territory: 'Surabaya & Jawa Timur',
      joinDate: '2023-08-20',
      status: 'Active',
      revenue: 'Rp 380.000.000',
      royalty: 'Rp 19.000.000',
      outlets: 2,
      performance: 88
    },
    {
      id: 'FP-003',
      name: 'Toko Mitra Bandung',
      owner: 'Bob Wilson',
      location: 'Bandung',
      territory: 'Bandung & Jawa Barat',
      joinDate: '2023-09-10',
      status: 'Under Review',
      revenue: 'Rp 280.000.000',
      royalty: 'Rp 14.000.000',
      outlets: 1,
      performance: 75
    },
    {
      id: 'FP-004',
      name: 'PT. Mitra Medan Utara',
      owner: 'Alice Brown',
      location: 'Medan',
      territory: 'Medan & Sumatera Utara',
      joinDate: '2023-10-05',
      status: 'Pending',
      revenue: 'Rp 0',
      royalty: 'Rp 0',
      outlets: 0,
      performance: 0
    }
  ];

  const territories = [
    { id: 'T-001', region: 'Jakarta & Sekitarnya', status: 'Occupied', partner: 'FP-001', population: '10.5M', potential: 'High' },
    { id: 'T-002', region: 'Jawa Timur', status: 'Occupied', partner: 'FP-002', population: '8.2M', potential: 'High' },
    { id: 'T-003', region: 'Jawa Barat', status: 'Occupied', partner: 'FP-003', population: '6.8M', potential: 'Medium' },
    { id: 'T-004', region: 'Sumatera Utara', status: 'Reserved', partner: 'FP-004', population: '4.5M', potential: 'Medium' },
    { id: 'T-005', region: 'Jawa Tengah', status: 'Available', partner: null, population: '5.2M', potential: 'High' },
    { id: 'T-006', region: 'Bali', status: 'Available', partner: null, population: '2.1M', potential: 'High' }
  ];

  const royaltyPayments = [
    { id: 'ROY-001', partner: 'PT. Mitra Jakarta Selatan', period: 'Januari 2024', amount: 'Rp 22.500.000', status: 'Paid', dueDate: '2024-02-10', paidDate: '2024-02-08' },
    { id: 'ROY-002', partner: 'CV. Mitra Surabaya', period: 'Januari 2024', amount: 'Rp 19.000.000', status: 'Paid', dueDate: '2024-02-10', paidDate: '2024-02-09' },
    { id: 'ROY-003', partner: 'Toko Mitra Bandung', period: 'Januari 2024', amount: 'Rp 14.000.000', status: 'Overdue', dueDate: '2024-02-10', paidDate: null }
  ];

  const franchiseMetrics = {
    totalPartners: franchisePartners.length,
    activePartners: franchisePartners.filter(p => p.status === 'Active').length,
    totalOutlets: franchisePartners.reduce((sum, p) => sum + p.outlets, 0),
    totalRevenue: 1110000000, // Rp 1.11B
    totalRoyalty: 55500000, // Rp 55.5M
    avgPerformance: Math.round(franchisePartners.reduce((sum, p) => sum + p.performance, 0) / franchisePartners.length)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTerritoryStatusColor = (status) => {
    switch (status) {
      case 'Occupied': return 'bg-green-100 text-green-800';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800';
      case 'Available': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoyaltyStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistem Franchise</h1>
          <p className="text-gray-600">Kelola mitra franchise dan ekspansi bisnis</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <Store className="h-4 w-4 mr-2" />
          Tambah Mitra Baru
        </Button>
      </div>

      {/* Franchise KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Mitra</div>
                <div className="text-2xl font-bold text-gray-800">
                  {franchiseMetrics.totalPartners}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Outlet</div>
                <div className="text-2xl font-bold text-green-600">
                  {franchiseMetrics.totalOutlets}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Royalty</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(franchiseMetrics.totalRoyalty)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Avg Performance</div>
                <div className="text-2xl font-bold text-orange-600">
                  {franchiseMetrics.avgPerformance}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList>
          <TabsTrigger value="partners">Mitra Franchise</TabsTrigger>
          <TabsTrigger value="territories">Territory</TabsTrigger>
          <TabsTrigger value="royalty">Royalty</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Mitra Franchise</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mitra</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Outlets</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Royalty</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {franchisePartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{partner.name}</div>
                          <div className="text-sm text-gray-600">{partner.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{partner.owner}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {partner.location}
                        </div>
                      </TableCell>
                      <TableCell>{partner.outlets}</TableCell>
                      <TableCell className="font-medium">{partner.revenue}</TableCell>
                      <TableCell className="font-medium text-green-600">{partner.royalty}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${partner.performance}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{partner.performance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="territories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Territory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Market Potential</TableHead>
                    <TableHead>Current Partner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {territories.map((territory) => (
                    <TableRow key={territory.id}>
                      <TableCell>
                        <div className="font-medium">{territory.region}</div>
                      </TableCell>
                      <TableCell>{territory.population}</TableCell>
                      <TableCell>
                        <Badge className={territory.potential === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {territory.potential}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {territory.partner ? (
                          <span className="text-sm">{territory.partner}</span>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getTerritoryStatusColor(territory.status)}>
                          {territory.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {territory.status === 'Available' && (
                          <Button size="sm" variant="outline">
                            Assign Partner
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="royalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Royalty Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {royaltyPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.partner}</TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell className="font-medium">{payment.amount}</TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        {payment.paidDate || <span className="text-gray-500">-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoyaltyStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Overdue Alert */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-800">Royalty Overdue</h3>
                  <p className="text-red-700 text-sm">
                    1 mitra memiliki pembayaran royalty yang terlambat. Segera follow up.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchisePartners
                    .filter(p => p.status === 'Active')
                    .sort((a, b) => b.performance - a.performance)
                    .map((partner, index) => (
                    <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{partner.name}</div>
                          <div className="text-sm text-gray-600">{partner.location}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{partner.performance}%</div>
                        <div className="text-sm text-gray-600">{partner.outlets} outlets</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {franchisePartners
                    .filter(p => p.status === 'Active')
                    .sort((a, b) => parseInt(b.revenue.replace(/[^\d]/g, '')) - parseInt(a.revenue.replace(/[^\d]/g, '')))
                    .map((partner) => {
                      const revenue = parseInt(partner.revenue.replace(/[^\d]/g, ''));
                      const maxRevenue = 450000000;
                      const percentage = (revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={partner.id} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{partner.name}</span>
                            <span className="font-bold">{partner.revenue}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Franchise;