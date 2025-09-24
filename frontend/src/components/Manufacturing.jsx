import React, { useState } from 'react';
import { Factory, Wrench, Clock, Package2, TrendingUp, AlertTriangle, Plus, Edit, Trash2, Eye } from 'lucide-react';
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
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Manufacturing = () => {
  const [activeTab, setActiveTab] = useState('production');
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isQualityControlOpen, setIsQualityControlOpen] = useState(false);
  const [productionOrders, setProductionOrders] = useState([
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
  ]);

  const [newProductionOrder, setNewProductionOrder] = useState({
    product: '',
    quantity: '',
    startDate: '',
    endDate: '',
    workstation: '',
    worker: '',
    priority: 'Normal',
    notes: ''
  });

  const [qualityControl, setQualityControl] = useState({
    orderId: '',
    inspector: '',
    checkDate: '',
    result: 'Pass',
    notes: ''
  });

  const products = [
    'Laptop Gaming ROG',
    'Smartphone Pro Max',
    'Tablet Ultra',
    'Desktop Workstation',
    'Gaming Monitor'
  ];

  const workers = [
    'John Worker',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown'
  ];

  const handleCreateProductionOrder = () => {
    const order = {
      id: `PO-${String(productionOrders.length + 1).padStart(3, '0')}`,
      ...newProductionOrder,
      quantity: parseInt(newProductionOrder.quantity),
      status: 'Planning',
      completion: 0
    };
    
    setProductionOrders([...productionOrders, order]);
    setNewProductionOrder({
      product: '',
      quantity: '',
      startDate: '',
      endDate: '',
      workstation: '',
      worker: '',
      priority: 'Normal',
      notes: ''
    });
    setIsCreateOrderOpen(false);
  };

  const handleQualityControl = () => {
    // Update production order with quality control result
    setProductionOrders(productionOrders.map(order => 
      order.id === qualityControl.orderId 
        ? { ...order, qualityCheck: qualityControl.result, qualityDate: qualityControl.checkDate }
        : order
    ));
    setQualityControl({
      orderId: '',
      inspector: '',
      checkDate: '',
      result: 'Pass',
      notes: ''
    });
    setIsQualityControlOpen(false);
  };

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
        <div className="flex gap-2">
          <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Factory className="h-4 w-4 mr-2" />
                Buat Order Produksi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Buat Order Produksi Baru</DialogTitle>
                <DialogDescription>
                  Isi informasi untuk order produksi baru.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produk</Label>
                  <Select value={newProductionOrder.product} onValueChange={(value) => setNewProductionOrder({...newProductionOrder, product: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih produk" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product} value={product}>
                          {product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Jumlah</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newProductionOrder.quantity}
                    onChange={(e) => setNewProductionOrder({...newProductionOrder, quantity: e.target.value})}
                    placeholder="Masukkan jumlah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProductionOrder.startDate}
                    onChange={(e) => setNewProductionOrder({...newProductionOrder, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newProductionOrder.endDate}
                    onChange={(e) => setNewProductionOrder({...newProductionOrder, endDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workstation">Workstation</Label>
                  <Select value={newProductionOrder.workstation} onValueChange={(value) => setNewProductionOrder({...newProductionOrder, workstation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih workstation" />
                    </SelectTrigger>
                    <SelectContent>
                      {workstations.map((ws) => (
                        <SelectItem key={ws.id} value={ws.name}>
                          {ws.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="worker">Worker</Label>
                  <Select value={newProductionOrder.worker} onValueChange={(value) => setNewProductionOrder({...newProductionOrder, worker: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih worker" />
                    </SelectTrigger>
                    <SelectContent>
                      {workers.map((worker) => (
                        <SelectItem key={worker} value={worker}>
                          {worker}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioritas</Label>
                  <Select value={newProductionOrder.priority} onValueChange={(value) => setNewProductionOrder({...newProductionOrder, priority: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={newProductionOrder.notes}
                    onChange={(e) => setNewProductionOrder({...newProductionOrder, notes: e.target.value})}
                    placeholder="Masukkan catatan"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOrderOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateProductionOrder} className="bg-red-500 hover:bg-red-600 text-white">
                  Buat Order
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isQualityControlOpen} onOpenChange={setIsQualityControlOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Setup Quality Control
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Setup Quality Control</DialogTitle>
                <DialogDescription>
                  Konfigurasi quality control untuk order produksi.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order Produksi</Label>
                  <Select value={qualityControl.orderId} onValueChange={(value) => setQualityControl({...qualityControl, orderId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih order produksi" />
                    </SelectTrigger>
                    <SelectContent>
                      {productionOrders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.id} - {order.product}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inspector">Inspector</Label>
                  <Input
                    id="inspector"
                    value={qualityControl.inspector}
                    onChange={(e) => setQualityControl({...qualityControl, inspector: e.target.value})}
                    placeholder="Masukkan nama inspector"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkDate">Tanggal Check</Label>
                  <Input
                    id="checkDate"
                    type="date"
                    value={qualityControl.checkDate}
                    onChange={(e) => setQualityControl({...qualityControl, checkDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="result">Hasil</Label>
                  <Select value={qualityControl.result} onValueChange={(value) => setQualityControl({...qualityControl, result: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih hasil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pass">Pass</SelectItem>
                      <SelectItem value="Fail">Fail</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan</Label>
                  <Textarea
                    id="notes"
                    value={qualityControl.notes}
                    onChange={(e) => setQualityControl({...qualityControl, notes: e.target.value})}
                    placeholder="Masukkan catatan quality control"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsQualityControlOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleQualityControl} className="bg-red-500 hover:bg-red-600 text-white">
                  Setup Quality Control
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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