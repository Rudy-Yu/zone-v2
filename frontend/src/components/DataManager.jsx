import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  Database, 
  FileSpreadsheet, 
  Plus, 
  Edit3, 
  Trash2,
  Search,
  Filter,
  Settings,
  Play,
  Save,
  Eye,
  Grid,
  BarChart3,
  Code,
  FileCode,
  Monitor
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const DataManager = () => {
  const [importedData, setImportedData] = useState([]);
  const [dataModules, setDataModules] = useState([
    {
      id: 'customers',
      name: 'Customer Database', 
      description: 'Manajemen data pelanggan',
      type: 'CRM',
      fields: [
        { name: 'nama', type: 'text', label: 'Nama Lengkap', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'phone', type: 'tel', label: 'No. Telepon', required: false },
        { name: 'company', type: 'text', label: 'Perusahaan', required: false },
        { name: 'address', type: 'textarea', label: 'Alamat', required: false },
        { name: 'status', type: 'select', label: 'Status', options: ['Active', 'Inactive', 'Prospect'] }
      ],
      data: [
        { nama: 'John Doe', email: 'john@example.com', phone: '08123456789', company: 'PT. ABC', address: 'Jakarta', status: 'Active' },
        { nama: 'Jane Smith', email: 'jane@example.com', phone: '08198765432', company: 'CV. XYZ', address: 'Surabaya', status: 'Prospect' },
        { nama: 'Bob Wilson', email: 'bob@example.com', phone: '08155544433', company: 'Toko Maju', address: 'Bandung', status: 'Active' }
      ],
      created: '2024-01-15',
      records: 3
    },
    {
      id: 'inventory',
      name: 'Inventory Master',
      description: 'Data barang dan stok',
      type: 'Operations',
      fields: [
        { name: 'sku', type: 'text', label: 'SKU', required: true },
        { name: 'name', type: 'text', label: 'Nama Produk', required: true },
        { name: 'category', type: 'select', label: 'Kategori', options: ['Elektronik', 'Fashion', 'Makanan', 'Lainnya'] },
        { name: 'price', type: 'number', label: 'Harga', required: true },
        { name: 'stock', type: 'number', label: 'Stok', required: true },
        { name: 'min_stock', type: 'number', label: 'Min. Stok', required: false }
      ],
      data: [
        { sku: 'ELK001', name: 'Laptop Gaming', category: 'Elektronik', price: 15000000, stock: 25, min_stock: 5 },
        { sku: 'FSH002', name: 'T-Shirt Premium', category: 'Fashion', price: 150000, stock: 100, min_stock: 20 },
        { sku: 'MKN003', name: 'Kopi Arabica', category: 'Makanan', price: 75000, stock: 50, min_stock: 10 }
      ],
      created: '2024-01-16',
      records: 3
    }
  ]);
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModuleBuilderOpen, setIsModuleBuilderOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    name: '',
    description: '',
    type: '',
    fields: []
  });
  const [editorCode, setEditorCode] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('javascript');

  const handleCreateModule = () => {
    const module = {
      id: newModule.name.toLowerCase().replace(/\s+/g, '_'),
      ...newModule,
      data: [],
      created: new Date().toISOString().split('T')[0],
      records: 0
    };
    
    setDataModules([...dataModules, module]);
    setNewModule({
      name: '',
      description: '',
      type: '',
      fields: []
    });
    setIsModuleBuilderOpen(false);
  };

  const handleLaunchEditor = () => {
    // Set default code based on selected module
    if (selectedModule) {
      setEditorCode(`// Module: ${selectedModule.name}
// Description: ${selectedModule.description}

const module = {
  name: '${selectedModule.name}',
  description: '${selectedModule.description}',
  type: '${selectedModule.type}',
  fields: ${JSON.stringify(selectedModule.fields, null, 2)},
  data: ${JSON.stringify(selectedModule.data, null, 2)}
};

// Custom functions for this module
function getModuleData() {
  return module.data;
}

function addRecord(record) {
  module.data.push(record);
  return module.data;
}

function updateRecord(index, record) {
  module.data[index] = record;
  return module.data;
}

function deleteRecord(index) {
  module.data.splice(index, 1);
  return module.data;
}

// Export functions
module.exports = {
  getModuleData,
  addRecord,
  updateRecord,
  deleteRecord
};`);
    }
    setIsEditorOpen(true);
  };

  const handleSaveEditor = () => {
    // Save editor code
    console.log('Saving editor code:', editorCode);
    setIsEditorOpen(false);
  };

  // Simulate Excel import
  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate reading Excel file
      const mockExcelData = [
        { 'Product Name': 'Smartphone X1', 'Category': 'Electronics', 'Price': 5000000, 'Stock': 50, 'Supplier': 'PT. Tech Indo' },
        { 'Product Name': 'Headphone Pro', 'Category': 'Electronics', 'Price': 1500000, 'Stock': 30, 'Supplier': 'CV. Audio' },
        { 'Product Name': 'Sepatu Sport', 'Category': 'Fashion', 'Price': 800000, 'Stock': 75, 'Supplier': 'Toko Sepatu' }
      ];
      
      setImportedData(mockExcelData);
      
      // Auto-generate module from Excel structure
      generateModuleFromExcel(mockExcelData, file.name);
    }
  };

  const generateModuleFromExcel = (data, fileName) => {
    if (data.length === 0) return;
    
    const firstRow = data[0];
    const fields = Object.keys(firstRow).map(key => {
      const value = firstRow[key];
      let type = 'text';
      
      if (typeof value === 'number') {
        type = 'number';
      } else if (key.toLowerCase().includes('email')) {
        type = 'email';
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('telp')) {
        type = 'tel';
      } else if (key.toLowerCase().includes('date') || key.toLowerCase().includes('tanggal')) {
        type = 'date';
      }
      
      return {
        name: key.toLowerCase().replace(/\s+/g, '_'),
        type: type,
        label: key,
        required: false
      };
    });

    const newModule = {
      id: `excel_${Date.now()}`,
      name: fileName.replace('.xlsx', '').replace('.xls', ''),
      description: `Data imported from ${fileName}`,
      type: 'Excel Import',
      fields: fields,
      data: data.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
          newRow[key.toLowerCase().replace(/\s+/g, '_')] = row[key];
        });
        return newRow;
      }),
      created: new Date().toISOString().split('T')[0],
      records: data.length
    };

    setDataModules(prev => [...prev, newModule]);
  };

  const createNewModule = () => {
    const newModule = {
      id: `module_${Date.now()}`,
      name: 'New Module',
      description: 'Custom data module',
      type: 'Custom',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true }
      ],
      data: [],
      created: new Date().toISOString().split('T')[0],
      records: 0
    };
    
    setDataModules(prev => [...prev, newModule]);
    setSelectedModule(newModule);
  };

  const addRecord = (module) => {
    const newRecord = {};
    module.fields.forEach(field => {
      newRecord[field.name] = '';
    });
    setEditingRecord(newRecord);
  };

  const saveRecord = () => {
    if (selectedModule && editingRecord) {
      const updatedModule = {
        ...selectedModule,
        data: [...selectedModule.data, editingRecord],
        records: selectedModule.data.length + 1
      };
      
      setDataModules(prev => prev.map(m => 
        m.id === selectedModule.id ? updatedModule : m
      ));
      
      setSelectedModule(updatedModule);
      setEditingRecord(null);
    }
  };

  const exportToExcel = (module) => {
    // Simulate Excel export
    const csvContent = [
      module.fields.map(f => f.label).join(','),
      ...module.data.map(row => 
        module.fields.map(f => row[f.name] || '').join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${module.name}.csv`;
    a.click();
  };

  const getFilteredData = (module) => {
    if (!module) return [];
    
    return module.data.filter(row => {
      const matchesSearch = Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesFilter = !filterCategory || 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(filterCategory.toLowerCase())
        );
      
      return matchesSearch && matchesFilter;
    });
  };

  const renderField = (field, value, onChange) => {
    switch (field.type) {
      case 'select':
        return (
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'textarea':
        return (
          <textarea
            className="w-full p-2 border rounded"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
          />
        );
      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
          />
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Dynamic Data Manager</h1>
          <p className="text-gray-600">Import Excel, buat modul custom, dan kelola data dengan fleksibel</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelImport}
            className="hidden"
            id="excel-upload"
          />
          <Button variant="outline" onClick={() => document.getElementById('excel-upload').click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => setIsModuleBuilderOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buat Modul Baru
          </Button>
          <Button variant="outline" onClick={handleLaunchEditor}>
            <Code className="h-4 w-4 mr-2" />
            Launch Editor
          </Button>
        </div>
      </div>

      {/* Import Preview */}
      {importedData.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">✅ Excel Data Imported Successfully</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-3">
              {importedData.length} records imported and automatically converted to module
            </p>
            <div className="bg-white p-3 rounded border max-h-40 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(importedData[0] || {}).map(key => (
                      <TableHead key={key}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importedData.slice(0, 3).map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, idx) => (
                        <TableCell key={idx}>{String(value)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="modules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="modules">Data Modules</TabsTrigger>
          <TabsTrigger value="editor">Module Editor</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataModules.map((module) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <Badge>{module.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Records:</span>
                      <span className="font-medium">{module.records}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fields:</span>
                      <span className="font-medium">{module.fields.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{module.created}</span>
                    </div>
                    
                    <div className="flex gap-2 pt-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedModule(module)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => exportToExcel(module)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Module Data */}
          {selectedModule && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{selectedModule.name}</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => addRecord(selectedModule)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {selectedModule.fields.map((field) => (
                        <TableHead key={field.name}>{field.label}</TableHead>
                      ))}
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredData(selectedModule).map((row, index) => (
                      <TableRow key={index}>
                        {selectedModule.fields.map((field) => (
                          <TableCell key={field.name}>
                            {String(row[field.name] || '')}
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Add Record Modal */}
          {editingRecord && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Add New Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedModule.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {renderField(
                        field,
                        editingRecord[field.name] || '',
                        (value) => setEditingRecord(prev => ({
                          ...prev,
                          [field.name]: value
                        }))
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <Button onClick={saveRecord} className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Record
                  </Button>
                  <Button variant="outline" onClick={() => setEditingRecord(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Builder</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Visual Module Editor</h3>
              <p className="text-gray-600 mb-6">
                Drag & drop interface untuk membangun modul data custom
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Play className="h-4 w-4 mr-2" />
                Launch Editor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Database className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Modules</div>
                    <div className="text-2xl font-bold text-gray-800">{dataModules.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Records</div>
                    <div className="text-2xl font-bold text-green-600">
                      {dataModules.reduce((sum, m) => sum + m.records, 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Excel Imports</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {dataModules.filter(m => m.type === 'Excel Import').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Module Builder Dialog */}
      <Dialog open={isModuleBuilderOpen} onOpenChange={setIsModuleBuilderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Module Baru</DialogTitle>
            <DialogDescription>
              Buat module data custom dengan field yang dapat dikonfigurasi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moduleName">Nama Module</Label>
                <Input
                  id="moduleName"
                  value={newModule.name}
                  onChange={(e) => setNewModule({...newModule, name: e.target.value})}
                  placeholder="Masukkan nama module"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moduleType">Tipe Module</Label>
                <Select value={newModule.type} onValueChange={(value) => setNewModule({...newModule, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRM">CRM</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moduleDescription">Deskripsi</Label>
              <textarea
                id="moduleDescription"
                value={newModule.description}
                onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                placeholder="Masukkan deskripsi module"
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Fields</Label>
              <div className="space-y-2">
                {newModule.fields.map((field, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      value={field.name}
                      onChange={(e) => {
                        const updatedFields = [...newModule.fields];
                        updatedFields[index].name = e.target.value;
                        setNewModule({...newModule, fields: updatedFields});
                      }}
                      placeholder="Field name"
                      className="flex-1"
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) => {
                        const updatedFields = [...newModule.fields];
                        updatedFields[index].type = value;
                        setNewModule({...newModule, fields: updatedFields});
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updatedFields = newModule.fields.filter((_, i) => i !== index);
                        setNewModule({...newModule, fields: updatedFields});
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewModule({
                      ...newModule,
                      fields: [...newModule.fields, { name: '', type: 'text', label: '', required: false }]
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Field
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModuleBuilderOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateModule} className="bg-red-500 hover:bg-red-600 text-white">
              Buat Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Code Editor</DialogTitle>
            <DialogDescription>
              Edit dan custom code untuk module yang dipilih.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={editorLanguage} onValueChange={setEditorLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button variant="outline" size="sm">
                <FileCode className="h-4 w-4 mr-2" />
                Format
              </Button>
            </div>
            <div className="border rounded-lg">
              <textarea
                value={editorCode}
                onChange={(e) => setEditorCode(e.target.value)}
                className="w-full h-96 p-4 font-mono text-sm border-0 resize-none focus:outline-none"
                placeholder="// Start coding here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveEditor} className="bg-red-500 hover:bg-red-600 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataManager;