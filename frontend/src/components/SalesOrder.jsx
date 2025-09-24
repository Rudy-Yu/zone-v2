import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingCart, User, Calendar, DollarSign } from 'lucide-react';
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

const SalesOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [salesOrders, setSalesOrders] = useState([
    {
      id: 'SO-001',
      orderNumber: 'SO-2024-001',
      customerId: 'CUST-001',
      customerName: 'PT. ABC Indonesia',
      orderDate: '2024-01-20',
      deliveryDate: '2024-01-25',
      status: 'Confirmed',
      totalAmount: 45000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 2, unitPrice: 15000000, total: 30000000 },
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 5, unitPrice: 250000, total: 1250000 }
      ],
      createdBy: 'John Sales',
      notes: 'Priority delivery required',
      createdAt: '2024-01-20 10:30:00'
    },
    {
      id: 'SO-002',
      orderNumber: 'SO-2024-002',
      customerId: 'CUST-002',
      customerName: 'CV. XYZ Trading',
      orderDate: '2024-01-19',
      deliveryDate: '2024-01-24',
      status: 'Processing',
      totalAmount: 28000000,
      items: [
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 10, unitPrice: 1200000, total: 12000000 },
        { productId: 'PRD-004', productName: 'Monitor 27"', quantity: 8, unitPrice: 2000000, total: 16000000 }
      ],
      createdBy: 'Jane Sales',
      notes: 'Standard delivery',
      createdAt: '2024-01-19 14:15:00'
    },
    {
      id: 'SO-003',
      orderNumber: 'SO-2024-003',
      customerId: 'CUST-003',
      customerName: 'Toko Maju Jaya',
      orderDate: '2024-01-18',
      deliveryDate: '2024-01-23',
      status: 'Delivered',
      totalAmount: 15000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 1, unitPrice: 15000000, total: 15000000 }
      ],
      createdBy: 'Bob Sales',
      notes: 'Delivered successfully',
      createdAt: '2024-01-18 09:45:00'
    },
    {
      id: 'SO-004',
      orderNumber: 'SO-2024-004',
      customerId: 'CUST-004',
      customerName: 'PT. DEF Corp',
      orderDate: '2024-01-17',
      deliveryDate: '2024-01-22',
      status: 'Cancelled',
      totalAmount: 35000000,
      items: [
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 20, unitPrice: 250000, total: 5000000 },
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 25, unitPrice: 1200000, total: 30000000 }
      ],
      createdBy: 'Alice Sales',
      notes: 'Customer requested cancellation',
      createdAt: '2024-01-17 16:20:00'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    customerId: '',
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    items: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = salesOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    const order = {
      id: `SO-${String(salesOrders.length + 1).padStart(3, '0')}`,
      orderNumber: `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      status: 'Draft',
      totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setSalesOrders([...salesOrders, order]);
    setNewOrder({
      customerId: '',
      customerName: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      items: [],
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
    setSalesOrders(salesOrders.map(order => 
      order.id === editingOrder.id ? { ...order, ...newOrder, totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0) } : order
    ));
    setEditingOrder(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm('Apakah Anda yakin ingin menghapus sales order ini?')) {
      setSalesOrders(salesOrders.filter(order => order.id !== orderId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setSalesOrders(salesOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sales Order Management</h1>
          <p className="text-gray-600">Kelola sales order dan tracking status pengiriman</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Sales Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Edit Sales Order' : 'Buat Sales Order Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update informasi sales order' : 'Masukkan informasi sales order baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer *</Label>
                <Input
                  id="customerName"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({...newOrder, customerName: e.target.value})}
                  placeholder="Nama customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderDate">Tanggal Order *</Label>
                <Input
                  id="orderDate"
                  type="date"
                  value={newOrder.orderDate}
                  onChange={(e) => setNewOrder({...newOrder, orderDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Tanggal Pengiriman *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={newOrder.deliveryDate}
                  onChange={(e) => setNewOrder({...newOrder, deliveryDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mt-6">
              <Label>Item Order</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">Items akan ditambahkan melalui form terpisah</div>
                {newOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total: Rp {newOrder.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada item dalam order ini
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
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">{salesOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Processing</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {salesOrders.filter(o => o.status === 'Processing').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="text-2xl font-bold text-green-600">
                  Rp {salesOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Delivered</div>
                <div className="text-2xl font-bold text-purple-600">
                  {salesOrders.filter(o => o.status === 'Delivered').length}
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
              placeholder="Cari sales order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Sales Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status === 'Processing' && (
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border rounded px-1"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{order.createdBy}</TableCell>
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

export default SalesOrder;


