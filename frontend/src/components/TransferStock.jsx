import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Truck, ArrowRight, Package, MapPin, Clock } from 'lucide-react';
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

const TransferStock = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);
  
  const [stockTransfers, setStockTransfers] = useState([
    {
      id: 'ST-001',
      transferNumber: 'ST-2024-001',
      transferDate: '2024-01-20',
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Secondary Warehouse',
      status: 'Completed',
      totalItems: 3,
      totalValue: 45000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 2, unitPrice: 15000000, total: 30000000 },
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 10, unitPrice: 250000, total: 2500000 },
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 5, unitPrice: 1200000, total: 6000000 }
      ],
      reason: 'Stock redistribution',
      requestedBy: 'John Inventory',
      approvedBy: 'Jane Manager',
      notes: 'Transfer completed successfully',
      createdAt: '2024-01-20 10:30:00',
      completedDate: '2024-01-20 16:30:00'
    },
    {
      id: 'ST-002',
      transferNumber: 'ST-2024-002',
      transferDate: '2024-01-19',
      fromWarehouse: 'Secondary Warehouse',
      toWarehouse: 'Distribution Center',
      status: 'In Transit',
      totalItems: 2,
      totalValue: 24000000,
      items: [
        { productId: 'PRD-004', productName: 'Monitor 27"', quantity: 8, unitPrice: 2000000, total: 16000000 },
        { productId: 'PRD-005', productName: 'Headset Gaming', quantity: 20, unitPrice: 700000, total: 14000000 }
      ],
      reason: 'Customer order fulfillment',
      requestedBy: 'Bob Inventory',
      approvedBy: 'Alice Manager',
      notes: 'In transit to distribution center',
      createdAt: '2024-01-19 14:15:00',
      shippedDate: '2024-01-20 09:00:00'
    },
    {
      id: 'ST-003',
      transferNumber: 'ST-2024-003',
      transferDate: '2024-01-18',
      fromWarehouse: 'Main Warehouse',
      toWarehouse: 'Retail Store',
      status: 'Pending',
      totalItems: 1,
      totalValue: 15000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 1, unitPrice: 15000000, total: 15000000 }
      ],
      reason: 'Store replenishment',
      requestedBy: 'Charlie Inventory',
      approvedBy: null,
      notes: 'Awaiting approval from manager',
      createdAt: '2024-01-18 09:45:00'
    },
    {
      id: 'ST-004',
      transferNumber: 'ST-2024-004',
      transferDate: '2024-01-17',
      fromWarehouse: 'Distribution Center',
      toWarehouse: 'Main Warehouse',
      status: 'Cancelled',
      totalItems: 2,
      totalValue: 35000000,
      items: [
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 50, unitPrice: 250000, total: 12500000 },
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 25, unitPrice: 1200000, total: 30000000 }
      ],
      reason: 'Return to main warehouse',
      requestedBy: 'David Inventory',
      approvedBy: 'Eve Manager',
      notes: 'Transfer cancelled due to inventory discrepancy',
      createdAt: '2024-01-17 16:20:00',
      cancelledDate: '2024-01-18 10:30:00'
    }
  ]);

  const [newTransfer, setNewTransfer] = useState({
    transferDate: new Date().toISOString().split('T')[0],
    fromWarehouse: '',
    toWarehouse: '',
    reason: '',
    items: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-purple-100 text-purple-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransfers = stockTransfers.filter(transfer =>
    transfer.transferNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.fromWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.toWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTransfer = () => {
    const transfer = {
      id: `ST-${String(stockTransfers.length + 1).padStart(3, '0')}`,
      transferNumber: `ST-2024-${String(stockTransfers.length + 1).padStart(3, '0')}`,
      ...newTransfer,
      status: 'Draft',
      totalItems: newTransfer.items.length,
      totalValue: newTransfer.items.reduce((sum, item) => sum + item.total, 0),
      requestedBy: 'Current User',
      approvedBy: null,
      createdAt: new Date().toISOString()
    };
    
    setStockTransfers([...stockTransfers, transfer]);
    setNewTransfer({
      transferDate: new Date().toISOString().split('T')[0],
      fromWarehouse: '',
      toWarehouse: '',
      reason: '',
      items: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTransfer = (transfer) => {
    setEditingTransfer(transfer);
    setNewTransfer(transfer);
    setIsAddDialogOpen(true);
  };

  const handleUpdateTransfer = () => {
    setStockTransfers(stockTransfers.map(transfer => 
      transfer.id === editingTransfer.id ? { 
        ...transfer, 
        ...newTransfer, 
        totalItems: newTransfer.items.length,
        totalValue: newTransfer.items.reduce((sum, item) => sum + item.total, 0)
      } : transfer
    ));
    setEditingTransfer(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteTransfer = (transferId) => {
    if (confirm('Apakah Anda yakin ingin menghapus transfer stock ini?')) {
      setStockTransfers(stockTransfers.filter(transfer => transfer.id !== transferId));
    }
  };

  const updateTransferStatus = (transferId, newStatus) => {
    const updatedTransfers = stockTransfers.map(transfer => {
      if (transfer.id === transferId) {
        const updated = { ...transfer, status: newStatus };
        if (newStatus === 'Approved') {
          updated.approvedBy = 'Current Manager';
        } else if (newStatus === 'In Transit') {
          updated.shippedDate = new Date().toISOString();
        } else if (newStatus === 'Completed') {
          updated.completedDate = new Date().toISOString();
        } else if (newStatus === 'Cancelled') {
          updated.cancelledDate = new Date().toISOString();
        }
        return updated;
      }
      return transfer;
    });
    setStockTransfers(updatedTransfers);
  };

  const approveTransfer = (transferId) => {
    updateTransferStatus(transferId, 'Approved');
  };

  const shipTransfer = (transferId) => {
    updateTransferStatus(transferId, 'In Transit');
  };

  const completeTransfer = (transferId) => {
    updateTransferStatus(transferId, 'Completed');
  };

  const cancelTransfer = (transferId) => {
    updateTransferStatus(transferId, 'Cancelled');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Transfer Stock Management</h1>
          <p className="text-gray-600">Kelola transfer stock antar warehouse</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Transfer Stock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingTransfer ? 'Edit Transfer Stock' : 'Buat Transfer Stock Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingTransfer ? 'Update informasi transfer stock' : 'Masukkan informasi transfer stock baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transferDate">Tanggal Transfer *</Label>
                <Input
                  id="transferDate"
                  type="date"
                  value={newTransfer.transferDate}
                  onChange={(e) => setNewTransfer({...newTransfer, transferDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Alasan Transfer *</Label>
                <Input
                  id="reason"
                  value={newTransfer.reason}
                  onChange={(e) => setNewTransfer({...newTransfer, reason: e.target.value})}
                  placeholder="Alasan transfer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromWarehouse">From Warehouse *</Label>
                <select
                  id="fromWarehouse"
                  value={newTransfer.fromWarehouse}
                  onChange={(e) => setNewTransfer({...newTransfer, fromWarehouse: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Warehouse Asal</option>
                  <option value="Main Warehouse">Main Warehouse</option>
                  <option value="Secondary Warehouse">Secondary Warehouse</option>
                  <option value="Distribution Center">Distribution Center</option>
                  <option value="Retail Store">Retail Store</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toWarehouse">To Warehouse *</Label>
                <select
                  id="toWarehouse"
                  value={newTransfer.toWarehouse}
                  onChange={(e) => setNewTransfer({...newTransfer, toWarehouse: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Warehouse Tujuan</option>
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
                  value={newTransfer.notes}
                  onChange={(e) => setNewTransfer({...newTransfer, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Transfer Items */}
            <div className="mt-6">
              <Label>Item Transfer</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">Items akan ditambahkan melalui form terpisah</div>
                {newTransfer.items.length > 0 ? (
                  <div className="space-y-2">
                    {newTransfer.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total: Rp {newTransfer.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada item dalam transfer ini
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingTransfer ? handleUpdateTransfer : handleAddTransfer}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
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
                <div className="text-sm text-gray-600">Total Transfers</div>
                <div className="text-2xl font-bold text-gray-800">{stockTransfers.length}</div>
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
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stockTransfers.filter(t => t.status === 'Pending').length}
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
                <div className="text-sm text-gray-600">In Transit</div>
                <div className="text-2xl font-bold text-purple-600">
                  {stockTransfers.filter(t => t.status === 'In Transit').length}
                </div>
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
                <TableHead>Date</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{transfer.transferNumber}</TableCell>
                  <TableCell>{transfer.transferDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {transfer.fromWarehouse}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      {transfer.toWarehouse}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(transfer.status)}>
                        {transfer.status}
                      </Badge>
                      {transfer.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveTransfer(transfer.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {transfer.status === 'Approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shipTransfer(transfer.id)}
                        >
                          Ship
                        </Button>
                      )}
                      {transfer.status === 'In Transit' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeTransfer(transfer.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transfer.totalItems} items</div>
                      <div className="text-gray-500">{transfer.reason}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {transfer.totalValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transfer.requestedBy}</div>
                      {transfer.approvedBy && (
                        <div className="text-gray-500">Approved by: {transfer.approvedBy}</div>
                      )}
                    </div>
                  </TableCell>
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




