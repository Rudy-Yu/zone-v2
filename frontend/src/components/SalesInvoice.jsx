import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, Download, FileText, Calendar, DollarSign } from 'lucide-react';
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

const SalesInvoice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_id: '',
    invoice_date: '',
    due_date: '',
    product_id: '',
    quantity: 1,
    unit_price: '',
    notes: ''
  });

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  // Fetch invoices from API
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/sales-invoices`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setInvoices([
        {
          id: 'INV-001',
          customer_name: 'PT. ABC Indonesia',
          invoice_date: '2024-01-20',
          due_date: '2024-02-19',
          amount: 15000000,
          status: 'Paid',
          items: 3
        },
        {
          id: 'INV-002',
          customer_name: 'CV. XYZ Trading',
          invoice_date: '2024-01-19',
          due_date: '2024-02-18',
          amount: 8500000,
          status: 'Pending',
          items: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`${API_URL}/sales-invoices/${invoiceId}/pdf`);
      
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

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!form.customer_id || !form.invoice_date || !form.due_date || !form.product_id || !form.quantity) {
        throw new Error('Lengkapi customer, tanggal, produk, dan jumlah');
      }

      const payload = {
        customer_id: form.customer_id,
        invoice_date: form.invoice_date,
        due_date: form.due_date,
        items: [
          {
            product_id: form.product_id,
            quantity: Number(form.quantity),
            unit_price: form.unit_price ? Number(form.unit_price) : undefined
          }
        ],
        notes: form.notes || ''
      };

      const res = await fetch(`${API_URL}/sales-invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gagal membuat invoice: ${res.status} ${text}`);
      }

      await fetchInvoices();
      setDialogOpen(false);
      setForm({
        customer_id: '',
        invoice_date: '',
        due_date: '',
        product_id: '',
        quantity: 1,
        unit_price: '',
        notes: ''
      });
      alert('Invoice berhasil dibuat');
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data invoice...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Penjualan</h1>
          <p className="text-gray-600">
            Kelola semua invoice penjualan Anda
            {error && (
              <span className="ml-2 text-orange-600 text-sm">
                (Menggunakan data offline)
              </span>
            )}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Invoice Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Buat Invoice Baru</DialogTitle>
              <DialogDescription>Isi data invoice penjualan.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer ID</Label>
                <Input
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  placeholder="Masukkan ID customer"
                />
              </div>
              <div>
                <Label>Produk (product_id)</Label>
                <Input
                  value={form.product_id}
                  onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  placeholder="Masukkan ID produk"
                />
              </div>
              <div>
                <Label>Tanggal Invoice</Label>
                <Input
                  type="date"
                  value={form.invoice_date}
                  onChange={(e) => setForm({ ...form, invoice_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Jatuh Tempo</Label>
                <Input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Jumlah (quantity)</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div>
                <Label>Harga Satuan (opsional, fallback ke harga produk)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.unit_price}
                  onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Catatan</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Batal
              </Button>
              <Button onClick={handleCreate} disabled={submitting} className="bg-red-500 hover:bg-red-600 text-white">
                {submitting ? 'Menyimpan...' : 'Simpan Invoice'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Invoice</div>
            <div className="text-2xl font-bold text-gray-800">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Sudah Dibayar</div>
            <div className="text-2xl font-bold text-green-600">
              {invoices.filter(inv => inv.status === 'Paid').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Menunggu Bayar</div>
            <div className="text-2xl font-bold text-yellow-600">
              {invoices.filter(inv => inv.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 mb-1">Overdue</div>
            <div className="text-2xl font-bold text-red-600">
              {invoices.filter(inv => inv.status === 'Overdue').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari invoice atau customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell className="font-semibold">Rp {invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadPDF(invoice.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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

export default SalesInvoice;