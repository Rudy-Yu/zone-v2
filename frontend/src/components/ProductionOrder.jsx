import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Factory, Calendar, Package, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [productionOrders, setProductionOrders] = useState([]);

  useEffect(() => {
    fetchProductionOrders();
  }, []);

  const fetchProductionOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/production-orders`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProductionOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching production orders:', err);
      setError(err.message);
      setProductionOrders([
        {
          id: 'PO-001',
          order_number: 'PO-2024-001',
          product_id: 'PRD-001',
          product_name: 'Laptop Gaming',
          order_date: '2024-01-20',
          start_date: '2024-01-22',
          due_date: '2024-01-30',
          status: 'In Production',
          quantity: 100,
          completed_quantity: 45,
          workstation: 'Assembly Line A',
          assigned_workers: ['John Worker', 'Jane Worker', 'Bob Worker'],
          created_by: 'Production Manager',
          notes: 'High priority order',
          created_at: '2024-01-20 10:30:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newOrder, setNewOrder] = useState({
    product_id: '',
    product_name: '',
    order_date: new Date().toISOString().split('T')[0],
    start_date: '',
    due_date: '',
    quantity: '',
    workstation: '',
    notes: ''
  });

  const handleAddOrder = async () => {
    try {
      const response = await fetch(`${API_URL}/production-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          quantity: parseInt(newOrder.quantity),
          bom: []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setProductionOrders(prev => [...prev, created]);
      setNewOrder({
        product_id: '',
        product_name: '',
        order_date: new Date().toISOString().split('T')[0],
        start_date: '',
        due_date: '',
        quantity: '',
        workstation: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating production order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setNewOrder({
      product_id: order.product_id,
      product_name: order.product_name,
      order_date: order.order_date,
      start_date: order.start_date,
      due_date: order.due_date,
      quantity: order.quantity.toString(),
      workstation: order.workstation,
      notes: order.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    try {
      const response = await fetch(`${API_URL}/production-orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOrder,
          quantity: parseInt(newOrder.quantity),
          bom: editingOrder.bom || []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setProductionOrders(prev => prev.map(o => o.id === editingOrder.id ? updated : o));
      setEditingOrder(null);
      setNewOrder({
        product_id: '',
        product_name: '',
        order_date: new Date().toISOString().split('T')[0],
        start_date: '',
        due_date: '',
        quantity: '',
        workstation: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating production order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Hapus production order ini?')) return;
    try {
      const response = await fetch(`${API_URL}/production-orders/${orderId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setProductionOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error('Error deleting production order:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Production': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const filteredOrders = productionOrders.filter(order =>
    (order.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.product_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data production order...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Production Order</h1>
          <p className="text-gray-600">
            Kelola production order dan manufacturing
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Production Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingOrder ? 'Edit Production Order' : 'Buat Production Order Baru'}</DialogTitle>
              <DialogDescription>
                {editingOrder ? 'Update informasi production order' : 'Buat production order baru untuk manufacturing'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Nama Produk</Label>
                <Input
                  id="product_name"
                  value={newOrder.product_name}
                  onChange={(e) => setNewOrder({...newOrder, product_name: e.target.value})}
                  placeholder="Nama produk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_date">Tanggal Order</Label>
                <Input
                  id="order_date"
                  type="date"
                  value={newOrder.order_date}
                  onChange={(e) => setNewOrder({...newOrder, order_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_date">Tanggal Mulai</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newOrder.start_date}
                  onChange={(e) => setNewOrder({...newOrder, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Tanggal Selesai</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newOrder.due_date}
                  onChange={(e) => setNewOrder({...newOrder, due_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                  placeholder="Jumlah produksi"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workstation">Workstation</Label>
                <Input
                  id="workstation"
                  value={newOrder.workstation}
                  onChange={(e) => setNewOrder({...newOrder, workstation: e.target.value})}
                  placeholder="Workstation"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingOrder ? handleUpdateOrder : handleAddOrder} className="bg-red-500 hover:bg-red-600 text-white">
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
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Production</div>
                <div className="text-2xl font-bold text-yellow-600">
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
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Quantity</div>
                <div className="text-2xl font-bold text-purple-600">
                  {productionOrders.reduce((sum, o) => sum + (o.quantity || 0), 0)}
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
                <TableHead>Produk</TableHead>
                <TableHead>Tanggal Order</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Workstation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const progress = getProgressPercentage(order.completed_quantity || 0, order.quantity || 1);
                return (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.product_name}</div>
                        <div className="text-sm text-gray-500">{order.product_id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>
                      <div className={new Date(order.due_date) < new Date() && order.status !== 'Completed' ? 'text-red-600 font-medium' : ''}>
                        {order.due_date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-semibold">{order.completed_quantity || 0} / {order.quantity}</div>
                        <div className="text-xs text-gray-500">Completed / Total</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.workstation}</TableCell>
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionOrder;