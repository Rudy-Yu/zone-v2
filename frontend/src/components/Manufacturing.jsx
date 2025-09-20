import React, { useState } from 'react';
import { Factory, Wrench, Clock, Package2, TrendingUp, AlertTriangle } from 'lucide-react';
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

const Manufacturing = () => {
  const [activeTab, setActiveTab] = useState('production');

  // Mock data for manufacturing
  const productionOrders = [
    {
      id: 'PO-001',
      product: 'Laptop Gaming ROG',
      quantity: 50,
      started: '2024-01-15',
      estimated: '2024-01-25',
      status: 'In Progress',
      completion: 75
    },
    {
      id: 'PO-002', 
      product: 'Smartphone Pro Max',
      quantity: 100,
      started: '2024-01-18',
      estimated: '2024-01-28',
      status: 'Planning',
      completion: 0
    },
    {
      id: 'PO-003',
      product: 'Tablet Ultra',
      quantity: 25,
      started: '2024-01-10',
      estimated: '2024-01-20',
      status: 'Completed',
      completion: 100
    }
  ];

  const bomItems = [
    {
      id: 'BOM-001',
      product: 'Laptop Gaming ROG',
      materials: [
        { name: 'Motherboard Gaming', qty: 1, unit: 'pcs', cost: 'Rp 3.500.000' },
        { name: 'RAM DDR5 16GB', qty: 2, unit: 'pcs', cost: 'Rp 2.000.000' },
        { name: 'SSD NVMe 1TB', qty: 1, unit: 'pcs', cost: 'Rp 1.500.000' },
        { name: 'Casing Aluminum', qty: 1, unit: 'pcs', cost: 'Rp 800.000' }
      ],
      totalCost: 'Rp 7.800.000'
    }
  ];

  const workstations = [
    { id: 'WS-001', name: 'Assembly Line 1', status: 'Active', efficiency: 92, currentJob: 'PO-001' },
    { id: 'WS-002', name: 'Quality Control', status: 'Active', efficiency: 88, currentJob: 'PO-001' },
    { id: 'WS-003', name: 'Packaging Line', status: 'Maintenance', efficiency: 0, currentJob: null },
    { id: 'WS-004', name: 'Testing Station', status: 'Active', efficiency: 95, currentJob: 'PO-003' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'On Hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkstationColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      case 'Idle': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manufaktur</h1>
          <p className="text-gray-600">Kelola produksi dan operasi manufaktur</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <Factory className="h-4 w-4 mr-2" />
          Buat Order Produksi
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Order Produksi Aktif</div>
                <div className="text-2xl font-bold text-gray-800">
                  {productionOrders.filter(o => o.status === 'In Progress').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Efisiensi Rata-rata</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(workstations.filter(w => w.status === 'Active').reduce((acc, w) => acc + w.efficiency, 0) / workstations.filter(w => w.status === 'Active').length)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Order Tertunda</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {productionOrders.filter(o => o.status === 'Planning').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Produk Selesai</div>
                <div className="text-2xl font-bold text-purple-600">
                  {productionOrders.filter(o => o.status === 'Completed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="production" className="space-y-6">
        <TabsList>
          <TabsTrigger value="production">Order Produksi</TabsTrigger>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          <TabsTrigger value="workstation">Workstation</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Order Produksi</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Mulai</TableHead>
                    <TableHead>Estimasi Selesai</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity} pcs</TableCell>
                      <TableCell>{order.started}</TableCell>
                      <TableCell>{order.estimated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${order.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{order.completion}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bill of Materials (BOM)</CardTitle>
            </CardHeader>
            <CardContent>
              {bomItems.map((bom) => (
                <div key={bom.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{bom.product}</h3>
                    <span className="text-lg font-bold text-green-600">{bom.totalCost}</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Cost per Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bom.materials.map((material, index) => (
                        <TableRow key={index}>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.qty}</TableCell>
                          <TableCell>{material.unit}</TableCell>
                          <TableCell>{material.cost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workstation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Workstation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workstations.map((station) => (
                  <Card key={station.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{station.name}</h3>
                          <p className="text-sm text-gray-600">{station.id}</p>
                        </div>
                        <Badge className={getWorkstationColor(station.status)}>
                          {station.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Efisiensi</span>
                          <span className="font-medium">{station.efficiency}%</span>
                        </div>
                        {station.currentJob && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Current Job</span>
                            <span className="font-medium">{station.currentJob}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quality Control System</h3>
              <p className="text-gray-600 mb-6">
                Monitor kualitas produk, defect tracking, dan quality metrics
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Setup Quality Control
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Manufacturing;