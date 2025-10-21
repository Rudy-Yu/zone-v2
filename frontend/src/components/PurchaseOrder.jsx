import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingBag, Building, Calendar, DollarSign, Package, Download } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendors, setVendors] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchVendors();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/purchase-orders`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPurchaseOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(err.message);
      setPurchaseOrders([
        {
          id: 'PO-001',
          order_number: 'PO-2024-001',
          vendor_id: 'VEN-001',
          vendor_name: 'PT. Supplier ABC',
          order_date: '2024-01-20',
          expected_delivery: '2024-01-25',
          status: 'Ordered',
          total_amount: 75000000,
          created_by: 'John Purchasing',
          notes: 'Priority order',
          created_at: '2024-01-20 10:30:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVendors(data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setVendors([
        { id: 'VEN-001', name: 'PT. Supplier ABC' },
        { id: 'VEN-002', name: 'CV. Distributor XYZ' }
      ]);
    }
  };

  const [newOrder, setNewOrder] = useState({
    vendor_id: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
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
    (order.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/purchase-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setPurchaseOrders(prev => [...prev, created]);
      setNewOrder({
        vendor_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating purchase order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({
      vendor_id: order.vendor_id,
      order_date: order.order_date,
      expected_delivery: order.expected_delivery,
      notes: order.notes
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    try {
      const response = await fetch(`${API_URL}/purchase-orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setPurchaseOrders(prev => prev.map(o => o.id === editingOrder.id ? updated : o));
      setEditingOrder(null);
      setNewOrder({
        vendor_id: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_delivery: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating purchase order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus purchase order ini?')) return;
    try {
      const response = await fetch(`${API_URL}/purchase-orders/${orderId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setPurchaseOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error('Error deleting purchase order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/purchase-orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setPurchaseOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(`Error: ${err.message}`);
    }
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

  const downloadPDF = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/purchase-orders/${orderId}/pdf`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `purchase-order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data purchase order...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase Order Management</h1>
          <p className="text-gray-600">
            Kelola purchase order dan tracking status pembelian
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
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
                <Label htmlFor="vendor_id">Vendor *</Label>
                <select
                  id="vendor_id"
                  value={newOrder.vendor_id}
                  onChange={(e) => setNewOrder({...newOrder, vendor_id: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_date">Tanggal Order *</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={newOrder.order_date}
                  onChange={(e) => setNewOrder({...newOrder, order_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_delivery">Expected Delivery *</Label>
                <Input
                  id="expected_delivery"
                  type="date"
                  value={newOrder.expected_delivery}
                  onChange={(e) => setNewOrder({...newOrder, expected_delivery: e.target.value})}
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
                <div className="text-center py-4 text-gray-500">
                  Belum ada item dalam order ini
                </div>
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
                  Rp {purchaseOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0).toLocaleString()}
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
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.vendor_name}</div>
                      <div className="text-sm text-gray-500">{order.vendor_id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.order_date}</TableCell>
                  <TableCell>
                    <div className={new Date(order.expected_delivery) < new Date() && order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'text-red-600 font-medium' : ''}>
                      {order.expected_delivery}
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
                  <TableCell className="font-semibold">Rp {(order.total_amount || 0).toLocaleString()}</TableCell>
                  <TableCell>{order.created_by}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => downloadPDF(order.id)}>
                        <Download className="h-4 w-4" />
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



