import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
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

const StockOpname = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOpname, setEditingOpname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [stockOpnames, setStockOpnames] = useState([]);

  useEffect(() => {
    fetchStockOpnames();
  }, []);

  const fetchStockOpnames = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/stock-opnames`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setStockOpnames(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock opnames:', err);
      setError(err.message);
      setStockOpnames([
        {
          id: 'SO-001',
          opname_number: 'SO-2024-001',
          opname_date: '2024-01-20',
          warehouse: 'Main Warehouse',
          status: 'Completed',
          total_items: 150,
          items_checked: 150,
          discrepancies: 5,
          variance_value: 2500000,
          conducted_by: 'John Inventory',
          notes: 'Monthly stock opname completed',
          created_at: '2024-01-20 10:30:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newOpname, setNewOpname] = useState({
    opname_date: new Date().toISOString().split('T')[0],
    warehouse: '',
    notes: ''
  });

  const handleAddOpname = async () => {
    try {
      const response = await fetch(`${API_URL}/stock-opnames`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOpname,
          items: []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setStockOpnames(prev => [...prev, created]);
      setNewOpname({
        opname_date: new Date().toISOString().split('T')[0],
        warehouse: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating stock opname:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditOpname = (opname) => {
    setEditingOpname(opname);
    setNewOpname({
      opname_date: opname.opname_date,
      warehouse: opname.warehouse,
      notes: opname.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateOpname = async () => {
    if (!editingOpname) return;
    try {
      const response = await fetch(`${API_URL}/stock-opnames/${editingOpname.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newOpname,
          items: editingOpname.items || []
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setStockOpnames(prev => prev.map(o => o.id === editingOpname.id ? updated : o));
      setEditingOpname(null);
      setNewOpname({
        opname_date: new Date().toISOString().split('T')[0],
        warehouse: '',
        notes: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating stock opname:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteOpname = async (opnameId) => {
    if (!confirm('Hapus stock opname ini?')) return;
    try {
      const response = await fetch(`${API_URL}/stock-opnames/${opnameId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setStockOpnames(prev => prev.filter(o => o.id !== opnameId));
    } catch (err) {
      console.error('Error deleting stock opname:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOpnames = stockOpnames.filter(opname =>
    (opname.opname_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opname.warehouse || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opname.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data stock opname...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Stock Opname</h1>
          <p className="text-gray-600">
            Kelola stock opname dan audit inventori
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Stock Opname
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingOpname ? 'Edit Stock Opname' : 'Buat Stock Opname Baru'}</DialogTitle>
              <DialogDescription>
                {editingOpname ? 'Update informasi stock opname' : 'Buat stock opname baru untuk audit inventori'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opname_date">Tanggal Opname</Label>
                <Input
                  id="opname_date"
                  type="date"
                  value={newOpname.opname_date}
                  onChange={(e) => setNewOpname({...newOpname, opname_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Gudang</Label>
                <Input
                  id="warehouse"
                  value={newOpname.warehouse}
                  onChange={(e) => setNewOpname({...newOpname, warehouse: e.target.value})}
                  placeholder="Nama gudang"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newOpname.notes}
                  onChange={(e) => setNewOpname({...newOpname, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingOpname ? handleUpdateOpname : handleAddOpname} className="bg-red-500 hover:bg-red-600 text-white">
                {editingOpname ? 'Update Opname' : 'Buat Opname'}
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
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Opname</div>
                <div className="text-2xl font-bold text-gray-800">{stockOpnames.length}</div>
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
                  {stockOpnames.filter(o => o.status === 'Completed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stockOpnames.filter(o => o.status === 'In Progress').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Discrepancies</div>
                <div className="text-2xl font-bold text-red-600">
                  {stockOpnames.reduce((sum, o) => sum + (o.discrepancies || 0), 0)}
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
              placeholder="Cari stock opname..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Opnames Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Stock Opname</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opname Number</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Gudang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Items</TableHead>
                <TableHead>Discrepancies</TableHead>
                <TableHead>Variance Value</TableHead>
                <TableHead>Conducted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpnames.map((opname) => (
                <TableRow key={opname.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{opname.opname_number}</TableCell>
                  <TableCell>{opname.opname_date}</TableCell>
                  <TableCell>{opname.warehouse}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(opname.status)}>
                      {opname.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{opname.total_items}</TableCell>
                  <TableCell>
                    <span className={opname.discrepancies > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      {opname.discrepancies}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rp {(opname.variance_value || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>{opname.conducted_by}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditOpname(opname)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteOpname(opname.id)}
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

export default StockOpname;