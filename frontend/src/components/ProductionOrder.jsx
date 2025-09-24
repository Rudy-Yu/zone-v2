import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Factory, Calendar, Package, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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

const ProductionOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [productionOrders, setProductionOrders] = useState([
    {
      id: 'PO-001',
      orderNumber: 'PO-2024-001',
      productId: 'PRD-001',
      productName: 'Laptop Gaming',
      orderDate: '2024-01-20',
      startDate: '2024-01-22',
      dueDate: '2024-01-30',
      status: 'In Production',
      quantity: 100,
      completedQuantity: 45,
      workstation: 'Assembly Line A',
      assignedWorkers: ['John Worker', 'Jane Worker', 'Bob Worker'],
      bom: [
        { componentId: 'COMP-001', componentName: 'CPU Intel i7', quantity: 100, unitPrice: 5000000, total: 500000000 },
        { componentId: 'COMP-002', componentName: 'RAM 16GB', quantity: 100, unitPrice: 1500000, total: 150000000 },
        { componentId: 'COMP-003', componentName: 'SSD 512GB', quantity: 100, unitPrice: 2000000, total: 200000000 }
      ],
      totalCost: 850000000,
      createdBy: 'John Production',
      notes: 'Priority order for customer',
      createdAt: '2024-01-20 10:30:00'
    },
    {
      id: 'PO-002',
      orderNumber: 'PO-2024-002',
      productId: 'PRD-002',
      productName: 'Mouse Wireless',
      orderDate: '2024-01-19',
      startDate: '2024-01-21',
      dueDate: '2024-01-28',
      status: 'Completed',
      quantity: 500,
      completedQuantity: 500,
      workstation: 'Assembly Line B',
      assignedWorkers: ['Alice Worker', 'Charlie Worker'],
      bom: [
        { componentId: 'COMP-004', componentName: 'Mouse Sensor', quantity: 500, unitPrice: 50000, total: 25000000 },
        { componentId: 'COMP-005', componentName: 'Wireless Module', quantity: 500, unitPrice: 75000, total: 37500000 },
        { componentId: 'COMP-006', componentName: 'Mouse Shell', quantity: 500, unitPrice: 25000, total: 12500000 }
      ],
      totalCost: 75000000,
      createdBy: 'Jane Production',
      notes: 'Completed on time',
      createdAt: '2024-01-19 14:15:00',
      completedDate: '2024-01-28 16:30:00'
    },
    {
      id: 'PO-003',
      orderNumber: 'PO-2024-003',
      productId: 'PRD-003',
      productName: 'Keyboard Mechanical',
      orderDate: '2024-01-18',
      startDate: '2024-01-20',
      dueDate: '2024-01-27',
      status: 'Pending',
      quantity: 200,
      completedQuantity: 0,
      workstation: 'Assembly Line C',
      assignedWorkers: [],
      bom: [
        { componentId: 'COMP-007', componentName: 'Key Switches', quantity: 200, unitPrice: 800000, total: 160000000 },
        { componentId: 'COMP-008', componentName: 'Keyboard PCB', quantity: 200, unitPrice: 300000, total: 60000000 },
        { componentId: 'COMP-009', componentName: 'Keyboard Case', quantity: 200, unitPrice: 100000, total: 20000000 }
      ],
      totalCost: 240000000,
      createdBy: 'Bob Production',
      notes: 'Waiting for materials',
      createdAt: '2024-01-18 09:45:00'
    },
    {
      id: 'PO-004',
      orderNumber: 'PO-2024-004',
      productId: 'PRD-004',
      productName: 'Monitor 27"',
      orderDate: '2024-01-17',
      startDate: '2024-01-19',
      dueDate: '2024-01-26',
      status: 'Cancelled',
      quantity: 50,
      completedQuantity: 0,
      workstation: 'Assembly Line D',
      assignedWorkers: [],
      bom: [
        { componentId: 'COMP-010', componentName: 'LCD Panel', quantity: 50, unitPrice: 3000000, total: 150000000 },
        { componentId: 'COMP-011', componentName: 'Monitor Stand', quantity: 50, unitPrice: 200000, total: 10000000 }
      ],
      totalCost: 160000000,
      createdBy: 'Alice Production',
      notes: 'Cancelled due to component shortage',
      createdAt: '2024-01-17 16:20:00',
      cancelledDate: '2024-01-18 10:30:00'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    productId: '',
    productName: '',
    orderDate: new Date().toISOString().split('T')[0],
    startDate: '',
    dueDate: '',
    quantity: 0,
    workstation: '',
    assignedWorkers: [],
    bom: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Production': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const filteredOrders = productionOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.workstation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    const order = {
      id: `PO-${String(productionOrders.length + 1).padStart(3, '0')}`,
      orderNumber: `PO-2024-${String(productionOrders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      status: 'Draft',
      completedQuantity: 0,
      totalCost: newOrder.bom.reduce((sum, item) => sum + item.total, 0),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setProductionOrders([...productionOrders, order]);
    setNewOrder({
      productId: '',
      productName: '',
      orderDate: new Date().toISOString().split('T')[0],
      startDate: '',
      dueDate: '',
      quantity: 0,
      workstation: '',
      assignedWorkers: [],
      bom: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder(order);
    setIsAddDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    setProductionOrders(productionOrders.map(order => 
      order.id === editingOrder.id ? { 
        ...order, 
        ...newOrder, 
        totalCost: newOrder.bom.reduce((sum, item) => sum + item.total, 0)
      } : order
    ));
    setEditingOrder(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm('Apakah Anda yakin ingin menghapus production order ini?')) {
      setProductionOrders(productionOrders.filter(order => order.id !== orderId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = productionOrders.map(order => {
      if (order.id === orderId) {
        const updated = { ...order, status: newStatus };
        if (newStatus === 'Completed') {
          updated.completedDate = new Date().toISOString();
          updated.completedQuantity = order.quantity;
        } else if (newStatus === 'Cancelled') {
          updated.cancelledDate = new Date().toISOString();
        }
        return updated;
      }
      return order;
    });
    setProductionOrders(updatedOrders);
  };

  const startProduction = (orderId) => {
    updateOrderStatus(orderId, 'In Production');
  };

  const completeProduction = (orderId) => {
    updateOrderStatus(orderId, 'Completed');
  };

  const cancelProduction = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Production Order Management</h1>
          <p className="text-gray-600">Kelola production order dan tracking progress produksi</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Order Produksi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Edit Production Order' : 'Buat Production Order Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update informasi production order' : 'Masukkan informasi production order baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product *</Label>
                <Input
                  id="productName"
                  value={newOrder.productName}
                  onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
                  placeholder="Nama product"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Order Date *</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={newOrder.orderDate}
                  onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newOrder.startDate}
                  onChange={(e) => setNewOrder({...newOrder, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newOrder.dueDate}
                  onChange={(e) => setNewOrder({...newOrder, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workstation">Workstation *</Label>
                <select
                  id="workstation"
                  value={newOrder.workstation}
                  onChange={(e) => setNewOrder({...newOrder, workstation: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Workstation</option>
                  <option value="Assembly Line A">Assembly Line A</option>
                  <option value="Assembly Line B">Assembly Line B</option>
                  <option value="Assembly Line C">Assembly Line C</option>
                  <option value="Assembly Line D">Assembly Line D</option>
                  <option value="Packaging Line">Packaging Line</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* BOM Items */}
            <div className="mt-6">
              <Label>Bill of Materials (BOM)</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">BOM items akan ditambahkan melalui form terpisah</div>
                {newOrder.bom.length > 0 ? (
                  <div className="space-y-2">
                    {newOrder.bom.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.componentName} x {item.quantity}</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total Cost: Rp {newOrder.bom.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada BOM items dalam order ini
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingOrder ? handleUpdateOrder : handleAddOrder}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingOrder ? 'Update Order' : 'Buat Order'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">{productionOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Production</div>
                <div className="text-2xl font-bold text-blue-600">
                  {productionOrders.filter(o => o.status === 'In Production').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {productionOrders.filter(o => o.status === 'Completed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Workers</div>
                <div className="text-2xl font-bold text-purple-600">
                  {productionOrders.reduce((sum, o) => sum + o.assignedWorkers.length, 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari production order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Production Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Production Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Workstation</TableHead>
                <TableHead>Workers</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.productName}</div>
                      <div className="text-sm text-gray-500">Qty: {order.quantity}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <div className={new Date(order.dueDate) < new Date() && order.status !== 'Completed' && order.status !== 'Cancelled' ? 'text-red-600 font-medium' : ''}>
                      {order.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startProduction(order.id)}
                        >
                          Start
                        </Button>
                      )}
                      {order.status === 'In Production' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeProduction(order.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(order.completedQuantity, order.quantity)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {getProgressPercentage(order.completedQuantity, order.quantity)}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {order.completedQuantity}/{order.quantity}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Factory className="h-3 w-3 text-gray-400" />
                      {order.workstation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.assignedWorkers.length} workers</div>
                      {order.assignedWorkers.length > 0 && (
                        <div className="text-gray-500 text-xs">
                          {order.assignedWorkers.slice(0, 2).join(', ')}
                          {order.assignedWorkers.length > 2 && '...'}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {order.totalCost.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditOrder(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionOrder;



