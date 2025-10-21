import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Building } from 'lucide-react';
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

const Vendor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setVendors(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError(err.message);
      setVendors([
        {
          id: 'VEND-001',
          name: 'PT. Supplier ABC',
          contact_person: 'Andi',
          email: 'sales@supplierabc.co.id',
          phone: '+62 21 1111 2222',
          address: 'Jl. Raya Industri No. 1, Jakarta',
          city: 'Jakarta',
          status: 'Active',
          created_at: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [newVendor, setNewVendor] = useState({
    name: '', contact_person: '', email: '', phone: '', address: '', city: ''
  });

  const handleAddVendor = async () => {
    try {
      const response = await fetch(`${API_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const created = await response.json();
      setVendors(prev => [...prev, created]);
      setNewVendor({ name: '', contact_person: '', email: '', phone: '', address: '', city: '' });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating vendor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setNewVendor({
      name: vendor.name,
      contact_person: vendor.contact_person,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      city: vendor.city
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;
    try {
      const response = await fetch(`${API_URL}/vendors/${editingVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updated = await response.json();
      setVendors(prev => prev.map(v => v.id === editingVendor.id ? updated : v));
      setEditingVendor(null);
      setNewVendor({ name: '', contact_person: '', email: '', phone: '', address: '', city: '' });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error updating vendor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!confirm('Hapus vendor ini?')) return;
    try {
      const response = await fetch(`${API_URL}/vendors/${vendorId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setVendors(prev => prev.filter(v => v.id !== vendorId));
    } catch (err) {
      console.error('Error deleting vendor:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const filteredVendors = vendors.filter(v =>
    (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data vendor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Vendor</h1>
          <p className="text-gray-600">
            Kelola data vendor
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
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
              <DialogTitle>{editingVendor ? 'Edit Vendor' : 'Tambah Vendor'}</DialogTitle>
              <DialogDescription>
                {editingVendor ? 'Ubah informasi vendor' : 'Masukkan data vendor baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Vendor</Label>
                <Input id="name" value={newVendor.name} onChange={(e) => setNewVendor({...newVendor, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input id="contact_person" value={newVendor.contact_person} onChange={(e) => setNewVendor({...newVendor, contact_person: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={newVendor.email} onChange={(e) => setNewVendor({...newVendor, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={newVendor.phone} onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={newVendor.address} onChange={(e) => setNewVendor({...newVendor, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Kota</Label>
                <Input id="city" value={newVendor.city} onChange={(e) => setNewVendor({...newVendor, city: e.target.value})} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
              <Button onClick={editingVendor ? handleUpdateVendor : handleAddVendor}>
                {editingVendor ? 'Update' : 'Simpan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari vendor (nama, kota, email)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Kota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.contact_person}</TableCell>
                  <TableCell>{vendor.email}</TableCell>
                  <TableCell>{vendor.phone}</TableCell>
                  <TableCell>{vendor.address}</TableCell>
                  <TableCell>{vendor.city}</TableCell>
                  <TableCell>
                    <Badge className={vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditVendor(vendor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteVendor(vendor.id)} className="text-red-600 hover:text-red-700">
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



