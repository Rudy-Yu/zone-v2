import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, FileText, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
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

const ChartOfAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/chart-of-accounts`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAccounts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.message);
      setAccounts([
        {
          id: 'ACC-001',
          account_code: '1000',
          account_name: 'Assets',
          account_type: 'Asset',
          parent_account: null,
          balance: 500000000,
          normal_balance: 'Debit',
          status: 'Active',
          description: 'All company assets',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-002',
          account_code: '1100',
          account_name: 'Current Assets',
          account_type: 'Asset',
          parent_account: 'Assets',
          balance: 300000000,
          normal_balance: 'Debit',
          status: 'Active',
          description: 'Current assets including cash and inventory',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-003',
          account_code: '1110',
          account_name: 'Cash',
          account_type: 'Asset',
          parent_account: 'Current Assets',
          balance: 150000000,
          normal_balance: 'Debit',
          status: 'Active',
          description: 'Cash and cash equivalents',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-004',
          account_code: '2000',
          account_name: 'Liabilities',
          account_type: 'Liability',
          parent_account: null,
          balance: 200000000,
          normal_balance: 'Credit',
          status: 'Active',
          description: 'All company liabilities',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-005',
          account_code: '3000',
          account_name: 'Equity',
          account_type: 'Equity',
          parent_account: null,
          balance: 300000000,
          normal_balance: 'Credit',
          status: 'Active',
          description: 'Shareholders equity',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-006',
          account_code: '4000',
          account_name: 'Revenue',
          account_type: 'Revenue',
          parent_account: null,
          balance: 450000000,
          normal_balance: 'Credit',
          status: 'Active',
          description: 'All revenue accounts',
          created_at: '2024-01-01 00:00:00'
        },
        {
          id: 'ACC-007',
          account_code: '5000',
          account_name: 'Expenses',
          account_type: 'Expense',
          parent_account: null,
          balance: 250000000,
          normal_balance: 'Debit',
          status: 'Active',
          description: 'All expense accounts',
          created_at: '2024-01-01 00:00:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newAccount, setNewAccount] = useState({
    account_code: '',
    account_name: '',
    account_type: 'Asset',
    parent_account: '',
    normal_balance: 'Debit',
    description: ''
  });

  const handleAddAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/chart-of-accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setAccounts(prev => [...prev, created]);
      setNewAccount({
        account_code: '',
        account_name: '',
        account_type: 'Asset',
        parent_account: '',
        normal_balance: 'Debit',
        description: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating account:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setNewAccount({
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: account.account_type,
      parent_account: account.parent_account || '',
      normal_balance: account.normal_balance,
      description: account.description
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;
    try {
      const response = await fetch(`${API_URL}/chart-of-accounts/${editingAccount.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setAccounts(prev => prev.map(a => a.id === editingAccount.id ? updated : a));
      setEditingAccount(null);
      setNewAccount({
        account_code: '',
        account_name: '',
        account_type: 'Asset',
        parent_account: '',
        normal_balance: 'Debit',
        description: ''
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating account:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    if (!confirm('Hapus account ini?')) return;
    try {
      const response = await fetch(`${API_URL}/chart-of-accounts/${accountId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setAccounts(prev => prev.filter(a => a.id !== accountId));
    } catch (err) {
      console.error('Error deleting account:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'Asset': return 'bg-green-100 text-green-800';
      case 'Liability': return 'bg-red-100 text-red-800';
      case 'Equity': return 'bg-blue-100 text-blue-800';
      case 'Revenue': return 'bg-purple-100 text-purple-800';
      case 'Expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBalanceColor = (type, balance) => {
    if (type === 'Asset' || type === 'Expense') {
      return balance >= 0 ? 'text-green-600' : 'text-red-600';
    } else {
      return balance >= 0 ? 'text-blue-600' : 'text-red-600';
    }
  };

  const filteredAccounts = accounts.filter(account =>
    (account.account_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.account_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (account.account_type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data chart of accounts...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chart of Accounts</h1>
          <p className="text-gray-600">
            Kelola struktur akun akuntansi
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit Account' : 'Tambah Account Baru'}</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update informasi account' : 'Buat account baru untuk chart of accounts'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="account_code">Account Code</Label>
                <Input
                  id="account_code"
                  value={newAccount.account_code}
                  onChange={(e) => setNewAccount({...newAccount, account_code: e.target.value})}
                  placeholder="Account code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_name">Account Name</Label>
                <Input
                  id="account_name"
                  value={newAccount.account_name}
                  onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
                  placeholder="Account name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_type">Account Type</Label>
                <Select value={newAccount.account_type} onValueChange={(value) => setNewAccount({...newAccount, account_type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Revenue">Revenue</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parent_account">Parent Account</Label>
                <Input
                  id="parent_account"
                  value={newAccount.parent_account}
                  onChange={(e) => setNewAccount({...newAccount, parent_account: e.target.value})}
                  placeholder="Parent account (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="normal_balance">Normal Balance</Label>
                <Select value={newAccount.normal_balance} onValueChange={(value) => setNewAccount({...newAccount, normal_balance: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih normal balance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Debit">Debit</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                  placeholder="Account description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={editingAccount ? handleUpdateAccount : handleAddAccount} className="bg-red-500 hover:bg-red-600 text-white">
                {editingAccount ? 'Update Account' : 'Tambah Account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Assets</div>
                <div className="text-2xl font-bold text-green-600">
                  {accounts.filter(a => a.account_type === 'Asset').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Liabilities</div>
                <div className="text-2xl font-bold text-red-600">
                  {accounts.filter(a => a.account_type === 'Liability').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Equity</div>
                <div className="text-2xl font-bold text-blue-600">
                  {accounts.filter(a => a.account_type === 'Equity').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Revenue</div>
                <div className="text-2xl font-bold text-purple-600">
                  {accounts.filter(a => a.account_type === 'Revenue').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Expenses</div>
                <div className="text-2xl font-bold text-orange-600">
                  {accounts.filter(a => a.account_type === 'Expense').length}
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
              placeholder="Cari account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chart of Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Parent Account</TableHead>
                <TableHead>Normal Balance</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{account.account_code}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>
                    <Badge className={getAccountTypeColor(account.account_type)}>
                      {account.account_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.parent_account || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{account.normal_balance}</Badge>
                  </TableCell>
                  <TableCell className={`font-semibold ${getBalanceColor(account.account_type, account.balance)}`}>
                    Rp {(account.balance || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={account.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteAccount(account.id)}
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

export default ChartOfAccounts;