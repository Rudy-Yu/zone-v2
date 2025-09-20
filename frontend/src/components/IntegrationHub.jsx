import React, { useState } from 'react';
import { 
  Zap, 
  Settings, 
  Power, 
  Link, 
  GitBranch,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ArrowDown,
  Database,
  Users,
  ShoppingCart,
  Factory,
  Target,
  Store,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'sales-to-inventory',
      name: 'Sales → Inventory Auto Update',
      description: 'Otomatis kurangi stok ketika ada penjualan',
      source: { module: 'sales', icon: ShoppingCart, color: 'text-green-600' },
      target: { module: 'inventory', icon: Database, color: 'text-blue-600' },
      status: 'active',
      trigger: 'invoice_created',
      actions: ['update_stock', 'check_reorder_point', 'send_alert'],
      frequency: 'realtime',
      lastRun: '2024-01-20 14:30:25',
      successRate: 98.5
    },
    {
      id: 'marketing-to-sales',
      name: 'Marketing Leads → Sales Pipeline',
      description: 'Konversi lead marketing jadi opportunity sales',
      source: { module: 'marketing', icon: Target, color: 'text-purple-600' },
      target: { module: 'sales', icon: ShoppingCart, color: 'text-green-600' },
      status: 'active',
      trigger: 'lead_qualified',
      actions: ['create_opportunity', 'assign_salesperson', 'send_notification'],
      frequency: 'immediate',
      lastRun: '2024-01-20 13:45:12',
      successRate: 94.2
    },
    {
      id: 'manufacturing-to-accounting',
      name: 'Production Cost → Accounting',
      description: 'Auto posting biaya produksi ke jurnal akuntansi',
      source: { module: 'manufacturing', icon: Factory, color: 'text-orange-600' },
      target: { module: 'accounting', icon: FileSpreadsheet, color: 'text-gray-600' },
      status: 'active',
      trigger: 'production_completed',
      actions: ['create_journal_entry', 'update_cogs', 'calculate_variance'],
      frequency: 'daily',
      lastRun: '2024-01-20 08:00:00',
      successRate: 99.1
    },
    {
      id: 'franchise-to-reports',
      name: 'Franchise Performance → Consolidated Reports',
      description: 'Konsolidasi laporan semua mitra franchise',
      source: { module: 'franchise', icon: Store, color: 'text-red-600' },
      target: { module: 'reports', icon: FileSpreadsheet, color: 'text-gray-600' },
      status: 'active',
      trigger: 'monthly',
      actions: ['aggregate_revenue', 'calculate_royalty', 'generate_report'],
      frequency: 'monthly',
      lastRun: '2024-01-01 00:00:00',
      successRate: 96.8
    },
    {
      id: 'excel-to-all',
      name: 'Excel Data → Multi-Module Sync',
      description: 'Sinkronisasi data Excel ke semua modul terkait',
      source: { module: 'excel', icon: FileSpreadsheet, color: 'text-emerald-600' },
      target: { module: 'all', icon: Database, color: 'text-blue-600' },
      status: 'paused',
      trigger: 'file_uploaded',
      actions: ['parse_data', 'validate_format', 'distribute_to_modules'],
      frequency: 'on_demand',
      lastRun: '2024-01-19 16:20:30',
      successRate: 92.3
    }
  ]);

  const [automationRules, setAutomationRules] = useState([
    {
      id: 'rule1',
      name: 'Low Stock Alert & Reorder',
      condition: 'inventory.stock <= inventory.min_stock',
      actions: [
        'Send alert to purchasing team',
        'Create purchase requisition',
        'Notify suppliers',
        'Update dashboard status'
      ],
      modules: ['inventory', 'purchase', 'notifications'],
      status: 'active',
      triggered: 15,
      lastTriggered: '2024-01-20 12:30:00'
    },
    {
      id: 'rule2',
      name: 'Customer Upgrade Flow',
      condition: 'customer.total_purchases > 10000000',
      actions: [
        'Upgrade customer tier',
        'Send VIP welcome email',
        'Assign premium support',
        'Apply special discounts'
      ],
      modules: ['sales', 'marketing', 'customers'],
      status: 'active',
      triggered: 8,
      lastTriggered: '2024-01-20 10:15:00'
    },
    {
      id: 'rule3',
      name: 'Franchise Performance Monitor',
      condition: 'franchise.monthly_revenue < franchise.target * 0.8',
      actions: [
        'Flag underperforming outlet',
        'Schedule support visit',
        'Send improvement plan',
        'Alert regional manager'
      ],
      modules: ['franchise', 'notifications', 'reports'],
      status: 'active',
      triggered: 3,
      lastTriggered: '2024-01-19 18:45:00'
    }
  ]);

  const [realTimeSync, setRealTimeSync] = useState([
    {
      module: 'Sales',
      icon: ShoppingCart,
      color: 'text-green-600',
      connections: ['Inventory', 'Accounting', 'Marketing'],
      status: 'synced',
      lastSync: '2 mins ago',
      pendingChanges: 0
    },
    {
      module: 'Manufacturing',
      icon: Factory,
      color: 'text-orange-600',
      connections: ['Inventory', 'Accounting', 'Purchase'],
      status: 'syncing',
      lastSync: 'syncing...',
      pendingChanges: 3
    },
    {
      module: 'Franchise',
      icon: Store,
      color: 'text-red-600',
      connections: ['Reports', 'Accounting', 'Marketing'],
      status: 'synced',
      lastSync: '5 mins ago',
      pendingChanges: 0
    },
    {
      module: 'Marketing',
      icon: Target,
      color: 'text-purple-600',
      connections: ['Sales', 'CRM', 'Analytics'],
      status: 'error',
      lastSync: '1 hour ago',
      pendingChanges: 12
    }
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id 
        ? { ...integration, status: integration.status === 'active' ? 'paused' : 'active' }
        : integration
    ));
  };

  const toggleAutomationRule = (id) => {
    setAutomationRules(prev => prev.map(rule =>
      rule.id === id 
        ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
        : rule
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'paused': return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'synced': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Integration Hub & Automation</h1>
          <p className="text-gray-600">Kontrol semua integrasi dan automasi sistem dalam satu tempat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Global Settings
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Zap className="h-4 w-4 mr-2" />
            New Integration
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Link className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Integrations</div>
                <div className="text-2xl font-bold text-gray-800">
                  {integrations.filter(i => i.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Automation Rules</div>
                <div className="text-2xl font-bold text-blue-600">
                  {automationRules.filter(r => r.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Sync Success Rate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(integrations.reduce((acc, i) => acc + i.successRate, 0) / integrations.length)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <GitBranch className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Connected Modules</div>
                <div className="text-2xl font-bold text-orange-600">8</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Active Integrations</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="realtime">Real-time Sync</TabsTrigger>
          <TabsTrigger value="builder">Integration Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Integration Flow Cards */}
          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 bg-gray-100 rounded-lg ${integration.source.color}`}>
                          <integration.source.icon className="h-5 w-5" />
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className={`p-2 bg-gray-100 rounded-lg ${integration.target.color}`}>
                          <integration.target.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{integration.name}</h3>
                        <p className="text-sm text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(integration.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(integration.status)}
                          {integration.status}
                        </div>
                      </Badge>
                      <Switch
                        checked={integration.status === 'active'}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Trigger:</span>
                      <div className="font-medium">{integration.trigger}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Frequency:</span>
                      <div className="font-medium">{integration.frequency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <div className="font-medium text-green-600">{integration.successRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Run:</span>
                      <div className="font-medium">{integration.lastRun}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-500 mb-2">Actions:</div>
                    <div className="flex flex-wrap gap-2">
                      {integration.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          {/* Automation Rules */}
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{rule.name}</h3>
                      <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {rule.condition}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(rule.status)}>
                        {rule.status}
                      </Badge>
                      <Switch
                        checked={rule.status === 'active'}
                        onCheckedChange={() => toggleAutomationRule(rule.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Triggered:</span>
                      <div className="font-medium">{rule.triggered} times</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Triggered:</span>
                      <div className="font-medium">{rule.lastTriggered}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Connected Modules:</span>
                      <div className="font-medium">{rule.modules.length}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Automated Actions:</div>
                      <div className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <ArrowDown className="h-3 w-3 text-gray-400" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          {/* Real-time Sync Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realTimeSync.map((module, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gray-100 rounded-lg ${module.color}`}>
                        <module.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{module.module}</h3>
                        <p className="text-sm text-gray-600">
                          Connected to {module.connections.length} modules
                        </p>
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(module.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(module.status)}
                        {module.status}
                      </div>
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Sync:</span>
                      <span className="font-medium">{module.lastSync}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pending Changes:</span>
                      <span className={`font-medium ${module.pendingChanges > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {module.pendingChanges}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">Connected to:</div>
                      <div className="flex flex-wrap gap-1">
                        {module.connections.map((connection, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {connection}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Builder</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Visual Integration Builder</h3>
              <p className="text-gray-600 mb-6">
                Drag & drop interface untuk membuat integrasi custom antar modul
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <PlayCircle className="h-4 w-4 mr-2" />
                Launch Builder
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationHub;