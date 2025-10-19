import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingCart, User, Calendar, DollarSign, Download } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [salesOrders, setSalesOrders] = useState([]);

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sales-orders`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSalesOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setSalesOrders([
        {
          id: 'SO-001',
          order_number: 'SO-2024-001',
          customer_id: 'CUST-001',
          customer_name: 'PT. ABC Indonesia',
          order_date: '2024-01-20',
          delivery_date: '2024-01-25',
          status: 'Confirmed',
          total_amount: 45000000,
          items: [
            { product_id: 'PRD-001', product_name: 'Laptop Gaming', quantity: 2, unit_price: 15000000, total: 30000000 },
            { product_id: 'PRD-002', product_name: 'Mouse Wireless', quantity: 5, unit_price: 250000, total: 1250000 }
          ],
          created_by: 'John Sales',
          notes: 'Priority delivery required',
          created_at: '2024-01-20 10:30:00'
        },
        {
          id: 'SO-002',
          order_number: 'SO-2024-002',
          customer_id: 'CUST-002',
          customer_name: 'CV. XYZ Trading',
          order_date: '2024-01-19',
          delivery_date: '2024-01-24',
          status: 'Processing',
          total_amount: 28000000,
          items: [
            { product_id: 'PRD-003', product_name: 'Keyboard Mechanical', quantity: 10, unit_price: 1200000, total: 12000000 },
            { product_id: 'PRD-004', product_name: 'Monitor 27"', quantity: 8, unit_price: 2000000, total: 16000000 }
          ],
          created_by: 'Jane Sales',
          notes: 'Standard delivery',
          created_at: '2024-01-19 14:15:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/sales-orders/${orderId}/pdf`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Create download link
      const link = document.createElement('a');
      link.href = data.pdf_path;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert(`Error downloading PDF: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = salesOrders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrder = () => {
    // Implementation for adding new order
    console.log('Add new order');
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsAddDialogOpen(true);
  };

  const handleUpdateOrder = () => {
    // Implementation for updating order
    console.log('Update order');
    setEditingOrder(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOrder = (orderId) => {
    if (confirm('Apakah Anda yakin ingin menghapus sales order ini?')) {
      setSalesOrders(salesOrders.filter(order => order.id !== orderId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setSalesOrders(orders => 
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data sales order...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sales Order</h1>
          <p className="text-gray-600">
            Kelola semua sales order Anda
            {error && (
              <span className="ml-2 text-orange-600 text-sm">
                (Menggunakan data offline)
              </span>
            )}
          </p>
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
                {editingOrder ? 'Ubah informasi sales order' : 'Isi informasi sales order baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nama Customer</Label>
                  <Input id="customerName" placeholder="Pilih customer" />
                </div>
                <div>
                  <Label htmlFor="orderDate">Tanggal Order</Label>
                  <Input id="orderDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Tanggal Pengiriman</Label>
                  <Input id="deliveryDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="w-full p-2 border rounded-md">
                    <option value="Draft">Draft</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Catatan</Label>
                <textarea 
                  id="notes" 
                  className="w-full p-2 border rounded-md" 
                  rows="3"
                  placeholder="Catatan tambahan..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={editingOrder ? handleUpdateOrder : handleAddOrder}>
                {editingOrder ? 'Update' : 'Buat Order'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{salesOrders.length}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {salesOrders.filter(o => o.status === 'Confirmed').length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-blue-600">
                  {salesOrders.filter(o => o.status === 'Processing').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  Rp {salesOrders.reduce((sum, order) => sum + order.total_amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan order number, customer, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

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
                <TableHead>Tanggal Order</TableHead>
                <TableHead>Tanggal Pengiriman</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell>{order.customer_name}</TableCell>
                  <TableCell>{order.order_date}</TableCell>
                  <TableCell>{order.delivery_date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {order.total_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadPDF(order.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="text-red-600 hover:text-red-700"
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