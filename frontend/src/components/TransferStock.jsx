import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Truck, ArrowRight, Package, MapPin, Clock } from 'lucide-react';
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

const TransferStock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [stockTransfers, setStockTransfers] = useState([]);

  useEffect(() => {
    fetchStockTransfers();
  }, []);

  const fetchStockTransfers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/stock-transfers`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStockTransfers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock transfers:', err);
      setError(err.message);
      setStockTransfers([
        {
          id: 'ST-001',
          transfer_number: 'ST-2024-001',
          transfer_date: '2024-01-20',
          from_warehouse: 'Main Warehouse',
          to_warehouse: 'Secondary Warehouse',
          status: 'Completed',
          total_items: 3,
          total_value: 45000000,
          reason: 'Stock redistribution',
          requested_by: 'John Inventory',
          approved_by: 'Jane Manager',
          notes: 'Transfer completed successfully',
          created_at: '2024-01-20 10:30:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newTransfer, setNewTransfer] = useState({
    transfer_date: new Date().toISOString().split('T')[0],
    from_warehouse: '',
    to_warehouse: '',
    reason: '',
    notes: ''
  });

  const handleAddTransfer = async () => {
    try {
      const response = await fetch(`${API_URL}/stock-transfers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransfer,
          items: []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setStockTransfers(prev => [...prev, created]);
      setNewTransfer({
        transfer_date: new Date().toISOString().split('T')[0],
        from_warehouse: '',
        to_warehouse: '',
        reason: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating stock transfer:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditTransfer = (transfer) => {
    setEditingTransfer(transfer);
    setNewTransfer({
      transfer_date: transfer.transfer_date,
      from_warehouse: transfer.from_warehouse,
      to_warehouse: transfer.to_warehouse,
      reason: transfer.reason,
      notes: transfer.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateTransfer = async () => {
    if (!editingTransfer) return;
    try {
      const response = await fetch(`${API_URL}/stock-transfers/${editingTransfer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransfer,
          items: editingTransfer.items || []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setStockTransfers(prev => prev.map(t => t.id === editingTransfer.id ? updated : t));
      setEditingTransfer(null);
      setNewTransfer({
        transfer_date: new Date().toISOString().split('T')[0],
        from_warehouse: '',
        to_warehouse: '',
        reason: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating stock transfer:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteTransfer = async (transferId) => {
    if (!confirm('Hapus transfer stock ini?')) return;
    try {
      const response = await fetch(`${API_URL}/stock-transfers/${transferId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setStockTransfers(prev => prev.filter(t => t.id !== transferId));
    } catch (err) {
      console.error('Error deleting stock transfer:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransfers = stockTransfers.filter(transfer =>
    (transfer.transfer_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transfer.from_warehouse || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transfer.to_warehouse || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (transfer.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data transfer stock...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Transfer Stock</h1>
          <p className="text-gray-600">
            Kelola transfer stock antar gudang
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTransfer ? 'Edit Transfer Stock' : 'Buat Transfer Stock Baru'}</DialogTitle>
              <DialogDescription>
                {editingTransfer ? 'Update informasi transfer stock' : 'Buat transfer stock antar gudang'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transfer_date">Tanggal Transfer</Label>
                <Input
                  id="transfer_date"
                  type="date"
                  value={newTransfer.transfer_date}
                  onChange={(e) => setNewTransfer({...newTransfer, transfer_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_warehouse">Dari Gudang</Label>
                <Input
                  id="from_warehouse"
                  value={newTransfer.from_warehouse}
                  onChange={(e) => setNewTransfer({...newTransfer, from_warehouse: e.target.value})}
                  placeholder="Gudang asal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to_warehouse">Ke Gudang</Label>
                <Input
                  id="to_warehouse"
                  value={newTransfer.to_warehouse}
                  onChange={(e) => setNewTransfer({...newTransfer, to_warehouse: e.target.value})}
                  placeholder="Gudang tujuan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Alasan</Label>
                <Input
                  id="reason"
                  value={newTransfer.reason}
                  onChange={(e) => setNewTransfer({...newTransfer, reason: e.target.value})}
                  placeholder="Alasan transfer"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newTransfer.notes}
                  onChange={(e) => setNewTransfer({...newTransfer, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingTransfer ? handleUpdateTransfer : handleAddTransfer} className="bg-red-500 hover:bg-red-600 text-white">
                {editingTransfer ? 'Update Transfer' : 'Buat Transfer'}
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
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Transfer</div>
                <div className="text-2xl font-bold text-gray-800">{stockTransfers.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold text-green-600">
                  {stockTransfers.filter(t => t.status === 'Completed').length}
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
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stockTransfers.filter(t => t.status === 'In Progress').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ArrowRight className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Value</div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {stockTransfers.reduce((sum, t) => sum + (t.total_value || 0), 0).toLocaleString()}
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
              placeholder="Cari transfer stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Transfer Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer Number</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Dari Gudang</TableHead>
                <TableHead>Ke Gudang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{transfer.transfer_number}</TableCell>
                  <TableCell>{transfer.transfer_date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {transfer.from_warehouse}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      {transfer.to_warehouse}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transfer.total_items}</TableCell>
                  <TableCell className="font-semibold">
                    Rp {(transfer.total_value || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{transfer.requested_by}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTransfer(transfer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTransfer(transfer.id)}
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

export default TransferStock;