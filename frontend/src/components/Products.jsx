import React, { useState } from 'react';
import { Plus, Search, Package, AlertTriangle } from 'lucide-react';
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

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
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
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
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