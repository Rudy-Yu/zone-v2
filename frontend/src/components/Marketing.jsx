import React, { useState } from 'react';
import { Target, TrendingUp, Users, Mail, Phone, Calendar, Star } from 'lucide-react';
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

const Marketing = () => {
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
              <CardTitle>Marketing Automation</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Marketing Automation Workflows
              </h3>
              <p className="text-gray-600 mb-6">
                Setup automated email sequences, lead scoring, dan customer journey automation
              </p>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                Create Automation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;