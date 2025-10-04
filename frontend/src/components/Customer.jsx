import React, { useState, useEffect } from 'react';
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
import { useForm } from 'react-hook-form';

const Customer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  
  // Form setup dengan React Hook Form dan Zod
  const form = useForm({
    defaultValues: {
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      type: 'Corporate',
      credit_limit: 0
    }
  });

  // Field order untuk navigasi keyboard
  const fieldOrder = ['name', 'contact_person', 'email', 'phone', 'address', 'city', 'type', 'credit_limit'];
  
  const [customers, setCustomers] = useState([]);

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/customers`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err.message);
      // Fallback to mock data if API fails
      setCustomers([
        {
          id: 'CUST-001',
          name: 'PT. ABC Indonesia',
          contact_person: 'John Doe',
          email: 'john@abcindonesia.com',
          phone: '+62 21 1234 5678',
          address: 'Jl. Sudirman No. 123, Jakarta Pusat',
          city: 'Jakarta',
          type: 'Corporate',
          status: 'Active',
          credit_limit: 100000000,
          total_purchases: 45000000,
          last_purchase: '2024-01-15',
          created_at: '2023-06-15'
        },
        {
          id: 'CUST-002',
          name: 'CV. XYZ Trading',
          contact_person: 'Jane Smith',
          email: 'jane@xyztrading.com',
          phone: '+62 31 9876 5432',
          address: 'Jl. Thamrin No. 456, Surabaya',
          city: 'Surabaya',
          type: 'Corporate',
          status: 'Active',
          credit_limit: 50000000,
          total_purchases: 28000000,
          last_purchase: '2024-01-10',
          created_at: '2023-08-20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      console.log('Submitting customer data:', data);
      
      if (editingCustomer) {
        // Update existing customer
        const response = await fetch(`${API_URL}/customers/${editingCustomer.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const updatedCustomer = await response.json();
        setCustomers(prev => prev.map(c => 
          c.id === editingCustomer.id ? updatedCustomer : c
        ));
        setEditingCustomer(null);
        console.log('Customer updated successfully');
      } else {
        // Create new customer
        const response = await fetch(`${API_URL}/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const newCustomer = await response.json();
        setCustomers(prev => [...prev, newCustomer]);
        console.log('Customer created successfully');
      }

      form.reset();
      setIsAddDialogOpen(false);
      setError(null);
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
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
    customer.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
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


  const handleDeleteCustomer = async (customerId) => {
    if (confirm('Apakah Anda yakin ingin menghapus customer ini?')) {
      try {
        const response = await fetch(`${API_URL}/customers/${customerId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setCustomers(customers.filter(cust => cust.id !== customerId));
      } catch (err) {
        console.error('Error deleting customer:', err);
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data customer...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && customers.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchCustomers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Coba Lagi
            </button>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Management</h1>
          <p className="text-gray-600">
            Kelola data customer dan informasi kontak
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
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    {...form.register("contact_person")}
                    id="contact_person"
                    placeholder="Nama contact person"
                  />
                  {form.formState.errors.contact_person && (
                    <p className="text-sm text-red-500">{form.formState.errors.contact_person.message}</p>
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
                  <Input
                    {...form.register("phone")}
                    id="phone"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                  )}
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
                  <Label htmlFor="credit_limit">Credit Limit (Rp)</Label>
                  <Input
                    {...form.register("credit_limit")}
                    id="credit_limit"
                    type="number"
                    placeholder="0"
                  />
                  {form.formState.errors.credit_limit && (
                    <p className="text-sm text-red-500">{form.formState.errors.credit_limit.message}</p>
                  )}
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
                  <TableCell>{customer.contact_person}</TableCell>
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
                  <TableCell>Rp {customer.credit_limit.toLocaleString()}</TableCell>
                  <TableCell>Rp {customer.total_purchases.toLocaleString()}</TableCell>
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



