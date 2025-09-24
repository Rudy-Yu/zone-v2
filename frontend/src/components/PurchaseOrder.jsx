import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingBag, Building, Calendar, DollarSign, Package } from 'lucide-react';
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

const PurchaseOrder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: 'PO-001',
      orderNumber: 'PO-2024-001',
      vendorId: 'VEN-001',
      vendorName: 'PT. Supplier ABC',
      orderDate: '2024-01-20',
      expectedDelivery: '2024-01-25',
      status: 'Ordered',
      totalAmount: 75000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 5, unitPrice: 15000000, total: 75000000 }
      ],
      createdBy: 'John Purchasing',
      notes: 'Priority order',
      createdAt: '2024-01-20 10:30:00',
      orderedDate: '2024-01-20 14:00:00'
    },
    {
      id: 'PO-002',
      orderNumber: 'PO-2024-002',
      vendorId: 'VEN-002',
      vendorName: 'CV. Distributor XYZ',
      orderDate: '2024-01-19',
      expectedDelivery: '2024-01-24',
      status: 'Shipped',
      totalAmount: 48000000,
      items: [
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 20, unitPrice: 1200000, total: 24000000 },
        { productId: 'PRD-004', productName: 'Monitor 27"', quantity: 12, unitPrice: 2000000, total: 24000000 }
      ],
      createdBy: 'Jane Purchasing',
      notes: 'Standard delivery',
      createdAt: '2024-01-19 14:15:00',
      orderedDate: '2024-01-19 16:30:00',
      shippedDate: '2024-01-22 09:15:00'
    },
    {
      id: 'PO-003',
      orderNumber: 'PO-2024-003',
      vendorId: 'VEN-003',
      vendorName: 'PT. Trading DEF',
      orderDate: '2024-01-18',
      expectedDelivery: '2024-01-23',
      status: 'Delivered',
      totalAmount: 30000000,
      items: [
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 50, unitPrice: 250000, total: 12500000 },
        { productId: 'PRD-005', productName: 'Headset Gaming', quantity: 25, unitPrice: 700000, total: 17500000 }
      ],
      createdBy: 'Bob Purchasing',
      notes: 'Delivered successfully',
      createdAt: '2024-01-18 09:45:00',
      orderedDate: '2024-01-18 11:20:00',
      deliveredDate: '2024-01-23 14:30:00'
    },
    {
      id: 'PO-004',
      orderNumber: 'PO-2024-004',
      vendorId: 'VEN-004',
      vendorName: 'PT. Logistics GHI',
      orderDate: '2024-01-17',
      expectedDelivery: '2024-01-22',
      status: 'Cancelled',
      totalAmount: 20000000,
      items: [
        { productId: 'PRD-006', productName: 'Webcam HD', quantity: 10, unitPrice: 2000000, total: 20000000 }
      ],
      createdBy: 'Alice Purchasing',
      notes: 'Vendor unable to fulfill',
      createdAt: '2024-01-17 16:20:00',
      cancelledDate: '2024-01-21 10:00:00'
    }
  ]);

  const [newOrder, setNewOrder] = useState({
    vendorId: '',
    vendorName: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    items: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Ordered': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = purchaseOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    const order = {
      id: `PO-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      orderNumber: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      ...newOrder,
      status: 'Draft',
      totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setPurchaseOrders([...purchaseOrders, order]);
    setNewOrder({
      vendorId: '',
      vendorName: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: '',
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
    setPurchaseOrders(purchaseOrders.map(order => 
      order.id === editingOrder.id ? { ...order, ...newOrder, totalAmount: newOrder.items.reduce((sum, item) => sum + item.total, 0) } : order
    ));
    setEditingOrder(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm('Apakah Anda yakin ingin menghapus purchase order ini?')) {
      setPurchaseOrders(purchaseOrders.filter(order => order.id !== orderId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = purchaseOrders.map(order => {
      if (order.id === orderId) {
        const updated = { ...order, status: newStatus };
        if (newStatus === 'Ordered') {
          updated.orderedDate = new Date().toISOString();
        } else if (newStatus === 'Shipped') {
          updated.shippedDate = new Date().toISOString();
        } else if (newStatus === 'Delivered') {
          updated.deliveredDate = new Date().toISOString();
        } else if (newStatus === 'Cancelled') {
          updated.cancelledDate = new Date().toISOString();
        }
        return updated;
      }
      return order;
    });
    setPurchaseOrders(updatedOrders);
  };

  const orderOrder = (orderId) => {
    updateOrderStatus(orderId, 'Ordered');
  };

  const shipOrder = (orderId) => {
    updateOrderStatus(orderId, 'Shipped');
  };

  const deliverOrder = (orderId) => {
    updateOrderStatus(orderId, 'Delivered');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase Order Management</h1>
          <p className="text-gray-600">Kelola purchase order dan tracking status pembelian</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Purchase Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? 'Edit Purchase Order' : 'Buat Purchase Order Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update informasi purchase order' : 'Masukkan informasi purchase order baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor *</Label>
                <Input
                  id="vendorName"
                  value={newOrder.vendorName}
                  onChange={(e) => setNewOrder({...newOrder, vendorName: e.target.value})}
                  placeholder="Nama vendor"
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
                <Label htmlFor="expectedDelivery">Expected Delivery *</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={newOrder.expectedDelivery}
                  onChange={(e) => setNewOrder({...newOrder, expectedDelivery: e.target.value})}
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
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">{purchaseOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Ordered</div>
                <div className="text-2xl font-bold text-blue-600">
                  {purchaseOrders.filter(o => o.status === 'Ordered').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Shipped</div>
                <div className="text-2xl font-bold text-purple-600">
                  {purchaseOrders.filter(o => o.status === 'Shipped').length}
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
                  Rp {purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
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
              placeholder="Cari purchase order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
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
                      <div className="font-medium">{order.vendorName}</div>
                      <div className="text-sm text-gray-500">{order.vendorId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <div className={new Date(order.expectedDelivery) < new Date() && order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'text-red-600 font-medium' : ''}>
                      {order.expectedDelivery}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status === 'Draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => orderOrder(order.id)}
                        >
                          Order
                        </Button>
                      )}
                      {order.status === 'Ordered' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shipOrder(order.id)}
                        >
                          Ship
                        </Button>
                      )}
                      {order.status === 'Shipped' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deliverOrder(order.id)}
                        >
                          Deliver
                        </Button>
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

export default PurchaseOrder;



