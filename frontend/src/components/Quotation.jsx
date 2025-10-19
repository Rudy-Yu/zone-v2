import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, User, Calendar, DollarSign, Send, Download } from 'lucide-react';
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

const Quotation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [quotations, setQuotations] = useState([]);

  // Fetch quotations from API
  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quotations`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setQuotations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching quotations:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setQuotations([
        {
          id: 'QUO-001',
          quotation_number: 'QUO-2024-001',
          customer_id: 'CUST-001',
          customer_name: 'PT. ABC Indonesia',
          quotation_date: '2024-01-20',
          valid_until: '2024-02-20',
          status: 'Sent',
          total_amount: 45000000,
          items: [
            { product_id: 'PRD-001', product_name: 'Laptop Gaming', quantity: 2, unit_price: 15000000, total: 30000000 },
            { product_id: 'PRD-002', product_name: 'Mouse Wireless', quantity: 5, unit_price: 250000, total: 1250000 }
          ],
          created_by: 'John Sales',
          notes: 'Valid for 30 days',
          created_at: '2024-01-20 10:30:00',
          sent_date: '2024-01-20 14:00:00'
        },
        {
          id: 'QUO-002',
          quotation_number: 'QUO-2024-002',
          customer_id: 'CUST-002',
          customer_name: 'CV. XYZ Trading',
          quotation_date: '2024-01-19',
          valid_until: '2024-02-19',
          status: 'Accepted',
          total_amount: 28000000,
          items: [
            { product_id: 'PRD-003', product_name: 'Keyboard Mechanical', quantity: 10, unit_price: 1200000, total: 12000000 },
            { product_id: 'PRD-004', product_name: 'Monitor 27"', quantity: 8, unit_price: 2000000, total: 16000000 }
          ],
          created_by: 'Jane Sales',
          notes: 'Accepted by customer',
          created_at: '2024-01-19 14:15:00',
          sent_date: '2024-01-19 16:30:00',
          accepted_date: '2024-01-21 09:15:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (quotationId) => {
    try {
      const response = await fetch(`${API_URL}/quotations/${quotationId}/pdf`);
      
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
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotations = quotations.filter(quotation =>
    quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuotation = () => {
    // Implementation for adding new quotation
    console.log('Add new quotation');
  };

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation);
    setIsAddDialogOpen(true);
  };

  const handleUpdateQuotation = () => {
    // Implementation for updating quotation
    console.log('Update quotation');
    setEditingQuotation(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteQuotation = (quotationId) => {
    if (confirm('Apakah Anda yakin ingin menghapus quotation ini?')) {
      setQuotations(quotations.filter(quotation => quotation.id !== quotationId));
    }
  };

  const updateQuotationStatus = (quotationId, newStatus) => {
    setQuotations(quotations => 
      quotations.map(quotation => 
        quotation.id === quotationId ? { ...quotation, status: newStatus } : quotation
      )
    );
  };

  const sendQuotation = (quotationId) => {
    updateQuotationStatus(quotationId, 'Sent');
    // Implementation for sending quotation via email
    console.log('Send quotation:', quotationId);
  };

  const acceptQuotation = (quotationId) => {
    updateQuotationStatus(quotationId, 'Accepted');
    // Implementation for accepting quotation
    console.log('Accept quotation:', quotationId);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data quotation...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quotation</h1>
          <p className="text-gray-600">
            Kelola semua quotation Anda
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
              Buat Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingQuotation ? 'Edit Quotation' : 'Buat Quotation Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingQuotation ? 'Ubah informasi quotation' : 'Isi informasi quotation baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Nama Customer</Label>
                  <Input id="customerName" placeholder="Pilih customer" />
                </div>
                <div>
                  <Label htmlFor="quotationDate">Tanggal Quotation</Label>
                  <Input id="quotationDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input id="validUntil" type="date" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select id="status" className="w-full p-2 border rounded-md">
                    <option value="Draft">Draft</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
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
              <Button onClick={editingQuotation ? handleUpdateQuotation : handleAddQuotation}>
                {editingQuotation ? 'Update' : 'Buat Quotation'}
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
                <p className="text-sm text-gray-600">Total Quotations</p>
                <p className="text-2xl font-bold">{quotations.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-blue-600">
                  {quotations.filter(q => q.status === 'Sent').length}
                </p>
              </div>
              <Send className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">
                  {quotations.filter(q => q.status === 'Accepted').length}
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
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-purple-600">
                  Rp {quotations.reduce((sum, quotation) => sum + quotation.total_amount, 0).toLocaleString()}
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
              placeholder="Cari berdasarkan quotation number, customer, atau status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quotation Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Tanggal Quotation</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{quotation.quotation_number}</TableCell>
                  <TableCell>{quotation.customer_name}</TableCell>
                  <TableCell>{quotation.quotation_date}</TableCell>
                  <TableCell>{quotation.valid_until}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(quotation.status)}>
                      {quotation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {quotation.total_amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditQuotation(quotation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => downloadPDF(quotation.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {quotation.status === 'Draft' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => sendQuotation(quotation.id)}
                          className="text-green-600 hover:text-green-700"
                          title="Send Quotation"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {quotation.status === 'Sent' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => acceptQuotation(quotation.id)}
                          className="text-purple-600 hover:text-purple-700"
                          title="Accept Quotation"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteQuotation(quotation.id)}
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

export default Quotation;