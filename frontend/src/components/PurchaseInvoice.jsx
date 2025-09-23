import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Receipt, Building, Calendar, DollarSign, CreditCard } from 'lucide-react';
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

const PurchaseInvoice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const [purchaseInvoices, setPurchaseInvoices] = useState([
    {
      id: 'PINV-001',
      invoiceNumber: 'PINV-2024-001',
      vendorId: 'VEN-001',
      vendorName: 'PT. Supplier ABC',
      invoiceDate: '2024-01-20',
      dueDate: '2024-02-19',
      status: 'Pending',
      totalAmount: 75000000,
      paidAmount: 0,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 5, unitPrice: 15000000, total: 75000000 }
      ],
      purchaseOrderId: 'PO-001',
      createdBy: 'John Purchasing',
      notes: 'Payment due in 30 days',
      createdAt: '2024-01-20 10:30:00'
    },
    {
      id: 'PINV-002',
      invoiceNumber: 'PINV-2024-002',
      vendorId: 'VEN-002',
      vendorName: 'CV. Distributor XYZ',
      invoiceDate: '2024-01-19',
      dueDate: '2024-02-03',
      status: 'Paid',
      totalAmount: 48000000,
      paidAmount: 48000000,
      items: [
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 20, unitPrice: 1200000, total: 24000000 },
        { productId: 'PRD-004', productName: 'Monitor 27"', quantity: 12, unitPrice: 2000000, total: 24000000 }
      ],
      purchaseOrderId: 'PO-002',
      createdBy: 'Jane Purchasing',
      notes: 'Paid via bank transfer',
      createdAt: '2024-01-19 14:15:00',
      paidDate: '2024-01-25 14:30:00'
    },
    {
      id: 'PINV-003',
      invoiceNumber: 'PINV-2024-003',
      vendorId: 'VEN-003',
      vendorName: 'PT. Trading DEF',
      invoiceDate: '2024-01-18',
      dueDate: '2024-01-18',
      status: 'Paid',
      totalAmount: 30000000,
      paidAmount: 30000000,
      items: [
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 50, unitPrice: 250000, total: 12500000 },
        { productId: 'PRD-005', productName: 'Headset Gaming', quantity: 25, unitPrice: 700000, total: 17500000 }
      ],
      purchaseOrderId: 'PO-003',
      createdBy: 'Bob Purchasing',
      notes: 'COD payment',
      createdAt: '2024-01-18 09:45:00',
      paidDate: '2024-01-18 15:20:00'
    },
    {
      id: 'PINV-004',
      invoiceNumber: 'PINV-2024-004',
      vendorId: 'VEN-001',
      vendorName: 'PT. Supplier ABC',
      invoiceDate: '2024-01-17',
      dueDate: '2024-02-16',
      status: 'Overdue',
      totalAmount: 20000000,
      paidAmount: 0,
      items: [
        { productId: 'PRD-006', productName: 'Webcam HD', quantity: 10, unitPrice: 2000000, total: 20000000 }
      ],
      purchaseOrderId: 'PO-004',
      createdBy: 'Alice Purchasing',
      notes: 'Payment overdue',
      createdAt: '2024-01-17 16:20:00'
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    vendorId: '',
    vendorName: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    purchaseOrderId: '',
    items: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = purchaseInvoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddInvoice = () => {
    const invoice = {
      id: `PINV-${String(purchaseInvoices.length + 1).padStart(3, '0')}`,
      invoiceNumber: `PINV-2024-${String(purchaseInvoices.length + 1).padStart(3, '0')}`,
      ...newInvoice,
      status: 'Draft',
      totalAmount: newInvoice.items.reduce((sum, item) => sum + item.total, 0),
      paidAmount: 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setPurchaseInvoices([...purchaseInvoices, invoice]);
    setNewInvoice({
      vendorId: '',
      vendorName: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      purchaseOrderId: '',
      items: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice(invoice);
    setIsAddDialogOpen(true);
  };

  const handleUpdateInvoice = () => {
    setPurchaseInvoices(purchaseInvoices.map(invoice => 
      invoice.id === editingInvoice.id ? { ...invoice, ...newInvoice, totalAmount: newInvoice.items.reduce((sum, item) => sum + item.total, 0) } : invoice
    ));
    setEditingInvoice(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (confirm('Apakah Anda yakin ingin menghapus invoice pembelian ini?')) {
      setPurchaseInvoices(purchaseInvoices.filter(invoice => invoice.id !== invoiceId));
    }
  };

  const updateInvoiceStatus = (invoiceId, newStatus) => {
    const updatedInvoices = purchaseInvoices.map(invoice => {
      if (invoice.id === invoiceId) {
        const updated = { ...invoice, status: newStatus };
        if (newStatus === 'Paid') {
          updated.paidAmount = invoice.totalAmount;
          updated.paidDate = new Date().toISOString();
        }
        return updated;
      }
      return invoice;
    });
    setPurchaseInvoices(updatedInvoices);
  };

  const markAsPaid = (invoiceId) => {
    updateInvoiceStatus(invoiceId, 'Paid');
  };

  const markAsPending = (invoiceId) => {
    updateInvoiceStatus(invoiceId, 'Pending');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Pembelian Management</h1>
          <p className="text-gray-600">Kelola invoice pembelian dan tracking pembayaran</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice Pembelian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingInvoice ? 'Edit Invoice Pembelian' : 'Buat Invoice Pembelian Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingInvoice ? 'Update informasi invoice pembelian' : 'Masukkan informasi invoice pembelian baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor *</Label>
                <Input
                  id="vendorName"
                  value={newInvoice.vendorName}
                  onChange={(e) => setNewInvoice({...newInvoice, vendorName: e.target.value})}
                  placeholder="Nama vendor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Tanggal Invoice *</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={newInvoice.invoiceDate}
                  onChange={(e) => setNewInvoice({...newInvoice, invoiceDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchaseOrderId">Purchase Order ID</Label>
                <Input
                  id="purchaseOrderId"
                  value={newInvoice.purchaseOrderId}
                  onChange={(e) => setNewInvoice({...newInvoice, purchaseOrderId: e.target.value})}
                  placeholder="PO-2024-XXX"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Invoice Items */}
            <div className="mt-6">
              <Label>Item Invoice</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">Items akan ditambahkan melalui form terpisah</div>
                {newInvoice.items.length > 0 ? (
                  <div className="space-y-2">
                    {newInvoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total: Rp {newInvoice.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada item dalam invoice ini
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingInvoice ? handleUpdateInvoice : handleAddInvoice}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingInvoice ? 'Update Invoice' : 'Buat Invoice'}
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
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Invoices</div>
                <div className="text-2xl font-bold text-gray-800">{purchaseInvoices.length}</div>
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
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {purchaseInvoices.filter(i => i.status === 'Pending').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Paid</div>
                <div className="text-2xl font-bold text-green-600">
                  {purchaseInvoices.filter(i => i.status === 'Paid').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Overdue</div>
                <div className="text-2xl font-bold text-red-600">
                  {purchaseInvoices.filter(i => i.status === 'Overdue').length}
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
              placeholder="Cari invoice pembelian..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Purchase Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice Pembelian</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>PO Reference</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.vendorName}</div>
                      <div className="text-sm text-gray-500">{invoice.vendorId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>
                    <div className={new Date(invoice.dueDate) < new Date() && invoice.status !== 'Paid' ? 'text-red-600 font-medium' : ''}>
                      {invoice.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      {invoice.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsPaid(invoice.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                      {invoice.status === 'Paid' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsPending(invoice.id)}
                        >
                          Mark Pending
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {invoice.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className={invoice.paidAmount === invoice.totalAmount ? 'text-green-600 font-medium' : 'text-gray-600'}>
                      Rp {invoice.paidAmount.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-blue-600">{invoice.purchaseOrderId}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteInvoice(invoice.id)}
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

export default PurchaseInvoice;
