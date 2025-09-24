import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
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

const StockOpname = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingOpname, setEditingOpname] = useState(null);
  
  const [stockOpnames, setStockOpnames] = useState([
    {
      id: 'SO-001',
      opnameNumber: 'SO-2024-001',
      opnameDate: '2024-01-20',
      warehouse: 'Main Warehouse',
      status: 'Completed',
      totalItems: 150,
      itemsChecked: 150,
      discrepancies: 5,
      varianceValue: 2500000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', systemQty: 10, actualQty: 12, variance: 2, unitPrice: 15000000, varianceValue: 30000000 },
        { productId: 'PRD-002', productName: 'Mouse Wireless', systemQty: 50, actualQty: 48, variance: -2, unitPrice: 250000, varianceValue: -500000 },
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', systemQty: 25, actualQty: 25, variance: 0, unitPrice: 1200000, varianceValue: 0 }
      ],
      conductedBy: 'John Inventory',
      notes: 'Monthly stock opname completed',
      createdAt: '2024-01-20 10:30:00',
      completedDate: '2024-01-20 16:30:00'
    },
    {
      id: 'SO-002',
      opnameNumber: 'SO-2024-002',
      opnameDate: '2024-01-19',
      warehouse: 'Secondary Warehouse',
      status: 'In Progress',
      totalItems: 75,
      itemsChecked: 45,
      discrepancies: 2,
      varianceValue: 800000,
      items: [
        { productId: 'PRD-004', productName: 'Monitor 27"', systemQty: 8, actualQty: 6, variance: -2, unitPrice: 2000000, varianceValue: -4000000 },
        { productId: 'PRD-005', productName: 'Headset Gaming', systemQty: 15, actualQty: 17, variance: 2, unitPrice: 700000, varianceValue: 1400000 }
      ],
      conductedBy: 'Jane Inventory',
      notes: 'Partial stock opname in progress',
      createdAt: '2024-01-19 14:15:00'
    },
    {
      id: 'SO-003',
      opnameNumber: 'SO-2024-003',
      opnameDate: '2024-01-18',
      warehouse: 'Main Warehouse',
      status: 'Draft',
      totalItems: 200,
      itemsChecked: 0,
      discrepancies: 0,
      varianceValue: 0,
      items: [],
      conductedBy: 'Bob Inventory',
      notes: 'Scheduled for tomorrow',
      createdAt: '2024-01-18 09:45:00'
    },
    {
      id: 'SO-004',
      opnameNumber: 'SO-2024-004',
      opnameDate: '2024-01-17',
      warehouse: 'Main Warehouse',
      status: 'Completed',
      totalItems: 100,
      itemsChecked: 100,
      discrepancies: 0,
      varianceValue: 0,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', systemQty: 5, actualQty: 5, variance: 0, unitPrice: 15000000, varianceValue: 0 },
        { productId: 'PRD-002', productName: 'Mouse Wireless', systemQty: 30, actualQty: 30, variance: 0, unitPrice: 250000, varianceValue: 0 }
      ],
      conductedBy: 'Alice Inventory',
      notes: 'Perfect match - no discrepancies',
      createdAt: '2024-01-17 16:20:00',
      completedDate: '2024-01-17 18:30:00'
    }
  ]);

  const [newOpname, setNewOpname] = useState({
    opnameDate: new Date().toISOString().split('T')[0],
    warehouse: '',
    items: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (variance < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <CheckCircle className="h-4 w-4 text-gray-600" />;
  };

  const filteredOpnames = stockOpnames.filter(opname =>
    opname.opnameNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opname.warehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opname.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOpname = () => {
    const opname = {
      id: `SO-${String(stockOpnames.length + 1).padStart(3, '0')}`,
      opnameNumber: `SO-2024-${String(stockOpnames.length + 1).padStart(3, '0')}`,
      ...newOpname,
      status: 'Draft',
      totalItems: newOpname.items.length,
      itemsChecked: 0,
      discrepancies: 0,
      varianceValue: newOpname.items.reduce((sum, item) => sum + item.varianceValue, 0),
      conductedBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setStockOpnames([...stockOpnames, opname]);
    setNewOpname({
      opnameDate: new Date().toISOString().split('T')[0],
      warehouse: '',
      items: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditOpname = (opname) => {
    setEditingOpname(opname);
    setNewOpname(opname);
    setIsAddDialogOpen(true);
  };

  const handleUpdateOpname = () => {
    setStockOpnames(stockOpnames.map(opname => 
      opname.id === editingOpname.id ? { 
        ...opname, 
        ...newOpname, 
        totalItems: newOpname.items.length,
        varianceValue: newOpname.items.reduce((sum, item) => sum + item.varianceValue, 0)
      } : opname
    ));
    setEditingOpname(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteOpname = (opnameId) => {
    if (confirm('Apakah Anda yakin ingin menghapus stock opname ini?')) {
      setStockOpnames(stockOpnames.filter(opname => opname.id !== opnameId));
    }
  };

  const updateOpnameStatus = (opnameId, newStatus) => {
    const updatedOpnames = stockOpnames.map(opname => {
      if (opname.id === opnameId) {
        const updated = { ...opname, status: newStatus };
        if (newStatus === 'Completed') {
          updated.completedDate = new Date().toISOString();
          updated.itemsChecked = opname.totalItems;
        }
        return updated;
      }
      return opname;
    });
    setStockOpnames(updatedOpnames);
  };

  const startOpname = (opnameId) => {
    updateOpnameStatus(opnameId, 'In Progress');
  };

  const completeOpname = (opnameId) => {
    updateOpnameStatus(opnameId, 'Completed');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Stock Opname Management</h1>
          <p className="text-gray-600">Kelola stock opname dan tracking perbedaan stok</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Stock Opname
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingOpname ? 'Edit Stock Opname' : 'Buat Stock Opname Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingOpname ? 'Update informasi stock opname' : 'Masukkan informasi stock opname baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opnameDate">Tanggal Opname *</Label>
                <Input
                  id="opnameDate"
                  type="date"
                  value={newOpname.opnameDate}
                  onChange={(e) => setNewOpname({...newOpname, opnameDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <select
                  id="warehouse"
                  value={newOpname.warehouse}
                  onChange={(e) => setNewOpname({...newOpname, warehouse: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Warehouse</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Secondary Warehouse">Secondary Warehouse</option>
                  <option value="Distribution Center">Distribution Center</option>
                  <option value="Retail Store">Retail Store</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newOpname.notes}
                  onChange={(e) => setNewOpname({...newOpname, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Opname Items */}
            <div className="mt-6">
              <Label>Item Opname</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">Items akan ditambahkan melalui form terpisah</div>
                {newOpname.items.length > 0 ? (
                  <div className="space-y-2">
                    {newOpname.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName}</span>
                        <div className="flex items-center gap-2">
                          <span>System: {item.systemQty}</span>
                          <span>Actual: {item.actualQty}</span>
                          <span className={getVarianceColor(item.variance)}>
                            Variance: {item.variance > 0 ? '+' : ''}{item.variance}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total Variance Value: Rp {newOpname.items.reduce((sum, item) => sum + item.varianceValue, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada item dalam opname ini
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingOpname ? handleUpdateOpname : handleAddOpname}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
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
                <div className="text-sm text-gray-600">Total Opnames</div>
                <div className="text-2xl font-bold text-gray-800">{stockOpnames.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-blue-600">
                  {stockOpnames.filter(o => o.status === 'In Progress').length}
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
                  {stockOpnames.filter(o => o.status === 'Completed').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Discrepancies</div>
                <div className="text-2xl font-bold text-red-600">
                  {stockOpnames.reduce((sum, o) => sum + o.discrepancies, 0)}
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
                <TableHead>Date</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Discrepancies</TableHead>
                <TableHead>Variance Value</TableHead>
                <TableHead>Conducted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpnames.map((opname) => (
                <TableRow key={opname.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{opname.opnameNumber}</TableCell>
                  <TableCell>{opname.opnameDate}</TableCell>
                  <TableCell>{opname.warehouse}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(opname.status)}>
                        {opname.status}
                      </Badge>
                      {opname.status === 'Draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startOpname(opname.id)}
                        >
                          Start
                        </Button>
                      )}
                      {opname.status === 'In Progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeOpname(opname.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Total: {opname.totalItems}</div>
                      <div>Checked: {opname.itemsChecked}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getVarianceIcon(opname.discrepancies)}
                      <span className={getVarianceColor(opname.discrepancies)}>
                        {opname.discrepancies}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={getVarianceColor(opname.varianceValue)}>
                      Rp {Math.abs(opname.varianceValue).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>{opname.conductedBy}</TableCell>
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



