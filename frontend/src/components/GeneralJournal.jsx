import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, Calendar, DollarSign, Filter } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const GeneralJournal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/general-journal`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setJournalEntries(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
      setError(err.message);
      setJournalEntries([
    {
      id: 'JE-001',
          entry_number: 'JE-2024-001',
          entry_date: '2024-01-20',
          description: 'Sales Revenue',
          debit_account: 'Cash',
          credit_account: 'Sales Revenue',
          debit_amount: 15000000,
          credit_amount: 15000000,
      reference: 'INV-001',
      status: 'Posted',
          created_by: 'Accountant',
          created_at: '2024-01-20 10:30:00'
    },
    {
      id: 'JE-002',
          entry_number: 'JE-2024-002',
          entry_date: '2024-01-20',
          description: 'Purchase of Inventory',
          debit_account: 'Inventory',
          credit_account: 'Accounts Payable',
          debit_amount: 8000000,
          credit_amount: 8000000,
      reference: 'PO-001',
      status: 'Posted',
          created_by: 'Accountant',
          created_at: '2024-01-20 11:15:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newEntry, setNewEntry] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
    debit_account: '',
    credit_account: '',
    debit_amount: '',
    credit_amount: '',
    reference: ''
  });

  const handleAddEntry = async () => {
    try {
      const response = await fetch(`${API_URL}/general-journal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          debit_amount: parseFloat(newEntry.debit_amount),
          credit_amount: parseFloat(newEntry.credit_amount)
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setJournalEntries(prev => [...prev, created]);
      setNewEntry({
        entry_date: new Date().toISOString().split('T')[0],
        description: '',
        debit_account: '',
        credit_account: '',
        debit_amount: '',
        credit_amount: '',
        reference: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating journal entry:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      entry_date: entry.entry_date,
      description: entry.description,
      debit_account: entry.debit_account,
      credit_account: entry.credit_account,
      debit_amount: entry.debit_amount.toString(),
      credit_amount: entry.credit_amount.toString(),
      reference: entry.reference
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry) return;
    try {
      const response = await fetch(`${API_URL}/general-journal/${editingEntry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEntry,
          debit_amount: parseFloat(newEntry.debit_amount),
          credit_amount: parseFloat(newEntry.credit_amount)
        })
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setJournalEntries(prev => prev.map(e => e.id === editingEntry.id ? updated : e));
      setEditingEntry(null);
      setNewEntry({
        entry_date: new Date().toISOString().split('T')[0],
        description: '',
        debit_account: '',
        credit_account: '',
        debit_amount: '',
        credit_amount: '',
        reference: ''
      });
    setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating journal entry:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Hapus journal entry ini?')) return;
    try {
      const response = await fetch(`${API_URL}/general-journal/${entryId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setJournalEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (err) {
      console.error('Error deleting journal entry:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Posted': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEntries = journalEntries.filter(entry =>
    (entry.entry_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.debit_account || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.credit_account || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data general journal...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">General Journal</h1>
          <p className="text-gray-600">
            Kelola pencatatan transaksi akuntansi
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Journal Entry' : 'Tambah Journal Entry Baru'}</DialogTitle>
              <DialogDescription>
                {editingEntry ? 'Update journal entry' : 'Buat journal entry baru untuk pencatatan akuntansi'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_date">Tanggal Entry</Label>
                <Input
                  id="entry_date"
                  type="date"
                  value={newEntry.entry_date}
                  onChange={(e) => setNewEntry({...newEntry, entry_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={newEntry.reference}
                  onChange={(e) => setNewEntry({...newEntry, reference: e.target.value})}
                  placeholder="Reference number"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  placeholder="Description of transaction"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debit_account">Debit Account</Label>
                <Input
                  id="debit_account"
                  value={newEntry.debit_account}
                  onChange={(e) => setNewEntry({...newEntry, debit_account: e.target.value})}
                  placeholder="Debit account"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_account">Credit Account</Label>
                <Input
                  id="credit_account"
                  value={newEntry.credit_account}
                  onChange={(e) => setNewEntry({...newEntry, credit_account: e.target.value})}
                  placeholder="Credit account"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debit_amount">Debit Amount</Label>
                          <Input
                  id="debit_amount"
                            type="number"
                  value={newEntry.debit_amount}
                  onChange={(e) => setNewEntry({...newEntry, debit_amount: e.target.value})}
                  placeholder="0"
                          />
                        </div>
              <div className="space-y-2">
                <Label htmlFor="credit_amount">Credit Amount</Label>
                          <Input
                  id="credit_amount"
                            type="number"
                  value={newEntry.credit_amount}
                  onChange={(e) => setNewEntry({...newEntry, credit_amount: e.target.value})}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingEntry ? handleUpdateEntry : handleAddEntry} className="bg-red-500 hover:bg-red-600 text-white">
                {editingEntry ? 'Update Entry' : 'Tambah Entry'}
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
                <div className="text-sm text-gray-600">Total Entries</div>
                <div className="text-2xl font-bold text-gray-800">{journalEntries.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Posted Entries</div>
                <div className="text-2xl font-bold text-green-600">
                  {journalEntries.filter(e => e.status === 'Posted').length}
                </div>
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
                <div className="text-sm text-gray-600">Draft Entries</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {journalEntries.filter(e => e.status === 'Draft').length}
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
                <div className="text-sm text-gray-600">Total Debit</div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {journalEntries.reduce((sum, e) => sum + (e.debit_amount || 0), 0).toLocaleString()}
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
                <TableHead>Entry Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Debit Account</TableHead>
                <TableHead>Credit Account</TableHead>
                <TableHead>Debit Amount</TableHead>
                <TableHead>Credit Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{entry.entry_number}</TableCell>
                  <TableCell>{entry.entry_date}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.debit_account}</TableCell>
                  <TableCell>{entry.credit_account}</TableCell>
                  <TableCell className="font-semibold">
                    Rp {(entry.debit_amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rp {(entry.credit_amount || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                      </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteEntry(entry.id)}
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






