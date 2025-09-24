import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Calendar, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
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

const GeneralJournal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  
  const [journalEntries, setJournalEntries] = useState([
    {
      id: 'JE-001',
      journalNumber: 'JE-2024-001',
      entryDate: '2024-01-20',
      reference: 'INV-001',
      description: 'Sales of products to customer',
      status: 'Posted',
      totalDebit: 45000000,
      totalCredit: 45000000,
      entries: [
        { accountCode: '1100', accountName: 'Accounts Receivable', debit: 45000000, credit: 0, description: 'Customer invoice' },
        { accountCode: '4000', accountName: 'Sales Revenue', debit: 0, credit: 45000000, description: 'Sales revenue' }
      ],
      createdBy: 'John Accountant',
      postedBy: 'Jane Accountant',
      postedDate: '2024-01-20 14:30:00',
      notes: 'Regular sales transaction',
      createdAt: '2024-01-20 10:30:00'
    },
    {
      id: 'JE-002',
      journalNumber: 'JE-2024-002',
      entryDate: '2024-01-19',
      reference: 'PO-001',
      description: 'Purchase of raw materials',
      status: 'Posted',
      totalDebit: 75000000,
      totalCredit: 75000000,
      entries: [
        { accountCode: '1200', accountName: 'Inventory', debit: 75000000, credit: 0, description: 'Raw materials purchase' },
        { accountCode: '2000', accountName: 'Accounts Payable', debit: 0, credit: 75000000, description: 'Vendor payable' }
      ],
      createdBy: 'Bob Accountant',
      postedBy: 'Alice Accountant',
      postedDate: '2024-01-19 16:15:00',
      notes: 'Monthly inventory purchase',
      createdAt: '2024-01-19 14:15:00'
    },
    {
      id: 'JE-003',
      journalNumber: 'JE-2024-003',
      entryDate: '2024-01-18',
      reference: 'PAY-001',
      description: 'Payment to vendor',
      status: 'Draft',
      totalDebit: 45000000,
      totalCredit: 45000000,
      entries: [
        { accountCode: '2000', accountName: 'Accounts Payable', debit: 45000000, credit: 0, description: 'Payment to vendor' },
        { accountCode: '1000', accountName: 'Cash', debit: 0, credit: 45000000, description: 'Cash payment' }
      ],
      createdBy: 'Charlie Accountant',
      postedBy: null,
      postedDate: null,
      notes: 'Pending approval',
      createdAt: '2024-01-18 09:45:00'
    },
    {
      id: 'JE-004',
      journalNumber: 'JE-2024-004',
      entryDate: '2024-01-17',
      reference: 'DEP-001',
      description: 'Monthly depreciation',
      status: 'Posted',
      totalDebit: 5000000,
      totalCredit: 5000000,
      entries: [
        { accountCode: '5000', accountName: 'Depreciation Expense', debit: 5000000, credit: 0, description: 'Monthly depreciation' },
        { accountCode: '1510', accountName: 'Accumulated Depreciation', debit: 0, credit: 5000000, description: 'Equipment depreciation' }
      ],
      createdBy: 'David Accountant',
      postedBy: 'Eve Accountant',
      postedDate: '2024-01-17 17:20:00',
      notes: 'Monthly depreciation entry',
      createdAt: '2024-01-17 16:20:00'
    }
  ]);

  const [newJournal, setNewJournal] = useState({
    entryDate: new Date().toISOString().split('T')[0],
    reference: '',
    description: '',
    entries: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Posted': return 'bg-green-100 text-green-800';
      case 'Reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isBalanced = (entries) => {
    const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
    return totalDebit === totalCredit;
  };

  const filteredJournals = journalEntries.filter(journal =>
    journal.journalNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    journal.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddJournal = () => {
    const journal = {
      id: `JE-${String(journalEntries.length + 1).padStart(3, '0')}`,
      journalNumber: `JE-2024-${String(journalEntries.length + 1).padStart(3, '0')}`,
      ...newJournal,
      status: 'Draft',
      totalDebit: newJournal.entries.reduce((sum, entry) => sum + entry.debit, 0),
      totalCredit: newJournal.entries.reduce((sum, entry) => sum + entry.credit, 0),
      createdBy: 'Current User',
      postedBy: null,
      postedDate: null,
      createdAt: new Date().toISOString()
    };
    
    setJournalEntries([...journalEntries, journal]);
    setNewJournal({
      entryDate: new Date().toISOString().split('T')[0],
      reference: '',
      description: '',
      entries: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditJournal = (journal) => {
    setEditingJournal(journal);
    setNewJournal(journal);
    setIsAddDialogOpen(true);
  };

  const handleUpdateJournal = () => {
    setJournalEntries(journalEntries.map(journal => 
      journal.id === editingJournal.id ? { 
        ...journal, 
        ...newJournal,
        totalDebit: newJournal.entries.reduce((sum, entry) => sum + entry.debit, 0),
        totalCredit: newJournal.entries.reduce((sum, entry) => sum + entry.credit, 0)
      } : journal
    ));
    setEditingJournal(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteJournal = (journalId) => {
    if (confirm('Apakah Anda yakin ingin menghapus journal entry ini?')) {
      setJournalEntries(journalEntries.filter(journal => journal.id !== journalId));
    }
  };

  const postJournal = (journalId) => {
    setJournalEntries(journalEntries.map(journal => 
      journal.id === journalId ? { 
        ...journal, 
        status: 'Posted',
        postedBy: 'Current User',
        postedDate: new Date().toISOString()
      } : journal
    ));
  };

  const reverseJournal = (journalId) => {
    setJournalEntries(journalEntries.map(journal => 
      journal.id === journalId ? { ...journal, status: 'Reversed' } : journal
    ));
  };

  const addJournalEntry = () => {
    setNewJournal({
      ...newJournal,
      entries: [...newJournal.entries, { accountCode: '', accountName: '', debit: 0, credit: 0, description: '' }]
    });
  };

  const updateJournalEntry = (index, field, value) => {
    const updatedEntries = [...newJournal.entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setNewJournal({ ...newJournal, entries: updatedEntries });
  };

  const removeJournalEntry = (index) => {
    const updatedEntries = newJournal.entries.filter((_, i) => i !== index);
    setNewJournal({ ...newJournal, entries: updatedEntries });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">General Journal</h1>
          <p className="text-gray-600">Kelola journal entries dan posting transaksi</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Journal Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>
                {editingJournal ? 'Edit Journal Entry' : 'Buat Journal Entry Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingJournal ? 'Update informasi journal entry' : 'Masukkan informasi journal entry baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryDate">Entry Date *</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={newJournal.entryDate}
                  onChange={(e) => setNewJournal({...newJournal, entryDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={newJournal.reference}
                  onChange={(e) => setNewJournal({...newJournal, reference: e.target.value})}
                  placeholder="e.g., INV-001"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={newJournal.description}
                  onChange={(e) => setNewJournal({...newJournal, description: e.target.value})}
                  placeholder="Deskripsi transaksi"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={newJournal.notes}
                  onChange={(e) => setNewJournal({...newJournal, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            {/* Journal Entries */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <Label>Journal Entries</Label>
                <Button onClick={addJournalEntry} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Entry
                </Button>
              </div>
              <div className="border rounded-lg p-4">
                {newJournal.entries.length > 0 ? (
                  <div className="space-y-4">
                    {newJournal.entries.map((entry, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                        <div className="col-span-2">
                          <Input
                            placeholder="Account Code"
                            value={entry.accountCode}
                            onChange={(e) => updateJournalEntry(index, 'accountCode', e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            placeholder="Account Name"
                            value={entry.accountName}
                            onChange={(e) => updateJournalEntry(index, 'accountName', e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Debit"
                            value={entry.debit}
                            onChange={(e) => updateJournalEntry(index, 'debit', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Credit"
                            value={entry.credit}
                            onChange={(e) => updateJournalEntry(index, 'credit', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            placeholder="Description"
                            value={entry.description}
                            onChange={(e) => updateJournalEntry(index, 'description', e.target.value)}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeJournalEntry(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                      <div className="font-semibold">Total:</div>
                      <div className="flex gap-4">
                        <span>Debit: Rp {newJournal.entries.reduce((sum, entry) => sum + entry.debit, 0).toLocaleString()}</span>
                        <span>Credit: Rp {newJournal.entries.reduce((sum, entry) => sum + entry.credit, 0).toLocaleString()}</span>
                        <span className={isBalanced(newJournal.entries) ? 'text-green-600' : 'text-red-600'}>
                          {isBalanced(newJournal.entries) ? '✓ Balanced' : '✗ Unbalanced'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Belum ada journal entries
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingJournal ? handleUpdateJournal : handleAddJournal}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={!isBalanced(newJournal.entries)}
              >
                {editingJournal ? 'Update Journal' : 'Buat Journal'}
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
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Entries</div>
                <div className="text-2xl font-bold text-gray-800">{journalEntries.length}</div>
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
                <div className="text-sm text-gray-600">Draft</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {journalEntries.filter(j => j.status === 'Draft').length}
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
                <div className="text-sm text-gray-600">Posted</div>
                <div className="text-2xl font-bold text-green-600">
                  {journalEntries.filter(j => j.status === 'Posted').length}
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
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {journalEntries.reduce((sum, j) => sum + j.totalDebit, 0).toLocaleString()}
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
              placeholder="Cari journal entry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Journal Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Journal Number</TableHead>
                <TableHead>Entry Date</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Posted By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJournals.map((journal) => (
                <TableRow key={journal.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{journal.journalNumber}</TableCell>
                  <TableCell>{journal.entryDate}</TableCell>
                  <TableCell>
                    <span className="text-sm text-blue-600">{journal.reference}</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{journal.description}</div>
                      {journal.notes && (
                        <div className="text-sm text-gray-500">{journal.notes}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(journal.status)}>
                        {journal.status}
                      </Badge>
                      {journal.status === 'Draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => postJournal(journal.id)}
                        >
                          Post
                        </Button>
                      )}
                      {journal.status === 'Posted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reverseJournal(journal.id)}
                        >
                          Reverse
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Debit: Rp {journal.totalDebit.toLocaleString()}</div>
                      <div>Credit: Rp {journal.totalCredit.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{journal.createdBy}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{journal.postedBy || '-'}</div>
                      {journal.postedDate && (
                        <div className="text-gray-500">{journal.postedDate.split(' ')[0]}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditJournal(journal)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteJournal(journal.id)}
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

export default GeneralJournal;



