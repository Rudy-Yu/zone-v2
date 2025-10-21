import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [purchaseInvoices, setPurchaseInvoices] = useState([]);

  const [newInvoice, setNewInvoice] = useState({
    invoice_number: '',
    vendor_id: '',
    vendor_name: '',
    invoice_date: '',
    due_date: '',
    amount: '',
    paid_amount: '',
    description: '',
    status: 'Pending'
  });

  const [vendors, setVendors] = useState([]);

  // Fetch vendors and purchase invoices
  useEffect(() => {
    fetchVendors();
    fetchPurchaseInvoices();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVendors(data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      // Fallback vendors
      setVendors([
        { id: 'VEND-001', name: 'PT. Supplier ABC' },
        { id: 'VEND-002', name: 'CV. Distributor XYZ' },
      ]);
    }
  };

  const fetchPurchaseInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/purchase-invoices`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPurchaseInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching purchase invoices:', err);
      setError(err.message);
      setPurchaseInvoices([
        {
          id: 'PI-001',
          invoice_number: 'INV-2024-001',
          vendor_id: 'VEND-001',
          vendor_name: 'PT. Supplier ABC',
          invoice_date: '2024-01-15',
          due_date: '2024-02-15',
          amount: 25000000,
          paid_amount: 0,
          status: 'Pending',
          description: 'Purchase of raw materials',
          created_at: '2024-01-15 10:00:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = async () => {
    try {
      const payload = {
        ...newInvoice,
        amount: parseFloat(newInvoice.amount || 0),
        paid_amount: parseFloat(newInvoice.paid_amount || 0)
      };
      const response = await fetch(`${API_URL}/purchase-invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setPurchaseInvoices(prev => [...prev, created]);
      setNewInvoice({
        invoice_number: '', vendor_id: '', vendor_name: '', invoice_date: '', due_date: '', amount: '', paid_amount: '', description: '', status: 'Pending'
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating purchase invoice:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setNewInvoice({
      invoice_number: invoice.invoice_number,
      vendor_id: invoice.vendor_id,
      vendor_name: invoice.vendor_name,
      invoice_date: invoice.invoice_date,
      due_date: invoice.due_date,
      amount: invoice.amount,
      paid_amount: invoice.paid_amount,
      description: invoice.description,
      status: invoice.status
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${API_URL}/purchase-invoices/${invoiceId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setPurchaseInvoices(prev => prev.filter(p => p.id !== invoiceId));
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const downloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`${API_URL}/purchase-invoices/${invoiceId}/pdf`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
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
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partial': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-red-100 text-red-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = purchaseInvoices.filter(invoice =>
    (invoice.invoice_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.vendor_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = purchaseInvoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  const paidAmount = purchaseInvoices.reduce((sum, invoice) => sum + (invoice.paid_amount || 0), 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase Invoice</h1>
          <p className="text-gray-600">
            Kelola invoice pembelian dari vendor
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
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
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  value={newInvoice.invoice_number}
                  onChange={(e) => setNewInvoice({...newInvoice, invoice_number: e.target.value})}
                  placeholder="Enter invoice number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Select value={newInvoice.vendor_id} onValueChange={(value) => {
                  const v = vendors.find(v => v.id === value);
                  setNewInvoice({...newInvoice, vendor_id: value, vendor_name: v ? v.name : ''});
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <Input
                  id="invoice_date"
                  type="date"
                  value={newInvoice.invoice_date}
                  onChange={(e) => setNewInvoice({...newInvoice, invoice_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newInvoice.due_date}
                  onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
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
                <Label htmlFor="paid_amount">Paid Amount</Label>
                <Input
                  id="paid_amount"
                  type="number"
                  value={newInvoice.paid_amount}
                  onChange={(e) => setNewInvoice({...newInvoice, paid_amount: e.target.value})}
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
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.vendor_name}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>Rp {invoice.amount.toLocaleString('id-ID')}</TableCell>
                  <TableCell>Rp {invoice.paid_amount.toLocaleString('id-ID')}</TableCell>
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
                        onClick={() => downloadPDF(invoice.id)}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
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


















