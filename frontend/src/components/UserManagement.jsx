import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, User, Mail, Phone, Shield, Lock, Unlock, UserCheck } from 'lucide-react';
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

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      username: 'admin',
      email: 'admin@zone.com',
      fullName: 'Administrator',
      phone: '+62 21 1111 2222',
      role: 'Administrator',
      department: 'IT',
      status: 'Active',
      lastLogin: '2024-01-20 09:30:00',
      permissions: ['all'],
      createdAt: '2023-01-01 00:00:00',
      createdBy: 'System'
    },
    {
      id: 'USR-002',
      username: 'john.sales',
      email: 'john@zone.com',
      fullName: 'John Sales Manager',
      phone: '+62 21 3333 4444',
      role: 'Sales Manager',
      department: 'Sales',
      status: 'Active',
      lastLogin: '2024-01-20 08:15:00',
      permissions: ['sales', 'customer', 'quotation', 'invoice'],
      createdAt: '2023-02-15 10:30:00',
      createdBy: 'admin'
    },
    {
      id: 'USR-003',
      username: 'jane.accounting',
      email: 'jane@zone.com',
      fullName: 'Jane Accounting',
      phone: '+62 21 5555 6666',
      role: 'Accountant',
      department: 'Finance',
      status: 'Active',
      lastLogin: '2024-01-19 16:45:00',
      permissions: ['accounting', 'reports', 'chart_of_accounts'],
      createdAt: '2023-03-10 14:15:00',
      createdBy: 'admin'
    },
    {
      id: 'USR-004',
      username: 'bob.inventory',
      email: 'bob@zone.com',
      fullName: 'Bob Inventory',
      phone: '+62 21 7777 8888',
      role: 'Inventory Manager',
      department: 'Operations',
      status: 'Active',
      lastLogin: '2024-01-20 07:20:00',
      permissions: ['inventory', 'products', 'stock_opname', 'transfer_stock'],
      createdAt: '2023-04-05 09:45:00',
      createdBy: 'admin'
    },
    {
      id: 'USR-005',
      username: 'alice.production',
      email: 'alice@zone.com',
      fullName: 'Alice Production',
      phone: '+62 21 9999 0000',
      role: 'Production Manager',
      department: 'Manufacturing',
      status: 'Active',
      lastLogin: '2024-01-19 18:30:00',
      permissions: ['manufacturing', 'production_order', 'workstation'],
      createdAt: '2023-05-20 16:20:00',
      createdBy: 'admin'
    },
    {
      id: 'USR-006',
      username: 'charlie.marketing',
      email: 'charlie@zone.com',
      fullName: 'Charlie Marketing',
      phone: '+62 21 1111 3333',
      role: 'Marketing Specialist',
      department: 'Marketing',
      status: 'Inactive',
      lastLogin: '2024-01-15 12:00:00',
      permissions: ['marketing', 'campaigns', 'leads'],
      createdAt: '2023-06-15 11:30:00',
      createdBy: 'admin'
    },
    {
      id: 'USR-007',
      username: 'david.operator',
      email: 'david@zone.com',
      fullName: 'David Operator',
      phone: '+62 21 2222 4444',
      role: 'Operator',
      department: 'Manufacturing',
      status: 'Active',
      lastLogin: '2024-01-20 06:00:00',
      permissions: ['production_view', 'workstation_view'],
      createdAt: '2023-07-01 08:00:00',
      createdBy: 'alice.production'
    }
  ]);

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    phone: '',
    role: 'User',
    department: '',
    permissions: [],
    status: 'Active'
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator': return 'bg-red-100 text-red-800';
      case 'Manager': return 'bg-blue-100 text-blue-800';
      case 'Accountant': return 'bg-green-100 text-green-800';
      case 'Specialist': return 'bg-purple-100 text-purple-800';
      case 'Operator': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    const user = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      ...newUser,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    setUsers([...users, user]);
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      phone: '',
      role: 'User',
      department: '',
      permissions: [],
      status: 'Active'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    setUsers(users.map(user => 
      user.id === editingUser.id ? { ...user, ...newUser } : user
    ));
    setEditingUser(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' } : user
    ));
  };

  const resetPassword = (userId) => {
    if (confirm('Apakah Anda yakin ingin reset password user ini?')) {
      // In real implementation, this would trigger a password reset email
      alert('Password reset email telah dikirim ke user');
    }
  };

  const availableRoles = [
    'Administrator',
    'Sales Manager',
    'Accountant',
    'Inventory Manager',
    'Production Manager',
    'Marketing Specialist',
    'Operator',
    'User'
  ];

  const availableDepartments = [
    'IT',
    'Sales',
    'Finance',
    'Operations',
    'Manufacturing',
    'Marketing',
    'HR',
    'General'
  ];

  const availablePermissions = [
    'all',
    'sales',
    'customer',
    'quotation',
    'invoice',
    'accounting',
    'reports',
    'chart_of_accounts',
    'inventory',
    'products',
    'stock_opname',
    'transfer_stock',
    'manufacturing',
    'production_order',
    'workstation',
    'marketing',
    'campaigns',
    'leads',
    'franchise',
    'user_management',
    'settings'
  ];

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setNewUser({
        ...newUser,
        permissions: [...newUser.permissions, permission]
      });
    } else {
      setNewUser({
        ...newUser,
        permissions: newUser.permissions.filter(p => p !== permission)
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Pengguna
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Tambah Pengguna Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update informasi pengguna' : 'Masukkan informasi pengguna baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@zone.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="+62 xxx xxxx xxxx"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <select
                  id="department"
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Pilih Department</option>
                  {availableDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
            
            {/* Permissions */}
            <div className="mt-6">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {availablePermissions.map(permission => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={newUser.permissions.includes(permission)}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor={permission} className="text-sm">
                      {permission.replace(/_/g, ' ').toUpperCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingUser ? handleUpdateUser : handleAddUser}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingUser ? 'Update User' : 'Tambah User'}
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
                <div className="text-sm text-gray-600">Total Users</div>
                <div className="text-2xl font-bold text-gray-800">{users.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === 'Active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Administrators</div>
                <div className="text-2xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'Administrator').length}
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
                <div className="text-sm text-gray-600">Managers</div>
                <div className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.role.includes('Manager')).length}
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
              placeholder="Cari pengguna..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'Active' ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {user.lastLogin ? (
                        <div>
                          <div>{user.lastLogin.split(' ')[0]}</div>
                          <div className="text-gray-500">{user.lastLogin.split(' ')[1]}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Never</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.createdAt.split(' ')[0]}</div>
                      <div className="text-gray-500">by {user.createdBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => resetPassword(user.id)}
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
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

export default UserManagement;




