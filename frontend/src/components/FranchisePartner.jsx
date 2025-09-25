import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Building, MapPin, Phone, Mail, Users, TrendingUp, DollarSign } from 'lucide-react';
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

const FranchisePartner = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  
  const [franchisePartners, setFranchisePartners] = useState([
    {
      id: 'FP-001',
      partnerName: 'PT. Mitra Sukses Jakarta',
      contactPerson: 'John Partner',
      email: 'john@mitrasukses.com',
      phone: '+62 21 1111 2222',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      city: 'Jakarta',
      territory: 'Jakarta Pusat',
      status: 'Active',
      franchiseType: 'Master Franchise',
      investmentAmount: 500000000,
      monthlyFee: 5000000,
      startDate: '2023-06-15',
      contractEndDate: '2026-06-15',
      performance: {
        monthlyRevenue: 75000000,
        targetRevenue: 60000000,
        achievement: 125,
        customerCount: 450,
        employeeCount: 15
      },
      notes: 'Top performing partner',
      createdAt: '2023-06-15 10:30:00'
    },
    {
      id: 'FP-002',
      partnerName: 'CV. Partner Mandiri Surabaya',
      contactPerson: 'Jane Partner',
      email: 'jane@partnermandiri.com',
      phone: '+62 31 3333 4444',
      address: 'Jl. Thamrin No. 456, Surabaya',
      city: 'Surabaya',
      territory: 'Surabaya Timur',
      status: 'Active',
      franchiseType: 'Standard Franchise',
      investmentAmount: 250000000,
      monthlyFee: 2500000,
      startDate: '2023-08-20',
      contractEndDate: '2026-08-20',
      performance: {
        monthlyRevenue: 45000000,
        targetRevenue: 40000000,
        achievement: 112,
        customerCount: 280,
        employeeCount: 8
      },
      notes: 'Consistent performer',
      createdAt: '2023-08-20 14:15:00'
    },
    {
      id: 'FP-003',
      partnerName: 'PT. Usaha Bersama Bandung',
      contactPerson: 'Bob Partner',
      email: 'bob@usahabersama.com',
      phone: '+62 22 5555 6666',
      address: 'Jl. Asia Afrika No. 789, Bandung',
      city: 'Bandung',
      territory: 'Bandung Selatan',
      status: 'Active',
      franchiseType: 'Standard Franchise',
      investmentAmount: 200000000,
      monthlyFee: 2000000,
      startDate: '2023-09-10',
      contractEndDate: '2026-09-10',
      performance: {
        monthlyRevenue: 35000000,
        targetRevenue: 35000000,
        achievement: 100,
        customerCount: 200,
        employeeCount: 6
      },
      notes: 'Meeting targets consistently',
      createdAt: '2023-09-10 09:45:00'
    },
    {
      id: 'FP-004',
      partnerName: 'CV. Mitra Jaya Medan',
      contactPerson: 'Alice Partner',
      email: 'alice@mitrajaya.com',
      phone: '+62 61 7777 8888',
      address: 'Jl. Gatot Subroto No. 321, Medan',
      city: 'Medan',
      territory: 'Medan Utara',
      status: 'Inactive',
      franchiseType: 'Standard Franchise',
      investmentAmount: 180000000,
      monthlyFee: 1800000,
      startDate: '2023-07-05',
      contractEndDate: '2026-07-05',
      performance: {
        monthlyRevenue: 0,
        targetRevenue: 30000000,
        achievement: 0,
        customerCount: 0,
        employeeCount: 0
      },
      notes: 'Contract suspended due to performance issues',
      createdAt: '2023-07-05 16:20:00'
    }
  ]);

  const [newPartner, setNewPartner] = useState({
    partnerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    territory: '',
    franchiseType: 'Standard Franchise',
    investmentAmount: 0,
    monthlyFee: 0,
    startDate: new Date().toISOString().split('T')[0],
    contractEndDate: '',
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Master Franchise': return 'bg-blue-100 text-blue-800';
      case 'Standard Franchise': return 'bg-green-100 text-green-800';
      case 'Mini Franchise': return 'bg-orange-100 text-orange-800';
      case 'Corporate Store': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAchievementColor = (achievement) => {
    if (achievement >= 120) return 'text-green-600';
    if (achievement >= 100) return 'text-blue-600';
    if (achievement >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredPartners = franchisePartners.filter(partner =>
    partner.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.territory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPartner = () => {
    const partner = {
      id: `FP-${String(franchisePartners.length + 1).padStart(3, '0')}`,
      ...newPartner,
      status: 'Active',
      performance: {
        monthlyRevenue: 0,
        targetRevenue: 30000000,
        achievement: 0,
        customerCount: 0,
        employeeCount: 0
      },
      createdAt: new Date().toISOString()
    };
    
    setFranchisePartners([...franchisePartners, partner]);
    setNewPartner({
      partnerName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      territory: '',
      franchiseType: 'Standard Franchise',
      investmentAmount: 0,
      monthlyFee: 0,
      startDate: new Date().toISOString().split('T')[0],
      contractEndDate: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditPartner = (partner) => {
    setEditingPartner(partner);
    setNewPartner(partner);
    setIsAddDialogOpen(true);
  };

  const handleUpdatePartner = () => {
    setFranchisePartners(franchisePartners.map(partner => 
      partner.id === editingPartner.id ? { ...partner, ...newPartner } : partner
    ));
    setEditingPartner(null);
    setIsAddDialogOpen(false);
  };

  const handleDeletePartner = (partnerId) => {
    if (confirm('Apakah Anda yakin ingin menghapus franchise partner ini?')) {
      setFranchisePartners(franchisePartners.filter(partner => partner.id !== partnerId));
    }
  };

  const updatePartnerStatus = (partnerId, newStatus) => {
    setFranchisePartners(franchisePartners.map(partner => 
      partner.id === partnerId ? { ...partner, status: newStatus } : partner
    ));
  };

  const activatePartner = (partnerId) => {
    updatePartnerStatus(partnerId, 'Active');
  };

  const suspendPartner = (partnerId) => {
    updatePartnerStatus(partnerId, 'Suspended');
  };

  const terminatePartner = (partnerId) => {
    updatePartnerStatus(partnerId, 'Terminated');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Franchise Partner Management</h1>
          <p className="text-gray-600">Kelola franchise partner dan tracking performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Mitra Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingPartner ? 'Edit Franchise Partner' : 'Tambah Mitra Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingPartner ? 'Update informasi franchise partner' : 'Masukkan informasi franchise partner baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Nama Partner *</Label>
                <Input
                  id="partnerName"
                  value={newPartner.partnerName}
                  onChange={(e) => setNewPartner({...newPartner, partnerName: e.target.value})}
                  placeholder="Nama perusahaan partner"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  value={newPartner.contactPerson}
                  onChange={(e) => setNewPartner({...newPartner, contactPerson: e.target.value})}
                  placeholder="Nama contact person"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPartner.email}
                  onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                  placeholder="email@partner.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">No. Telepon *</Label>
                <Input
                  id="phone"
                  value={newPartner.phone}
                  onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat *</Label>
                <Input
                  id="address"
                  value={newPartner.address}
                  onChange={(e) => setNewPartner({...newPartner, address: e.target.value})}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Kota *</Label>
                <Input
                  id="city"
                  value={newPartner.city}
                  onChange={(e) => setNewPartner({...newPartner, city: e.target.value})}
                  placeholder="Kota"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="territory">Territory *</Label>
                <Input
                  id="territory"
                  value={newPartner.territory}
                  onChange={(e) => setNewPartner({...newPartner, territory: e.target.value})}
                  placeholder="Wilayah franchise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="franchiseType">Tipe Franchise</Label>
                <select
                  id="franchiseType"
                  value={newPartner.franchiseType}
                  onChange={(e) => setNewPartner({...newPartner, franchiseType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Standard Franchise">Standard Franchise</option>
                  <option value="Master Franchise">Master Franchise</option>
                  <option value="Mini Franchise">Mini Franchise</option>
                  <option value="Corporate Store">Corporate Store</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="investmentAmount">Investment Amount (Rp)</Label>
                <Input
                  id="investmentAmount"
                  type="number"
                  value={newPartner.investmentAmount}
                  onChange={(e) => setNewPartner({...newPartner, investmentAmount: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyFee">Monthly Fee (Rp)</Label>
                <Input
                  id="monthlyFee"
                  type="number"
                  value={newPartner.monthlyFee}
                  onChange={(e) => setNewPartner({...newPartner, monthlyFee: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPartner.startDate}
                  onChange={(e) => setNewPartner({...newPartner, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEndDate">Contract End Date *</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  value={newPartner.contractEndDate}
                  onChange={(e) => setNewPartner({...newPartner, contractEndDate: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newPartner.notes}
                  onChange={(e) => setNewPartner({...newPartner, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingPartner ? handleUpdatePartner : handleAddPartner}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingPartner ? 'Update Partner' : 'Tambah Partner'}
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
                <div className="text-sm text-gray-600">Total Partners</div>
                <div className="text-2xl font-bold text-gray-800">{franchisePartners.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Partners</div>
                <div className="text-2xl font-bold text-green-600">
                  {franchisePartners.filter(p => p.status === 'Active').length}
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
                <div className="text-sm text-gray-600">Total Investment</div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {franchisePartners.reduce((sum, p) => sum + p.investmentAmount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-orange-600">
                  Rp {franchisePartners.reduce((sum, p) => sum + p.performance.monthlyRevenue, 0).toLocaleString()}
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
              placeholder="Cari franchise partner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Franchise Partners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Franchise Partner</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{partner.partnerName}</div>
                      <div className="text-sm text-gray-500">{partner.contactPerson}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        {partner.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {partner.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {partner.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{partner.territory}</div>
                      <div className="text-gray-500">{partner.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(partner.franchiseType)}>
                      {partner.franchiseType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(partner.status)}>
                        {partner.status}
                      </Badge>
                      {partner.status === 'Inactive' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activatePartner(partner.id)}
                        >
                          Activate
                        </Button>
                      )}
                      {partner.status === 'Active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => suspendPartner(partner.id)}
                        >
                          Suspend
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <span>Revenue: Rp {partner.performance.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Achievement: </span>
                        <span className={`font-semibold ${getAchievementColor(partner.performance.achievement)}`}>
                          {partner.performance.achievement}%
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {partner.performance.customerCount} customers
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Investment: Rp {partner.investmentAmount.toLocaleString()}</div>
                      <div className="text-gray-500">Monthly: Rp {partner.monthlyFee.toLocaleString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Start: {partner.startDate}</div>
                      <div className="text-gray-500">End: {partner.contractEndDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditPartner(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePartner(partner.id)}
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

export default FranchisePartner;




