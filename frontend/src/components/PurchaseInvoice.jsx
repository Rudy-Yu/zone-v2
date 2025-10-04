import React, { useState } from 'react';
import { Plus, Search, FileText, Edit, Trash2, Eye, Download, Filter } from 'lucide-react';
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
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const PurchaseInvoice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  
  const [purchaseInvoices, setPurchaseInvoices] = useState([
    {
      id: 'PI-001',
      invoiceNumber: 'INV-2024-001',
      vendor: 'PT. Supplier ABC',
      invoiceDate: '2024-01-15',
      dueDate: '2024-02-15',
      amount: 25000000,
      paidAmount: 0,
      status: 'Pending',
      description: 'Purchase of raw materials'
    },
    {
      id: 'PI-002',
      invoiceNumber: 'INV-2024-002',
      vendor: 'CV. Distributor XYZ',
      invoiceDate: '2024-01-16',
      dueDate: '2024-02-16',
      amount: 15000000,
      paidAmount: 15000000,
      status: 'Paid',
      description: 'Office supplies'
    },
    {
      id: 'PI-003',
      invoiceNumber: 'INV-2024-003',
      vendor: 'Toko Elektronik Maju',
      invoiceDate: '2024-01-17',
      dueDate: '2024-02-17',
      amount: 35000000,
      paidAmount: 17500000,
      status: 'Partial',
      description: 'IT Equipment'
    }
  ]);

  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    vendor: '',
    invoiceDate: '',
    dueDate: '',
    amount: '',
    paidAmount: '',
    description: '',
    status: 'Pending'
  });

  const vendors = [
    'PT. Supplier ABC',
    'CV. Distributor XYZ',
    'Toko Elektronik Maju',
    'PT. Bahan Baku Indonesia',
    'CV. Peralatan Kantor'
  ];

  const handleAddInvoice = () => {
    const invoice = {
      id: `PI-${String(purchaseInvoices.length + 1).padStart(3, '0')}`,
      ...newInvoice,
      amount: parseInt(newInvoice.amount),
      paidAmount: parseInt(newInvoice.paidAmount) || 0
    };
    
    setPurchaseInvoices([...purchaseInvoices, invoice]);
    setNewInvoice({
      invoiceNumber: '',
      vendor: '',
      invoiceDate: '',
      dueDate: '',
      amount: '',
      paidAmount: '',
      description: '',
      status: 'Pending'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice(invoice);
    setIsAddDialogOpen(true);
  };

  const handleDeleteInvoice = (invoiceId) => {
    setPurchaseInvoices(purchaseInvoices.filter(p => p.id !== invoiceId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = purchaseInvoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = purchaseInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = purchaseInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase Invoice</h1>
          <p className="text-gray-600">Kelola invoice pembelian dari vendor</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingInvoice ? 'Edit Purchase Invoice' : 'Add Purchase Invoice'}</DialogTitle>
              <DialogDescription>
                {editingInvoice ? 'Update invoice information' : 'Enter new purchase invoice details'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={newInvoice.invoiceNumber}
                  onChange={(e) => setNewInvoice({...newInvoice, invoiceNumber: e.target.value})}
                  placeholder="Enter invoice number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select value={newInvoice.vendor} onValueChange={(value) => setNewInvoice({...newInvoice, vendor: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor} value={vendor}>
                        {vendor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={newInvoice.invoiceDate}
                  onChange={(e) => setNewInvoice({...newInvoice, invoiceDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newInvoice.amount}
                  onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  value={newInvoice.paidAmount}
                  onChange={(e) => setNewInvoice({...newInvoice, paidAmount: e.target.value})}
                  placeholder="Enter paid amount"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddInvoice} className="bg-red-500 hover:bg-red-600 text-white">
                {editingInvoice ? 'Update Invoice' : 'Add Invoice'}
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
                <FileText className="h-6 w-6 text-blue-600" />
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
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-green-600">Rp {totalAmount.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Paid Amount</div>
                <div className="text-2xl font-bold text-blue-600">Rp {paidAmount.toLocaleString('id-ID')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Pending Amount</div>
                <div className="text-2xl font-bold text-red-600">Rp {pendingAmount.toLocaleString('id-ID')}</div>
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                  <TableCell>{invoice.vendor}</TableCell>
                  <TableCell>{invoice.invoiceDate}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>Rp {invoice.amount.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {invoice.paidAmount.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
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






