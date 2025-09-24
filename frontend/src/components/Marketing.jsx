import React, { useState } from 'react';
import { Target, TrendingUp, Users, Mail, Phone, Calendar, Star, Plus, Settings, Bot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Marketing = () => {
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);
  const [automations, setAutomations] = useState([
    {
      id: 'AUTO-001',
      name: 'Welcome Email Series',
      type: 'Email',
      trigger: 'New Lead',
      status: 'Active',
      leads: 150,
      conversions: 25
    },
    {
      id: 'AUTO-002',
      name: 'Follow-up Sequence',
      type: 'Email',
      trigger: 'No Response',
      status: 'Active',
      leads: 89,
      conversions: 12
    }
  ]);

  const [newAutomation, setNewAutomation] = useState({
    name: '',
    type: '',
    trigger: '',
    action: '',
    conditions: '',
    schedule: '',
    status: 'Active'
  });

  const automationTypes = [
    'Email',
    'SMS',
    'Social Media',
    'Webhook',
    'Task Assignment'
  ];

  const triggers = [
    'New Lead',
    'Lead Score Change',
    'No Response',
    'Website Visit',
    'Email Open',
    'Form Submission',
    'Purchase',
    'Date Based'
  ];

  const actions = [
    'Send Email',
    'Send SMS',
    'Add to Campaign',
    'Assign to Sales Rep',
    'Update Lead Score',
    'Create Task',
    'Send Webhook',
    'Add Tag'
  ];

  const handleCreateAutomation = () => {
    const automation = {
      id: `AUTO-${String(automations.length + 1).padStart(3, '0')}`,
      ...newAutomation,
      leads: 0,
      conversions: 0
    };
    
    setAutomations([...automations, automation]);
    setNewAutomation({
      name: '',
      type: '',
      trigger: '',
      action: '',
      conditions: '',
      schedule: '',
      status: 'Active'
    });
    setIsAutomationOpen(false);
  };

  const campaigns = [
    {
      id: 'CAMP-001',
      name: 'Promo Akhir Tahun 2024',
      type: 'Email Marketing',
      budget: 'Rp 25.000.000',
      spent: 'Rp 18.500.000',
      leads: 450,
      conversions: 67,
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: 'CAMP-002',
      name: 'Social Media Boost',
      type: 'Social Media',
      budget: 'Rp 15.000.000',
      spent: 'Rp 12.300.000',
      leads: 320,
      conversions: 45,
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2024-02-15'
    },
    {
      id: 'CAMP-003',
      name: 'Google Ads Campaign',
      type: 'PPC',
      budget: 'Rp 30.000.000',
      spent: 'Rp 28.900.000',
      leads: 580,
      conversions: 89,
      status: 'Completed',
      startDate: '2023-12-01',
      endDate: '2023-12-31'
    }
  ];

  const leads = [
    {
      id: 'LEAD-001',
      name: 'John Doe',
      company: 'PT. Teknologi Maju',
      email: 'john@tekno.com',
      phone: '+62812345678',
      source: 'Website',
      score: 85,
      status: 'Hot',
      lastContact: '2024-01-20'
    },
    {
      id: 'LEAD-002',
      name: 'Jane Smith',
      company: 'CV. Digital Solutions',
      email: 'jane@digital.com',
      phone: '+62898765432',
      source: 'Social Media',
      score: 72,
      status: 'Warm',
      lastContact: '2024-01-19'
    },
    {
      id: 'LEAD-003',
      name: 'Bob Wilson',
      company: 'Toko Online ABC',
      email: 'bob@abc.com',
      phone: '+62856789123',
      source: 'Google Ads',
      score: 45,
      status: 'Cold',
      lastContact: '2024-01-18'
    }
  ];

  const marketingMetrics = {
    totalLeads: 1350,
    qualifiedLeads: 540,
    conversions: 201,
    conversionRate: 14.9,
    cac: 285000, // Customer Acquisition Cost
    ltv: 2850000, // Lifetime Value
    roas: 4.2 // Return on Ad Spend
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-yellow-100 text-yellow-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Marketing & CRM</h1>
          <p className="text-gray-600">Kelola campaign marketing dan hubungan pelanggan</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
          <Target className="h-4 w-4 mr-2" />
          Buat Campaign Baru
        </Button>
      </div>

      {/* Marketing KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Leads</div>
                <div className="text-2xl font-bold text-gray-800">
                  {marketingMetrics.totalLeads.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
                <div className="text-2xl font-bold text-green-600">
                  {marketingMetrics.conversionRate}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">CAC</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency(marketingMetrics.cac)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">ROAS</div>
                <div className="text-2xl font-bold text-orange-600">
                  {marketingMetrics.roas}x
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">Campaign</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Period</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-600">{campaign.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>{campaign.budget}</TableCell>
                      <TableCell>{campaign.spent}</TableCell>
                      <TableCell>{campaign.leads}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.conversions}</div>
                          <div className="text-sm text-gray-600">
                            {((campaign.conversions / campaign.leads) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{campaign.startDate}</div>
                          <div className="text-gray-600">to {campaign.endDate}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-gray-600">{lead.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{lead.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLeadStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.lastContact}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span>Website Visitors</span>
                    <span className="font-bold">10,500</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span>Leads Generated</span>
                    <span className="font-bold">1,350</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <span>Qualified Leads</span>
                    <span className="font-bold">540</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span>Opportunities</span>
                    <span className="font-bold">245</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <span>Customers</span>
                    <span className="font-bold">201</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-around bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-blue-500 w-12 h-32 rounded-t"></div>
                    <span className="text-xs">Email</span>
                    <span className="text-xs font-bold">450</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-green-500 w-12 h-24 rounded-t"></div>
                    <span className="text-xs">Social</span>
                    <span className="text-xs font-bold">320</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-purple-500 w-12 h-40 rounded-t"></div>
                    <span className="text-xs">PPC</span>
                    <span className="text-xs font-bold">580</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
              <CardTitle>Marketing Automation</CardTitle>
                <Dialog open={isAutomationOpen} onOpenChange={setIsAutomationOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                      <Bot className="h-4 w-4 mr-2" />
                      Create Automation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Marketing Automation</DialogTitle>
                      <DialogDescription>
                        Setup automated marketing workflows to nurture leads and customers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Automation Name</Label>
                        <Input
                          id="name"
                          value={newAutomation.name}
                          onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                          placeholder="Enter automation name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={newAutomation.type} onValueChange={(value) => setNewAutomation({...newAutomation, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {automationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trigger">Trigger</Label>
                        <Select value={newAutomation.trigger} onValueChange={(value) => setNewAutomation({...newAutomation, trigger: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            {triggers.map((trigger) => (
                              <SelectItem key={trigger} value={trigger}>
                                {trigger}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="action">Action</Label>
                        <Select value={newAutomation.action} onValueChange={(value) => setNewAutomation({...newAutomation, action: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            {actions.map((action) => (
                              <SelectItem key={action} value={action}>
                                {action}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule</Label>
                        <Select value={newAutomation.schedule} onValueChange={(value) => setNewAutomation({...newAutomation, schedule: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Immediate">Immediate</SelectItem>
                            <SelectItem value="After 1 hour">After 1 hour</SelectItem>
                            <SelectItem value="After 1 day">After 1 day</SelectItem>
                            <SelectItem value="After 1 week">After 1 week</SelectItem>
                            <SelectItem value="Custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={newAutomation.status} onValueChange={(value) => setNewAutomation({...newAutomation, status: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="conditions">Conditions</Label>
                        <Textarea
                          id="conditions"
                          value={newAutomation.conditions}
                          onChange={(e) => setNewAutomation({...newAutomation, conditions: e.target.value})}
                          placeholder="Enter automation conditions"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAutomationOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateAutomation} className="bg-red-500 hover:bg-red-600 text-white">
                        Create Automation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{automation.name}</div>
                          <div className="text-sm text-gray-600">{automation.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>{automation.type}</TableCell>
                      <TableCell>{automation.trigger}</TableCell>
                      <TableCell>{automation.action}</TableCell>
                      <TableCell>{automation.leads}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{automation.conversions}</div>
                          <div className="text-sm text-gray-600">
                            {automation.leads > 0 ? ((automation.conversions / automation.leads) * 100).toFixed(1) : 0}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(automation.status)}>
                          {automation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Bot className="h-4 w-4" />
              </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;