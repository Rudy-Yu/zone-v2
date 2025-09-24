import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, User, Calendar, DollarSign, Send } from 'lucide-react';
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
  
  const [quotations, setQuotations] = useState([
    {
      id: 'QUO-001',
      quotationNumber: 'QUO-2024-001',
      customerId: 'CUST-001',
      customerName: 'PT. ABC Indonesia',
      quotationDate: '2024-01-20',
      validUntil: '2024-02-20',
      status: 'Sent',
      totalAmount: 45000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 2, unitPrice: 15000000, total: 30000000 },
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 5, unitPrice: 250000, total: 1250000 }
      ],
      createdBy: 'John Sales',
      notes: 'Valid for 30 days',
      createdAt: '2024-01-20 10:30:00',
      sentDate: '2024-01-20 14:00:00'
    },
    {
      id: 'QUO-002',
      quotationNumber: 'QUO-2024-002',
      customerId: 'CUST-002',
      customerName: 'CV. XYZ Trading',
      quotationDate: '2024-01-19',
      validUntil: '2024-02-19',
      status: 'Accepted',
      totalAmount: 28000000,
      items: [
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 10, unitPrice: 1200000, total: 12000000 },
        { productId: 'PRD-004', productName: 'Monitor 27"', quantity: 8, unitPrice: 2000000, total: 16000000 }
      ],
      createdBy: 'Jane Sales',
      notes: 'Accepted by customer',
      createdAt: '2024-01-19 14:15:00',
      sentDate: '2024-01-19 16:30:00',
      acceptedDate: '2024-01-21 09:15:00'
    },
    {
      id: 'QUO-003',
      quotationNumber: 'QUO-2024-003',
      customerId: 'CUST-003',
      customerName: 'Toko Maju Jaya',
      quotationDate: '2024-01-18',
      validUntil: '2024-02-18',
      status: 'Expired',
      totalAmount: 15000000,
      items: [
        { productId: 'PRD-001', productName: 'Laptop Gaming', quantity: 1, unitPrice: 15000000, total: 15000000 }
      ],
      createdBy: 'Bob Sales',
      notes: 'Expired without response',
      createdAt: '2024-01-18 09:45:00',
      sentDate: '2024-01-18 11:20:00'
    },
    {
      id: 'QUO-004',
      quotationNumber: 'QUO-2024-004',
      customerId: 'CUST-004',
      customerName: 'PT. DEF Corp',
      quotationDate: '2024-01-17',
      validUntil: '2024-02-17',
      status: 'Draft',
      totalAmount: 35000000,
      items: [
        { productId: 'PRD-002', productName: 'Mouse Wireless', quantity: 20, unitPrice: 250000, total: 5000000 },
        { productId: 'PRD-003', productName: 'Keyboard Mechanical', quantity: 25, unitPrice: 1200000, total: 30000000 }
      ],
      createdBy: 'Alice Sales',
      notes: 'Pending approval',
      createdAt: '2024-01-17 16:20:00'
    }
  ]);

  const [newQuotation, setNewQuotation] = useState({
    customerId: '',
    customerName: '',
    quotationDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    items: [],
    notes: ''
  });

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
    quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quotation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddQuotation = () => {
    const quotation = {
      id: `QUO-${String(quotations.length + 1).padStart(3, '0')}`,
      quotationNumber: `QUO-2024-${String(quotations.length + 1).padStart(3, '0')}`,
      ...newQuotation,
      status: 'Draft',
      totalAmount: newQuotation.items.reduce((sum, item) => sum + item.total, 0),
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setQuotations([...quotations, quotation]);
    setNewQuotation({
      customerId: '',
      customerName: '',
      quotationDate: new Date().toISOString().split('T')[0],
      validUntil: '',
      items: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditQuotation = (quotation) => {
    setEditingQuotation(quotation);
    setNewQuotation(quotation);
    setIsAddDialogOpen(true);
  };

  const handleUpdateQuotation = () => {
    setQuotations(quotations.map(quotation => 
      quotation.id === editingQuotation.id ? { ...quotation, ...newQuotation, totalAmount: newQuotation.items.reduce((sum, item) => sum + item.total, 0) } : quotation
    ));
    setEditingQuotation(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteQuotation = (quotationId) => {
    if (confirm('Apakah Anda yakin ingin menghapus quotation ini?')) {
      setQuotations(quotations.filter(quotation => quotation.id !== quotationId));
    }
  };

  const updateQuotationStatus = (quotationId, newStatus) => {
    const updatedQuotations = quotations.map(quotation => {
      if (quotation.id === quotationId) {
        const updated = { ...quotation, status: newStatus };
        if (newStatus === 'Sent') {
          updated.sentDate = new Date().toISOString();
        } else if (newStatus === 'Accepted') {
          updated.acceptedDate = new Date().toISOString();
        }
        return updated;
      }
      return quotation;
    });
    setQuotations(updatedQuotations);
  };

  const sendQuotation = (quotationId) => {
    updateQuotationStatus(quotationId, 'Sent');
  };

  const acceptQuotation = (quotationId) => {
    updateQuotationStatus(quotationId, 'Accepted');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quotation Management</h1>
          <p className="text-gray-600">Kelola quotation dan tracking status penawaran</p>
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
                {editingQuotation ? 'Update informasi quotation' : 'Masukkan informasi quotation baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer *</Label>
                <Input
                  id="customerName"
                  value={newQuotation.customerName}
                  onChange={(e) => setNewQuotation({...newQuotation, customerName: e.target.value})}
                  placeholder="Nama customer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quotationDate">Tanggal Quotation *</Label>
                <Input
                  id="quotationDate"
                  type="date"
                  value={newQuotation.quotationDate}
                  onChange={(e) => setNewQuotation({...newQuotation, quotationDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={newQuotation.validUntil}
                  onChange={(e) => setNewQuotation({...newQuotation, validUntil: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newQuotation.notes}
                  onChange={(e) => setNewQuotation({...newQuotation, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Quotation Items */}
            <div className="mt-6">
              <Label>Item Quotation</Label>
              <div className="border rounded-lg p-4 mt-2">
                <div className="text-sm text-gray-600 mb-4">Items akan ditambahkan melalui form terpisah</div>
                {newQuotation.items.length > 0 ? (
                  <div className="space-y-2">
                    {newQuotation.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>Rp {item.total.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="font-bold text-right">
                      Total: Rp {newQuotation.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada item dalam quotation ini
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingQuotation ? handleUpdateQuotation : handleAddQuotation}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingQuotation ? 'Update Quotation' : 'Buat Quotation'}
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
                <div className="text-sm text-gray-600">Total Quotations</div>
                <div className="text-2xl font-bold text-gray-800">{quotations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Sent</div>
                <div className="text-2xl font-bold text-green-600">
                  {quotations.filter(q => q.status === 'Sent').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Accepted</div>
                <div className="text-2xl font-bold text-purple-600">
                  {quotations.filter(q => q.status === 'Accepted').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Expired</div>
                <div className="text-2xl font-bold text-orange-600">
                  {quotations.filter(q => q.status === 'Expired').length}
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
              placeholder="Cari quotation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

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
                <TableHead>Quotation Date</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotations.map((quotation) => (
                <TableRow key={quotation.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{quotation.customerName}</div>
                      <div className="text-sm text-gray-500">{quotation.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{quotation.quotationDate}</TableCell>
                  <TableCell>
                    <div className={new Date(quotation.validUntil) < new Date() && quotation.status !== 'Accepted' ? 'text-red-600 font-medium' : ''}>
                      {quotation.validUntil}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(quotation.status)}>
                        {quotation.status}
                      </Badge>
                      {quotation.status === 'Draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sendQuotation(quotation.id)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Send
                        </Button>
                      )}
                      {quotation.status === 'Sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acceptQuotation(quotation.id)}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">Rp {quotation.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{quotation.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditQuotation(quotation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteQuotation(quotation.id)}
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


