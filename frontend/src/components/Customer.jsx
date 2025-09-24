import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, MapPin, Building, User } from 'lucide-react';
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

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const [customers, setCustomers] = useState([
    {
      id: 'CUST-001',
      name: 'PT. ABC Indonesia',
      contactPerson: 'John Doe',
      email: 'john@abcindonesia.com',
      phone: '+62 21 1234 5678',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      city: 'Jakarta',
      type: 'Corporate',
      status: 'Active',
      creditLimit: 100000000,
      totalPurchases: 45000000,
      lastPurchase: '2024-01-15',
      createdAt: '2023-06-15'
    },
    {
      id: 'CUST-002',
      name: 'CV. XYZ Trading',
      contactPerson: 'Jane Smith',
      email: 'jane@xyztrading.com',
      phone: '+62 31 9876 5432',
      address: 'Jl. Thamrin No. 456, Surabaya',
      city: 'Surabaya',
      type: 'Corporate',
      status: 'Active',
      creditLimit: 50000000,
      totalPurchases: 28000000,
      lastPurchase: '2024-01-10',
      createdAt: '2023-08-20'
    },
    {
      id: 'CUST-003',
      name: 'Toko Maju Jaya',
      contactPerson: 'Bob Wilson',
      email: 'bob@majujaya.com',
      phone: '+62 22 5555 7777',
      address: 'Jl. Asia Afrika No. 789, Bandung',
      city: 'Bandung',
      type: 'Retail',
      status: 'Active',
      creditLimit: 25000000,
      totalPurchases: 15000000,
      lastPurchase: '2024-01-12',
      createdAt: '2023-09-10'
    },
    {
      id: 'CUST-004',
      name: 'PT. DEF Corp',
      contactPerson: 'Alice Brown',
      email: 'alice@defcorp.com',
      phone: '+62 61 1111 2222',
      address: 'Jl. Gatot Subroto No. 321, Medan',
      city: 'Medan',
      type: 'Corporate',
      status: 'Inactive',
      creditLimit: 75000000,
      totalPurchases: 35000000,
      lastPurchase: '2023-12-20',
      createdAt: '2023-07-05'
    }
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    type: 'Corporate',
    creditLimit: 0
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Corporate': return 'bg-blue-100 text-blue-800';
      case 'Retail': return 'bg-purple-100 text-purple-800';
      case 'Individual': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    const customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      ...newCustomer,
      status: 'Active',
      totalPurchases: 0,
      lastPurchase: null,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCustomers([...customers, customer]);
    setNewCustomer({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      type: 'Corporate',
      creditLimit: 0
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer(customer);
    setIsAddDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    setCustomers(customers.map(cust => 
      cust.id === editingCustomer.id ? { ...cust, ...newCustomer } : cust
    ));
    setEditingCustomer(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteCustomer = (customerId) => {
    if (confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      setCustomers(customers.filter(cust => cust.id !== customerId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Management</h1>
          <p className="text-gray-600">Kelola data customer dan informasi kontak</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? 'Edit Customer' : 'Tambah Customer Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingCustomer ? 'Update informasi customer' : 'Masukkan informasi customer baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Perusahaan *</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Nama perusahaan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newCustomer.contactPerson}
                  onChange={(e) => setNewCustomer({...newCustomer, contactPerson: e.target.value})}
                  placeholder="Nama contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="email@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon *</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat *</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({...newCustomer, city: e.target.value})}
                  placeholder="Kota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Customer</Label>
                <select
                  id="type"
                  value={newCustomer.type}
                  onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Corporate">Corporate</option>
                  <option value="Retail">Retail</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit (Rp)</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={newCustomer.creditLimit}
                  onChange={(e) => setNewCustomer({...newCustomer, creditLimit: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingCustomer ? 'Update Customer' : 'Tambah Customer'}
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
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Customers</div>
                <div className="text-2xl font-bold text-gray-800">{customers.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Customers</div>
                <div className="text-2xl font-bold text-green-600">
                  {customers.filter(c => c.status === 'Active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Corporate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {customers.filter(c => c.type === 'Corporate').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Retail</div>
                <div className="text-2xl font-bold text-orange-600">
                  {customers.filter(c => c.type === 'Retail').length}
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
              placeholder="Cari customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Nama Perusahaan</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credit Limit</TableHead>
                <TableHead>Total Purchase</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {customer.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(customer.type)}>
                      {customer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>Rp {customer.creditLimit.toLocaleString()}</TableCell>
                  <TableCell>Rp {customer.totalPurchases.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCustomer(customer.id)}
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

export default Customer;


