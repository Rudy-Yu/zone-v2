import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, BookOpen, DollarSign, TrendingUp, TrendingDown, Calculator, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
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

const ChartOfAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isBankReconciliationOpen, setIsBankReconciliationOpen] = useState(false);
  const [bankReconciliation, setBankReconciliation] = useState({
    bankAccount: '',
    statementDate: '',
    statementBalance: '',
    bookBalance: '',
    adjustments: []
  });

  const [bankTransactions, setBankTransactions] = useState([
    {
      id: 'BT-001',
      date: '2024-01-15',
      description: 'Deposit from Customer A',
      debit: 5000000,
      credit: 0,
      balance: 55000000,
      status: 'Cleared'
    },
    {
      id: 'BT-002',
      date: '2024-01-16',
      description: 'Payment to Supplier B',
      debit: 0,
      credit: 2500000,
      balance: 52500000,
      status: 'Cleared'
    },
    {
      id: 'BT-003',
      date: '2024-01-17',
      description: 'Bank Service Charge',
      debit: 0,
      credit: 50000,
      balance: 52450000,
      status: 'Outstanding'
    },
    {
      id: 'BT-004',
      date: '2024-01-18',
      description: 'Interest Earned',
      debit: 100000,
      credit: 0,
      balance: 52550000,
      status: 'Outstanding'
    }
  ]);

  const bankAccounts = [
    { id: 'BANK-001', name: 'BCA - Main Account', accountNumber: '1234567890', balance: 52550000 },
    { id: 'BANK-002', name: 'Mandiri - Business Account', accountNumber: '0987654321', balance: 15000000 },
    { id: 'BANK-003', name: 'BNI - Savings Account', accountNumber: '1122334455', balance: 5000000 }
  ];

  const handleBankReconciliation = () => {
    // Process bank reconciliation
    const reconciledTransactions = bankTransactions.filter(t => t.status === 'Cleared');
    const outstandingTransactions = bankTransactions.filter(t => t.status === 'Outstanding');
    
    // Calculate adjusted book balance
    const adjustments = outstandingTransactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: t.debit - t.credit,
      type: t.debit > 0 ? 'Add' : 'Subtract'
    }));
    
    setBankReconciliation({
      ...bankReconciliation,
      adjustments: adjustments
    });
    
    setIsBankReconciliationOpen(false);
  };
  
  const [accounts, setAccounts] = useState([
    {
      id: 'ACC-001',
      accountCode: '1000',
      accountName: 'Cash and Cash Equivalents',
      accountType: 'Assets',
      accountCategory: 'Current Assets',
      parentAccount: null,
      balance: 50000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Cash on hand and in bank accounts',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-002',
      accountCode: '1100',
      accountName: 'Accounts Receivable',
      accountType: 'Assets',
      accountCategory: 'Current Assets',
      parentAccount: '1000',
      balance: 75000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Amounts owed by customers',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-003',
      accountCode: '1200',
      accountName: 'Inventory',
      accountType: 'Assets',
      accountCategory: 'Current Assets',
      parentAccount: '1000',
      balance: 150000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Raw materials, work in progress, finished goods',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-004',
      accountCode: '1500',
      accountName: 'Equipment',
      accountType: 'Assets',
      accountCategory: 'Fixed Assets',
      parentAccount: null,
      balance: 300000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Manufacturing equipment and machinery',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-005',
      accountCode: '1510',
      accountName: 'Accumulated Depreciation - Equipment',
      accountType: 'Assets',
      accountCategory: 'Fixed Assets',
      parentAccount: '1500',
      balance: -50000000,
      normalBalance: 'Credit',
      isActive: true,
      description: 'Accumulated depreciation on equipment',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-006',
      accountCode: '2000',
      accountName: 'Accounts Payable',
      accountType: 'Liabilities',
      accountCategory: 'Current Liabilities',
      parentAccount: null,
      balance: 45000000,
      normalBalance: 'Credit',
      isActive: true,
      description: 'Amounts owed to suppliers',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-007',
      accountCode: '2100',
      accountName: 'Accrued Expenses',
      accountType: 'Liabilities',
      accountCategory: 'Current Liabilities',
      parentAccount: '2000',
      balance: 15000000,
      normalBalance: 'Credit',
      isActive: true,
      description: 'Expenses incurred but not yet paid',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-008',
      accountCode: '3000',
      accountName: 'Owner\'s Equity',
      accountType: 'Equity',
      accountCategory: 'Capital',
      parentAccount: null,
      balance: 400000000,
      normalBalance: 'Credit',
      isActive: true,
      description: 'Owner\'s investment in the business',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-009',
      accountCode: '4000',
      accountName: 'Sales Revenue',
      accountType: 'Revenue',
      accountCategory: 'Operating Revenue',
      parentAccount: null,
      balance: 800000000,
      normalBalance: 'Credit',
      isActive: true,
      description: 'Revenue from product sales',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-010',
      accountCode: '5000',
      accountName: 'Cost of Goods Sold',
      accountType: 'Expenses',
      accountCategory: 'Operating Expenses',
      parentAccount: null,
      balance: 450000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Direct costs associated with production',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-011',
      accountCode: '6000',
      accountName: 'Operating Expenses',
      accountType: 'Expenses',
      accountCategory: 'Operating Expenses',
      parentAccount: null,
      balance: 200000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'General operating expenses',
      createdAt: '2023-01-01 00:00:00'
    },
    {
      id: 'ACC-012',
      accountCode: '6100',
      accountName: 'Salaries and Wages',
      accountType: 'Expenses',
      accountCategory: 'Operating Expenses',
      parentAccount: '6000',
      balance: 120000000,
      normalBalance: 'Debit',
      isActive: true,
      description: 'Employee salaries and wages',
      createdAt: '2023-01-01 00:00:00'
    }
  ]);

  const [newAccount, setNewAccount] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'Assets',
    accountCategory: '',
    parentAccount: '',
    normalBalance: 'Debit',
    isActive: true,
    description: ''
  });

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'Assets': return 'bg-blue-100 text-blue-800';
      case 'Liabilities': return 'bg-red-100 text-red-800';
      case 'Equity': return 'bg-green-100 text-green-800';
      case 'Revenue': return 'bg-purple-100 text-purple-800';
      case 'Expenses': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNormalBalanceColor = (balance) => {
    switch (balance) {
      case 'Debit': return 'text-blue-600';
      case 'Credit': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getBalanceColor = (balance, normalBalance) => {
    const isPositive = balance >= 0;
    const isNormal = (normalBalance === 'Debit' && isPositive) || (normalBalance === 'Credit' && !isPositive);
    return isNormal ? 'text-green-600' : 'text-red-600';
  };

  const filteredAccounts = accounts.filter(account =>
    account.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.accountCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAccount = () => {
    const account = {
      id: `ACC-${String(accounts.length + 1).padStart(3, '0')}`,
      ...newAccount,
      balance: 0,
      createdAt: new Date().toISOString()
    };
    
    setAccounts([...accounts, account]);
    setNewAccount({
      accountCode: '',
      accountName: '',
      accountType: 'Assets',
      accountCategory: '',
      parentAccount: '',
      normalBalance: 'Debit',
      isActive: true,
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setNewAccount(account);
    setIsAddDialogOpen(true);
  };

  const handleUpdateAccount = () => {
    setAccounts(accounts.map(account => 
      account.id === editingAccount.id ? { ...account, ...newAccount } : account
    ));
    setEditingAccount(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteAccount = (accountId) => {
    if (confirm('Apakah Anda yakin ingin menghapus account ini?')) {
      setAccounts(accounts.filter(account => account.id !== accountId));
    }
  };

  const toggleAccountStatus = (accountId) => {
    setAccounts(accounts.map(account => 
      account.id === accountId ? { ...account, isActive: !account.isActive } : account
    ));
  };

  const getAccountTypeOptions = () => [
    { value: 'Assets', label: 'Assets' },
    { value: 'Liabilities', label: 'Liabilities' },
    { value: 'Equity', label: 'Equity' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'Expenses', label: 'Expenses' }
  ];

  const getAccountCategoryOptions = (accountType) => {
    switch (accountType) {
      case 'Assets':
        return ['Current Assets', 'Fixed Assets', 'Intangible Assets', 'Other Assets'];
      case 'Liabilities':
        return ['Current Liabilities', 'Long-term Liabilities', 'Other Liabilities'];
      case 'Equity':
        return ['Capital', 'Retained Earnings', 'Other Equity'];
      case 'Revenue':
        return ['Operating Revenue', 'Non-operating Revenue', 'Other Revenue'];
      case 'Expenses':
        return ['Operating Expenses', 'Non-operating Expenses', 'Other Expenses'];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Chart of Accounts</h1>
          <p className="text-gray-600">Kelola chart of accounts dan struktur akuntansi</p>
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
              <DialogTitle>
                {editingAccount ? 'Edit Account' : 'Tambah Account Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update informasi account' : 'Masukkan informasi account baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountCode">Account Code *</Label>
                <Input
                  id="accountCode"
                  value={newAccount.accountCode}
                  onChange={(e) => setNewAccount({...newAccount, accountCode: e.target.value})}
                  placeholder="e.g., 1000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountName">Account Name *</Label>
                <Input
                  id="accountName"
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                  placeholder="Nama account"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type *</Label>
                <select
                  id="accountType"
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value, accountCategory: ''})}
                  className="w-full p-2 border rounded-md"
                >
                  {getAccountTypeOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountCategory">Account Category *</Label>
                <select
                  id="accountCategory"
                  value={newAccount.accountCategory}
                  onChange={(e) => setNewAccount({...newAccount, accountCategory: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Category</option>
                  {getAccountCategoryOptions(newAccount.accountType).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentAccount">Parent Account</Label>
                <select
                  id="parentAccount"
                  value={newAccount.parentAccount}
                  onChange={(e) => setNewAccount({...newAccount, parentAccount: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">No Parent Account</option>
                  {accounts.filter(acc => acc.accountType === newAccount.accountType && acc.isActive).map(account => (
                    <option key={account.id} value={account.accountCode}>{account.accountCode} - {account.accountName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="normalBalance">Normal Balance *</Label>
                <select
                  id="normalBalance"
                  value={newAccount.normalBalance}
                  onChange={(e) => setNewAccount({...newAccount, normalBalance: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Debit">Debit</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newAccount.description}
                  onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                  placeholder="Deskripsi account"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newAccount.isActive}
                    onChange={(e) => setNewAccount({...newAccount, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active Account</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingAccount ? handleUpdateAccount : handleAddAccount}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
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
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Accounts</div>
                <div className="text-2xl font-bold text-gray-800">{accounts.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Assets</div>
                <div className="text-2xl font-bold text-blue-600">
                  {accounts.filter(a => a.accountType === 'Assets').length}
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
                  {accounts.filter(a => a.accountType === 'Liabilities').length}
                </div>
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
                <div className="text-sm text-gray-600">Equity</div>
                <div className="text-2xl font-bold text-green-600">
                  {accounts.filter(a => a.accountType === 'Equity').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Revenue</div>
                <div className="text-2xl font-bold text-purple-600">
                  {accounts.filter(a => a.accountType === 'Revenue').length}
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

      {/* Tabs */}
      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="bank-reconciliation">Bank Reconciliation</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-6">
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
                <TableHead>Category</TableHead>
                <TableHead>Normal Balance</TableHead>
                <TableHead>Current Balance</TableHead>
                <TableHead>Parent Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{account.accountCode}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{account.accountName}</div>
                      {account.description && (
                        <div className="text-sm text-gray-500">{account.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAccountTypeColor(account.accountType)}>
                      {account.accountType}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.accountCategory}</TableCell>
                  <TableCell>
                    <span className={getNormalBalanceColor(account.normalBalance)}>
                      {account.normalBalance}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className={getBalanceColor(account.balance, account.normalBalance)}>
                      Rp {Math.abs(account.balance).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {account.parentAccount ? (
                      <span className="text-sm text-blue-600">{account.parentAccount}</span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleAccountStatus(account.id)}
                      >
                        {account.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
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
        </TabsContent>

        <TabsContent value="bank-reconciliation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bank Reconciliation</CardTitle>
                <Dialog open={isBankReconciliationOpen} onOpenChange={setIsBankReconciliationOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Start Reconciliation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Bank Reconciliation</DialogTitle>
                      <DialogDescription>
                        Reconcile bank statement with book balance.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Bank Account</Label>
                        <select
                          id="bankAccount"
                          value={bankReconciliation.bankAccount}
                          onChange={(e) => setBankReconciliation({...bankReconciliation, bankAccount: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select Bank Account</option>
                          {bankAccounts.map((account) => (
                            <option key={account.id} value={account.id}>
                              {account.name} - {account.accountNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statementDate">Statement Date</Label>
                        <Input
                          id="statementDate"
                          type="date"
                          value={bankReconciliation.statementDate}
                          onChange={(e) => setBankReconciliation({...bankReconciliation, statementDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="statementBalance">Statement Balance</Label>
                        <Input
                          id="statementBalance"
                          type="number"
                          value={bankReconciliation.statementBalance}
                          onChange={(e) => setBankReconciliation({...bankReconciliation, statementBalance: e.target.value})}
                          placeholder="Enter statement balance"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bookBalance">Book Balance</Label>
                        <Input
                          id="bookBalance"
                          type="number"
                          value={bankReconciliation.bookBalance}
                          onChange={(e) => setBankReconciliation({...bankReconciliation, bookBalance: e.target.value})}
                          placeholder="Enter book balance"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBankReconciliationOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBankReconciliation} className="bg-red-500 hover:bg-red-600 text-white">
                        Process Reconciliation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Bank Transactions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Bank Transactions</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Credit</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bankTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.debit > 0 ? `Rp ${transaction.debit.toLocaleString('id-ID')}` : '-'}</TableCell>
                          <TableCell>{transaction.credit > 0 ? `Rp ${transaction.credit.toLocaleString('id-ID')}` : '-'}</TableCell>
                          <TableCell>Rp {transaction.balance.toLocaleString('id-ID')}</TableCell>
                          <TableCell>
                            <Badge className={transaction.status === 'Cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Reconciliation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Cleared Transactions</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {bankTransactions.filter(t => t.status === 'Cleared').length}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                          <AlertCircle className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Outstanding Transactions</div>
                          <div className="text-2xl font-bold text-yellow-600">
                            {bankTransactions.filter(t => t.status === 'Outstanding').length}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Calculator className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Reconciled Balance</div>
                          <div className="text-2xl font-bold text-green-600">
                            Rp {bankTransactions[bankTransactions.length - 1]?.balance.toLocaleString('id-ID') || '0'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartOfAccounts;


