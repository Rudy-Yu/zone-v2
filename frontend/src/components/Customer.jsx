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
import { FastInput, FastAutoComplete } from './ui/fast-input';
import { useFastInput, formUtils, validationSchemas } from '../hooks/useFastInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fast input setup
  const { handleAutoFill } = useFastInput();
  
  // Form setup dengan React Hook Form dan Zod
  const form = useForm({
    resolver: zodResolver(validationSchemas.customer),
    defaultValues: {
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      type: 'Corporate',
      creditLimit: 0
    }
  });

  // Field order untuk navigasi keyboard
  const fieldOrder = ['name', 'contactPerson', 'email', 'phone', 'address', 'city', 'type', 'creditLimit'];
  
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

  // Form submission handler
  const onSubmit = (data) => {
    const newId = formUtils.generateId('CUST', customers.map(c => c.id));
    const customerData = {
      ...data,
      id: newId,
      status: 'Active',
      totalPurchases: 0,
      lastPurchase: null,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (editingCustomer) {
      setCustomers(prev => prev.map(c => 
        c.id === editingCustomer.id ? { ...c, ...customerData } : c
      ));
      setEditingCustomer(null);
    } else {
      setCustomers(prev => [...prev, customerData]);
    }

    form.reset();
    setIsAddDialogOpen(false);
  };

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

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    form.reset(customer);
    setIsAddDialogOpen(true);
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentField = e.target.name;
      const currentIndex = fieldOrder.indexOf(currentField);
      
      if (currentIndex < fieldOrder.length - 1) {
        const nextField = document.querySelector(`[name="${fieldOrder[currentIndex + 1]}"]`);
        if (nextField) {
          nextField.focus();
        }
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleFormKeyDown}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Perusahaan *</Label>
                  <Input
                    {...form.register("name")}
                    id="name"
                    placeholder="Nama perusahaan"
                    autoFocus
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    {...form.register("contactPerson")}
                    id="contactPerson"
                    placeholder="Nama contact person"
                  />
                  {form.formState.errors.contactPerson && (
                    <p className="text-sm text-red-500">{form.formState.errors.contactPerson.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="email@company.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon *</Label>
                  <FastInput
                    name="phone"
                    label=""
                    mask="phone"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat *</Label>
                  <Input
                    {...form.register("address")}
                    id="address"
                    placeholder="Alamat lengkap"
                  />
                  {form.formState.errors.address && (
                    <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Kota *</Label>
                  <Input
                    {...form.register("city")}
                    id="city"
                    placeholder="Kota"
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Customer</Label>
                  <select
                    {...form.register("type")}
                    id="type"
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Retail">Retail</option>
                    <option value="Individual">Individual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (Rp)</Label>
                  <FastInput
                    name="creditLimit"
                    label=""
                    mask="currency"
                    placeholder="0"
                  />
                </div>
              </div>
            </form>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)}
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



