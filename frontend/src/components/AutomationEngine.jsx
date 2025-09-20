import React, { useState } from 'react';
import { 
  Bot, 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  GitBranch,
  Filter,
  BarChart3,
  Mail,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
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

const AutomationEngine = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf1',
      name: 'Sales Order Processing',
      description: 'Otomatis proses order dari lead hingga delivery',
      status: 'active',
      steps: [
        'Lead qualification check',
        'Create sales quote',
        'Send to customer approval',
        'Generate invoice on approval',
        'Update inventory stock',
        'Create delivery order',
        'Send tracking notification'
      ],
      trigger: {
        type: 'form_submit',
        module: 'sales',
        condition: 'lead_score >= 80'
      },
      frequency: 'immediate',
      lastRun: '2024-01-20 15:30:00',
      successRate: 96.5,
      totalRuns: 247,
      avgExecutionTime: '2.3 seconds'
    },
    {
      id: 'wf2',
      name: 'Inventory Replenishment',
      description: 'Otomatis buat PO ketika stok menipis',
      status: 'active',
      steps: [
        'Monitor stock levels',
        'Check reorder point',
        'Calculate optimal quantity',
        'Find preferred supplier',
        'Generate purchase order',
        'Send to supplier email',
        'Update purchasing log'
      ],
      trigger: {
        type: 'condition',
        module: 'inventory',
        condition: 'current_stock <= reorder_point'
      },
      frequency: 'hourly',
      lastRun: '2024-01-20 14:00:00',
      successRate: 98.2,
      totalRuns: 89,
      avgExecutionTime: '1.8 seconds'
    },
    {
      id: 'wf3',
      name: 'Customer Onboarding',
      description: 'Welcome flow untuk customer baru',
      status: 'active',
      steps: [
        'Send welcome email',
        'Create customer profile',
        'Assign account manager',
        'Schedule onboarding call',
        'Send product catalog',
        'Add to newsletter',
        'Set follow-up reminders'
      ],
      trigger: {
        type: 'event',
        module: 'crm',
        condition: 'new_customer_registered'
      },
      frequency: 'immediate',
      lastRun: '2024-01-20 13:15:00',
      successRate: 94.8,
      totalRuns: 156,
      avgExecutionTime: '4.1 seconds'
    },
    {
      id: 'wf4',
      name: 'Franchise Performance Alert',
      description: 'Monitor dan alert performa franchise',
      status: 'paused',
      steps: [
        'Collect daily sales data',
        'Compare with targets',
        'Calculate performance metrics',
        'Identify underperforming outlets',
        'Send alert to regional manager',
        'Create action plan',
        'Schedule support visit'
      ],
      trigger: {
        type: 'schedule',
        module: 'franchise',
        condition: 'daily at 18:00'
      },
      frequency: 'daily',
      lastRun: '2024-01-19 18:00:00',
      successRate: 92.1,
      totalRuns: 45,
      avgExecutionTime: '12.7 seconds'
    }
  ]);

  const [automationLogs, setAutomationLogs] = useState([
    {
      id: 'log1',
      workflowId: 'wf1',
      workflowName: 'Sales Order Processing',
      timestamp: '2024-01-20 15:30:25',
      status: 'success',
      executionTime: '2.1s',
      triggeredBy: 'Lead ID: 12847',
      stepsCompleted: 7,
      totalSteps: 7,
      output: 'Invoice #INV-2024-0125 generated successfully'
    },
    {
      id: 'log2',
      workflowId: 'wf2',
      workflowName: 'Inventory Replenishment',
      timestamp: '2024-01-20 14:30:15',
      status: 'success',
      executionTime: '1.8s',
      triggeredBy: 'Product: Laptop Gaming ROG',
      stepsCompleted: 7,
      totalSteps: 7,
      output: 'PO #PO-2024-0089 sent to supplier'
    },
    {
      id: 'log3',
      workflowId: 'wf3',
      workflowName: 'Customer Onboarding',
      timestamp: '2024-01-20 13:15:30',
      status: 'partial',
      executionTime: '6.2s',
      triggeredBy: 'Customer: Jane Doe',
      stepsCompleted: 5,
      totalSteps: 7,
      output: 'Email service timeout on step 6'
    },
    {
      id: 'log4',
      workflowId: 'wf1',
      workflowName: 'Sales Order Processing',
      timestamp: '2024-01-20 12:45:10',
      status: 'failed',
      executionTime: '0.5s',
      triggeredBy: 'Lead ID: 12846',
      stepsCompleted: 2,
      totalSteps: 7,
      output: 'Error: Insufficient inventory for Product ID: 445'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'notif1',
      type: 'email',
      title: 'Low Stock Alert',
      message: 'Product "Smartphone X1" stock is below reorder point (5 units remaining)',
      channels: ['email', 'dashboard'],
      recipients: ['purchasing@company.com', 'manager@company.com'],
      status: 'sent',
      timestamp: '2024-01-20 14:30:00'
    },
    {
      id: 'notif2',
      type: 'system',
      title: 'New Customer Registered',
      message: 'Welcome workflow initiated for customer: John Smith',
      channels: ['dashboard', 'slack'],
      recipients: ['sales@company.com'],
      status: 'pending',
      timestamp: '2024-01-20 13:15:00'
    },
    {
      id: 'notif3',
      type: 'alert',
      title: 'Franchise Performance Warning',
      message: 'Outlet Jakarta Selatan 2 performance below 80% this month',
      channels: ['email', 'sms', 'dashboard'],
      recipients: ['regional.manager@company.com'],
      status: 'sent',
      timestamp: '2024-01-20 08:00:00'
    }
  ]);

  const toggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === id 
        ? { ...workflow, status: workflow.status === 'active' ? 'paused' : 'active' }
        : workflow
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'partial': return <Clock className="h-4 w-4 text-orange-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      case 'alert': return <AlertCircle className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Automation Engine</h1>
          <p className="text-gray-600">Otomatisasi workflow dan proses bisnis dengan AI-powered rules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Engine Settings
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Engine Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Active Workflows</div>
                <div className="text-2xl font-bold text-gray-800">
                  {workflows.filter(w => w.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Executions</div>
                <div className="text-2xl font-bold text-green-600">
                  {workflows.reduce((sum, w) => sum + w.totalRuns, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Avg Response</div>
                <div className="text-2xl font-bold text-orange-600">2.8s</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">Automation Workflows</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          {/* Workflows */}
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{workflow.name}</h3>
                      <p className="text-sm text-gray-600">{workflow.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(workflow.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(workflow.status)}
                          {workflow.status}
                        </div>
                      </Badge>
                      <Switch
                        checked={workflow.status === 'active'}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-500">Frequency:</span>
                      <div className="font-medium">{workflow.frequency}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Success Rate:</span>
                      <div className="font-medium text-green-600">{workflow.successRate}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total Runs:</span>
                      <div className="font-medium">{workflow.totalRuns}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Time:</span>
                      <div className="font-medium">{workflow.avgExecutionTime}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Trigger Condition:</div>
                      <div className="bg-gray-100 px-3 py-2 rounded font-mono text-sm">
                        {workflow.trigger.condition}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">Workflow Steps:</div>
                      <div className="space-y-1">
                        {workflow.steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <span>{step}</span>
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

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Execution Time</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Triggered By</TableHead>
                    <TableHead>Output</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.workflowName}</TableCell>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(log.status)}
                            {log.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{log.executionTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(log.stepsCompleted / log.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{log.stepsCompleted}/{log.totalSteps}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.triggeredBy}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{log.output}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'email' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'system' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{notification.title}</h4>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {notification.channels.map((channel, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Automation Performance Analytics</h3>
              <p className="text-gray-600 mb-6">
                Detailed insights, trends, dan optimization recommendations untuk workflows
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationEngine;