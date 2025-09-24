import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Edit, Trash2, Eye } from 'lucide-react';
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
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'Laptop ASUS ROG',
      sku: 'ASU-ROG-001',
      category: 'Elektronik',
      stock: 25,
      minStock: 10,
      price: 'Rp 15.000.000',
      status: 'Active'
    },
    {
      id: 'PRD-002',
      name: 'Mouse Logitech MX',
      sku: 'LOG-MX-002',
      category: 'Aksesoris',
      stock: 5,
      minStock: 10,
      price: 'Rp 850.000',
      status: 'Low Stock'
    },
    {
      id: 'PRD-003',
      name: 'Keyboard Mechanical',
      sku: 'KEY-MEC-003',
      category: 'Aksesoris',
      stock: 0,
      minStock: 5,
      price: 'Rp 1.200.000',
      status: 'Out of Stock'
    },
    {
      id: 'PRD-004',
      name: 'Monitor Dell 27"',
      sku: 'DEL-MON-004',
      category: 'Elektronik',
      stock: 15,
      minStock: 8,
      price: 'Rp 3.500.000',
      status: 'Active'
    }
  ];

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= minStock) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'Active', color: 'bg-green-100 text-green-800' };
  };

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    stock: '',
    minStock: '',
    maxStock: '',
    status: 'Active'
  });

  const categories = [
    'Elektronik',
    'Aksesoris',
    'Komputer',
    'Smartphone',
    'Gaming',
    'Office',
    'Home & Living',
    'Fashion',
    'Sports',
    'Books'
  ];

  const handleAddProduct = () => {
    const product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      ...newProduct,
      price: `Rp ${parseInt(newProduct.price).toLocaleString('id-ID')}`,
      stock: parseInt(newProduct.stock),
      minStock: parseInt(newProduct.minStock),
      maxStock: parseInt(newProduct.maxStock)
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      sku: '',
      description: '',
      category: '',
      price: '',
      cost: '',
      stock: '',
      minStock: '',
      maxStock: '',
      status: 'Active'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Produk</h1>
          <p className="text-gray-600">Kelola inventori dan produk Anda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>
                Isi informasi produk yang akan ditambahkan ke inventori.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Masukkan nama produk"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  placeholder="Masukkan SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newProduct.status} onValueChange={(value) => setNewProduct({...newProduct, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Harga Jual</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="Masukkan harga jual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Harga Beli</Label>
                <Input
                  id="cost"
                  type="number"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                  placeholder="Masukkan harga beli"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stok Awal</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  placeholder="Masukkan stok awal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stok Minimum</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                  placeholder="Masukkan stok minimum"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStock">Stok Maksimum</Label>
                <Input
                  id="maxStock"
                  type="number"
                  value={newProduct.maxStock}
                  onChange={(e) => setNewProduct({...newProduct, maxStock: e.target.value})}
                  placeholder="Masukkan stok maksimum"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Masukkan deskripsi produk"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddProduct} className="bg-red-500 hover:bg-red-600 text-white">
                Tambah Produk
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
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Produk</div>
                <div className="text-2xl font-bold text-gray-800">{products.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Stok Tersedia</div>
                <div className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.stock > p.minStock).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Stok Menipis</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {products.filter(p => p.stock <= p.minStock && p.stock > 0).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Stok Habis</div>
                <div className="text-2xl font-bold text-red-600">
                  {products.filter(p => p.stock === 0).length}
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
              placeholder="Cari produk atau SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Min. Stok</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockInfo = getStockStatus(product.stock, product.minStock);
                return (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-600">{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <span className={product.stock <= product.minStock ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{product.minStock}</TableCell>
                    <TableCell className="font-semibold">{product.price}</TableCell>
                    <TableCell>
                      <Badge className={stockInfo.color}>
                        {stockInfo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Low Stock Alert */}
      {products.some(p => p.stock <= p.minStock) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">Peringatan Stok</h3>
                <p className="text-yellow-700 text-sm">
                  Beberapa produk memiliki stok yang menipis atau habis. Segera lakukan restock.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Products;