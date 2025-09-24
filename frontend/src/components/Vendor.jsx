import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Building, Phone, Mail, MapPin, Truck } from 'lucide-react';
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

const Vendor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  
  const [vendors, setVendors] = useState([
    {
      id: 'VEN-001',
      name: 'PT. Supplier ABC',
      contactPerson: 'John Supplier',
      email: 'john@supplierabc.com',
      phone: '+62 21 1111 2222',
      address: 'Jl. Industri No. 123, Jakarta Utara',
      city: 'Jakarta',
      type: 'Manufacturer',
      status: 'Active',
      paymentTerms: 'Net 30',
      creditLimit: 200000000,
      totalPurchases: 85000000,
      lastPurchase: '2024-01-18',
      rating: 4.5,
      createdAt: '2023-05-15'
    },
    {
      id: 'VEN-002',
      name: 'CV. Distributor XYZ',
      contactPerson: 'Jane Distributor',
      email: 'jane@distributorxyz.com',
      phone: '+62 31 3333 4444',
      address: 'Jl. Raya No. 456, Surabaya',
      city: 'Surabaya',
      type: 'Distributor',
      status: 'Active',
      paymentTerms: 'Net 15',
      creditLimit: 150000000,
      totalPurchases: 62000000,
      lastPurchase: '2024-01-16',
      rating: 4.2,
      createdAt: '2023-07-20'
    },
    {
      id: 'VEN-003',
      name: 'PT. Trading DEF',
      contactPerson: 'Bob Trader',
      email: 'bob@tradingdef.com',
      phone: '+62 22 5555 6666',
      address: 'Jl. Niaga No. 789, Bandung',
      city: 'Bandung',
      type: 'Trading',
      status: 'Active',
      paymentTerms: 'COD',
      creditLimit: 100000000,
      totalPurchases: 45000000,
      lastPurchase: '2024-01-14',
      rating: 3.8,
      createdAt: '2023-09-10'
    },
    {
      id: 'VEN-004',
      name: 'PT. Logistics GHI',
      contactPerson: 'Alice Logistics',
      email: 'alice@logisticsghi.com',
      phone: '+62 61 7777 8888',
      address: 'Jl. Gudang No. 321, Medan',
      city: 'Medan',
      type: 'Logistics',
      status: 'Inactive',
      paymentTerms: 'Net 45',
      creditLimit: 50000000,
      totalPurchases: 28000000,
      lastPurchase: '2023-12-20',
      rating: 3.5,
      createdAt: '2023-08-05'
    }
  ]);

  const [newVendor, setNewVendor] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    type: 'Manufacturer',
    paymentTerms: 'Net 30',
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
      case 'Manufacturer': return 'bg-blue-100 text-blue-800';
      case 'Distributor': return 'bg-purple-100 text-purple-800';
      case 'Trading': return 'bg-orange-100 text-orange-800';
      case 'Logistics': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentTermsColor = (terms) => {
    switch (terms) {
      case 'COD': return 'bg-green-100 text-green-800';
      case 'Net 15': return 'bg-blue-100 text-blue-800';
      case 'Net 30': return 'bg-orange-100 text-orange-800';
      case 'Net 45': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVendor = () => {
    const vendor = {
      id: `VEN-${String(vendors.length + 1).padStart(3, '0')}`,
      ...newVendor,
      status: 'Active',
      totalPurchases: 0,
      lastPurchase: null,
      rating: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setVendors([...vendors, vendor]);
    setNewVendor({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      type: 'Manufacturer',
      paymentTerms: 'Net 30',
      creditLimit: 0
    });
    setIsAddDialogOpen(false);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setNewVendor(vendor);
    setIsAddDialogOpen(true);
  };

  const handleUpdateVendor = () => {
    setVendors(vendors.map(vendor => 
      vendor.id === editingVendor.id ? { ...vendor, ...newVendor } : vendor
    ));
    setEditingVendor(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteVendor = (vendorId) => {
    if (confirm('Apakah Anda yakin ingin menghapus vendor ini?')) {
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    
    return stars;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Kelola data vendor dan supplier</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? 'Edit Vendor' : 'Tambah Vendor Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingVendor ? 'Update informasi vendor' : 'Masukkan informasi vendor baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Vendor *</Label>
                <Input
                  id="name"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="Nama vendor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newVendor.contactPerson}
                  onChange={(e) => setNewVendor({...newVendor, contactPerson: e.target.value})}
                  placeholder="Nama contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  placeholder="email@vendor.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon *</Label>
                <Input
                  id="phone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat *</Label>
                <Input
                  id="address"
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  value={newVendor.city}
                  onChange={(e) => setNewVendor({...newVendor, city: e.target.value})}
                  placeholder="Kota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Vendor</Label>
                <select
                  id="type"
                  value={newVendor.type}
                  onChange={(e) => setNewVendor({...newVendor, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Trading">Trading</option>
                  <option value="Logistics">Logistics</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <select
                  id="paymentTerms"
                  value={newVendor.paymentTerms}
                  onChange={(e) => setNewVendor({...newVendor, paymentTerms: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="COD">COD</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="creditLimit">Credit Limit (Rp)</Label>
                <Input
                  id="creditLimit"
                  type="number"
                  value={newVendor.creditLimit}
                  onChange={(e) => setNewVendor({...newVendor, creditLimit: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingVendor ? handleUpdateVendor : handleAddVendor}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingVendor ? 'Update Vendor' : 'Tambah Vendor'}
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
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Vendors</div>
                <div className="text-2xl font-bold text-gray-800">{vendors.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Vendors</div>
                <div className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === 'Active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Manufacturers</div>
                <div className="text-2xl font-bold text-purple-600">
                  {vendors.filter(v => v.type === 'Manufacturer').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Building className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Distributors</div>
                <div className="text-2xl font-bold text-orange-600">
                  {vendors.filter(v => v.type === 'Distributor').length}
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
              placeholder="Cari vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Vendor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor ID</TableHead>
                <TableHead>Nama Vendor</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Payment Terms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total Purchase</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{vendor.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>{vendor.contactPerson}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {vendor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {vendor.city}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(vendor.type)}>
                      {vendor.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPaymentTermsColor(vendor.paymentTerms)}>
                      {vendor.paymentTerms}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(vendor.rating)}</div>
                      <span className="text-sm text-gray-600 ml-1">({vendor.rating})</span>
                    </div>
                  </TableCell>
                  <TableCell>Rp {vendor.totalPurchases.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditVendor(vendor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteVendor(vendor.id)}
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

export default Vendor;


