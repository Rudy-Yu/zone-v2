import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  Zap, 
  Settings, 
  Play,
  CheckCircle,
  AlertCircle,
  Database,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

const ExcelProcessor = () => {
  const [processedFiles, setProcessedFiles] = useState([]);
  const [activeProcess, setActiveProcess] = useState(null);
  
  // Mock processed Excel files
  const [excelFiles] = useState([
    {
      id: 'file1',
      name: 'Customer_Database.xlsx',
      originalSize: 2.3,
      processed: true,
      sheets: [
        {
          name: 'Customers',
          rows: 1250,
          columns: 12,
          generatedModule: 'customer_management',
          features: ['CRUD Operations', 'Search & Filter', 'Export', 'Bulk Import']
        },
        {
          name: 'Transactions',
          rows: 5680,
          columns: 8,
          generatedModule: 'transaction_history',
          features: ['Analytics Dashboard', 'Date Filtering', 'Export Reports']
        }
      ],
      uploadDate: '2024-01-20',
      status: 'Active'
    },
    {
      id: 'file2',
      name: 'Inventory_Master.xlsx',
      originalSize: 4.7,
      processed: true,
      sheets: [
        {
          name: 'Products',
          rows: 890,
          columns: 15,
          generatedModule: 'product_catalog',
          features: ['Stock Management', 'Price Updates', 'Category Filter', 'Low Stock Alerts']
        },
        {
          name: 'Suppliers',
          rows: 45,
          columns: 7,
          generatedModule: 'supplier_management',
          features: ['Contact Management', 'Performance Tracking']
        }
      ],
      uploadDate: '2024-01-18',
      status: 'Active'
    }
  ]);

  const processTypes = [
    {
      id: 'smart_form',
      name: 'Smart Form Generator',
      description: 'Otomatis buat form input berdasarkan struktur Excel',
      icon: '📝',
      features: ['Auto field detection', 'Validation rules', 'Custom layouts']
    },
    {
      id: 'data_grid',
      name: 'Dynamic Data Grid',
      description: 'Tabel interaktif dengan fitur lengkap',
      icon: '📊',
      features: ['Sort & Filter', 'Inline editing', 'Export options']
    },
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      description: 'Dashboard otomatis dengan charts dan metrics',
      icon: '📈',
      features: ['Auto charts', 'KPI cards', 'Real-time updates']
    },
    {
      id: 'api_module',
      name: 'REST API Module',
      description: 'Generate REST API endpoints otomatis',
      icon: '🔌',
      features: ['CRUD endpoints', 'Authentication', 'Documentation']
    }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      // Simulate processing
      const newProcess = {
        id: Date.now() + Math.random(),
        fileName: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        status: 'processing',
        progress: 0,
        estimatedTime: '2-3 minutes'
      };
      
      setActiveProcess(newProcess);
      
      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setActiveProcess(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            generatedModules: [
              `${file.name.replace('.xlsx', '')}_form`,
              `${file.name.replace('.xlsx', '')}_grid`,
              `${file.name.replace('.xlsx', '')}_api`
            ]
          }));
        }
        setActiveProcess(prev => ({
          ...prev,
          progress: Math.min(progress, 100)
        }));
      }, 200);
    });
  };

  const generateModule = (sheet, type) => {
    const moduleCode = {
      smart_form: `
// Auto-generated Form Component for ${sheet.name}
import React, { useState } from 'react';

const ${sheet.name}Form = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <form className="space-y-4">
      {/* Auto-generated fields based on Excel columns */}
      <div className="grid grid-cols-2 gap-4">
        ${sheet.columns > 0 ? Array(sheet.columns).fill(0).map((_, i) => 
          `<input 
            placeholder="Column ${i+1}" 
            className="border rounded px-3 py-2"
          />`
        ).join('\n        ') : ''}
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};`,
      
      data_grid: `
// Auto-generated Data Grid for ${sheet.name}
import React from 'react';

const ${sheet.name}Grid = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            ${Array(sheet.columns).fill(0).map((_, i) => 
              `<th className="border p-2">Column ${i+1}</th>`
            ).join('\n            ')}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              ${Array(sheet.columns).fill(0).map((_, i) => 
                `<td className="border p-2">{row.col${i+1}}</td>`
              ).join('\n              ')}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};`
    };
    
    return moduleCode[type] || 'Module type not found';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Excel to Module Processor</h1>
          <p className="text-gray-600">Upload Excel, otomatis jadi fitur dan modul yang bisa langsung dipakai</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="excel-processor-upload"
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('excel-processor-upload').click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Excel Files
          </Button>
        </div>
      </div>

      {/* Active Processing */}
      {activeProcess && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              {activeProcess.status === 'processing' ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              {activeProcess.status === 'processing' ? 'Processing File...' : 'Processing Complete!'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{activeProcess.fileName}</span>
                <span className="text-sm text-gray-600">{activeProcess.size} MB</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${activeProcess.progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{Math.round(activeProcess.progress)}% Complete</span>
                {activeProcess.status === 'processing' && (
                  <span>ETA: {activeProcess.estimatedTime}</span>
                )}
              </div>
              
              {activeProcess.status === 'completed' && (
                <div className="bg-green-100 p-3 rounded border border-green-200">
                  <p className="text-green-800 font-medium mb-2">✅ Generated Modules:</p>
                  <div className="flex gap-2">
                    {activeProcess.generatedModules?.map(module => (
                      <Badge key={module} className="bg-green-200 text-green-800">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="files" className="space-y-6">
        <TabsList>
          <TabsTrigger value="files">Processed Files</TabsTrigger>
          <TabsTrigger value="generator">Module Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-6">
          {/* Processed Files */}
          <div className="grid grid-cols-1 gap-6">
            {excelFiles.map((file) => (
              <Card key={file.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileSpreadsheet className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{file.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {file.originalSize} MB • {file.sheets.length} sheets • {file.uploadDate}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {file.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {file.sheets.map((sheet, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">{sheet.name}</h4>
                            <p className="text-sm text-gray-600">
                              {sheet.rows.toLocaleString()} rows × {sheet.columns} columns
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {sheet.generatedModule}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {sheet.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-3 w-3 mr-1" />
                            Launch Module
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Export Code
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-6">
          {/* Module Generator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{type.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {type.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" className="w-full">
                      <Zap className="h-3 w-3 mr-1" />
                      Generate Module
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Code Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Code Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{generateModule({ name: 'Sample', columns: 3 }, 'smart_form')}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'CRM Template', description: 'Customer management system', icon: '👥' },
              { name: 'Inventory Template', description: 'Stock and product management', icon: '📦' },
              { name: 'Financial Template', description: 'Accounting and finance', icon: '💰' },
              { name: 'HR Template', description: 'Human resource management', icon: '🏢' },
              { name: 'E-commerce Template', description: 'Online store management', icon: '🛒' },
              { name: 'Project Template', description: 'Project tracking system', icon: '📋' }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{template.icon}</div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExcelProcessor;