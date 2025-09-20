import React, { useState } from 'react';
import { 
  Palette, 
  Layout, 
  Menu, 
  Settings, 
  Save, 
  RotateCcw, 
  Eye,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const Customization = () => {
  const [companySettings, setCompanySettings] = useState({
    name: 'PT. Sample Company',
    logo: null,
    primaryColor: '#ef4444',
    secondaryColor: '#1f2937',
    accentColor: '#3b82f6'
  });

  const [menuSettings, setMenuSettings] = useState({
    modules: [
      { id: 'dashboard', name: 'Dashboard', icon: 'BarChart3', enabled: true, order: 1 },
      { id: 'sales', name: 'Penjualan', icon: 'TrendingUp', enabled: true, order: 2 },
      { id: 'purchase', name: 'Pembelian', icon: 'ShoppingCart', enabled: true, order: 3 },
      { id: 'inventory', name: 'Inventory', icon: 'Package', enabled: true, order: 4 },
      { id: 'manufacturing', name: 'Manufaktur', icon: 'Factory', enabled: true, order: 5 },
      { id: 'marketing', name: 'Marketing & CRM', icon: 'Target', enabled: true, order: 6 },
      { id: 'franchise', name: 'Sistem Franchise', icon: 'Store', enabled: true, order: 7 },
      { id: 'accounting', name: 'Akuntansi', icon: 'FileText', enabled: true, order: 8 },
      { id: 'reports', name: 'Laporan', icon: 'FileText', enabled: true, order: 9 }
    ]
  });

  const [dashboardSettings, setDashboardSettings] = useState({
    widgets: [
      { id: 'revenue', name: 'Total Pendapatan', enabled: true, position: 1, size: 'medium' },
      { id: 'expense', name: 'Total Pengeluaran', enabled: true, position: 2, size: 'medium' },
      { id: 'profit', name: 'Laba Bersih', enabled: true, position: 3, size: 'medium' },
      { id: 'invoice', name: 'Invoice Pending', enabled: true, position: 4, size: 'medium' },
      { id: 'cashflow', name: 'Grafik Arus Kas', enabled: true, position: 5, size: 'large' },
      { id: 'transactions', name: 'Transaksi Terbaru', enabled: true, position: 6, size: 'large' },
      { id: 'quickactions', name: 'Aksi Cepat', enabled: true, position: 7, size: 'full' }
    ]
  });

  const [customFields, setCustomFields] = useState({
    customer: [
      { id: 'cf1', name: 'Rating Kredibilitas', type: 'select', options: ['A', 'B', 'C', 'D'] },
      { id: 'cf2', name: 'Kategori Bisnis', type: 'text', options: [] }
    ],
    product: [
      { id: 'cf3', name: 'Garansi (Bulan)', type: 'number', options: [] },
      { id: 'cf4', name: 'Sertifikasi', type: 'select', options: ['ISO', 'SNI', 'CE', 'FCC'] }
    ]
  });

  const colorThemes = [
    { name: 'Zone Red', primary: '#ef4444', secondary: '#1f2937', accent: '#3b82f6' },
    { name: 'Professional Blue', primary: '#3b82f6', secondary: '#1e293b', accent: '#10b981' },
    { name: 'Modern Purple', primary: '#8b5cf6', secondary: '#374151', accent: '#f59e0b' },
    { name: 'Forest Green', primary: '#10b981', secondary: '#1f2937', accent: '#ef4444' },
    { name: 'Ocean Teal', primary: '#14b8a6', secondary: '#1e293b', accent: '#f97316' }
  ];

  const handleModuleToggle = (moduleId) => {
    setMenuSettings(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module.id === moduleId ? { ...module, enabled: !module.enabled } : module
      )
    }));
  };

  const handleWidgetToggle = (widgetId) => {
    setDashboardSettings(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
      )
    }));
  };

  const addCustomField = (module) => {
    const newField = {
      id: `cf${Date.now()}`,
      name: '',
      type: 'text',
      options: []
    };
    
    setCustomFields(prev => ({
      ...prev,
      [module]: [...prev[module], newField]
    }));
  };

  const removeCustomField = (module, fieldId) => {
    setCustomFields(prev => ({
      ...prev,
      [module]: prev[module].filter(field => field.id !== fieldId)
    }));
  };

  const handleSaveSettings = () => {
    // Simulate saving to backend
    console.log('Saving customization settings...', {
      companySettings,
      menuSettings,
      dashboardSettings,
      customFields
    });
    
    // Apply theme changes
    document.documentElement.style.setProperty('--primary', companySettings.primaryColor);
    document.documentElement.style.setProperty('--secondary', companySettings.secondaryColor);
    
    alert('Pengaturan berhasil disimpan!');
  };

  const handleResetSettings = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan ke pengaturan default?')) {
      // Reset to default settings
      setCompanySettings({
        name: 'PT. Sample Company',
        logo: null,
        primaryColor: '#ef4444',
        secondaryColor: '#1f2937',
        accentColor: '#3b82f6'
      });
      
      alert('Pengaturan berhasil direset ke default!');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Customization & Settings</h1>
          <p className="text-gray-600">Sesuaikan tampilan dan fungsionalitas sistem sesuai kebutuhan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Default
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Branding</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nama Perusahaan</Label>
                  <Input
                    id="companyName"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Logo Perusahaan</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {companySettings.logo ? (
                        <img src={companySettings.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Upload className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {colorThemes.map((theme) => (
                      <div
                        key={theme.name}
                        className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => setCompanySettings(prev => ({
                          ...prev,
                          primaryColor: theme.primary,
                          secondaryColor: theme.secondary,
                          accentColor: theme.accent
                        }))}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: theme.primary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: theme.secondary }}
                            ></div>
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: theme.accent }}
                            ></div>
                          </div>
                          <span className="font-medium">{theme.name}</span>
                        </div>
                        {companySettings.primaryColor === theme.primary && (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: companySettings.primaryColor }}
                      >
                        A
                      </div>
                      <span className="text-lg font-semibold">{companySettings.name}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div 
                        className="h-8 rounded text-white flex items-center px-3"
                        style={{ backgroundColor: companySettings.primaryColor }}
                      >
                        Sample Button
                      </div>
                      <div 
                        className="h-6 rounded"
                        style={{ backgroundColor: companySettings.secondaryColor }}
                      ></div>
                      <div 
                        className="h-4 rounded w-3/4"
                        style={{ backgroundColor: companySettings.accentColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menuSettings.modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-xs">{module.icon.substring(0, 2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">{module.name}</span>
                        <span className="text-sm text-gray-500 block">Order: {module.order}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={module.enabled}
                        onCheckedChange={() => handleModuleToggle(module.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardSettings.widgets.map((widget) => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">{widget.name}</span>
                      <div className="text-sm text-gray-500">
                        Size: {widget.size} | Position: {widget.position}
                      </div>
                    </div>
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={() => handleWidgetToggle(widget.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.keys(customFields).map((module) => (
              <Card key={module}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="capitalize">{module} Custom Fields</CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addCustomField(module)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customFields[module].map((field) => (
                      <div key={field.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Field Name"
                            value={field.name}
                            onChange={(e) => {
                              setCustomFields(prev => ({
                                ...prev,
                                [module]: prev[module].map(f =>
                                  f.id === field.id ? { ...f, name: e.target.value } : f
                                )
                              }));
                            }}
                          />
                          <Select
                            value={field.type}
                            onValueChange={(value) => {
                              setCustomFields(prev => ({
                                ...prev,
                                [module]: prev[module].map(f =>
                                  f.id === field.id ? { ...f, type: value } : f
                                )
                              }));
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="select">Select</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="checkbox">Checkbox</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomField(module, field.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Import/Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Current Settings
                </Button>
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Settings File
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Dark Mode</Label>
                  <Switch />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Compact Layout</Label>
                  <Switch />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Auto Save</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex justify-between items-center">
                  <Label>Sound Notifications</Label>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Customization;