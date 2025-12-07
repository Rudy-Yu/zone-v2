import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, TrendingUp, Target, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [marketingData, setMarketingData] = useState({
    overview: {
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
      totalSpent: 0,
      totalRevenue: 0,
      roi: 0
    },
    campaigns: [],
    leads: [],
    analytics: {
      websiteVisits: 0,
      socialMediaReach: 0,
      emailOpens: 0,
      clickThroughRate: 0
    }
  });

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/marketing`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setMarketingData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching marketing data:', err);
      setError(err.message);
      setMarketingData({
        overview: {
          totalCampaigns: 12,
          activeCampaigns: 5,
          totalLeads: 1250,
          convertedLeads: 187,
          conversionRate: 15.0,
          totalSpent: 25000000,
          totalRevenue: 450000000,
          roi: 1800.0
        },
        campaigns: [
    {
      id: 'CAMP-001',
            name: 'Summer Sale 2024',
      type: 'Email Marketing',
      status: 'Active',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            budget: 5000000,
            spent: 3200000,
            leads: 250,
            conversions: 45,
            roi: 280.0
    },
    {
      id: 'CAMP-002',
            name: 'Social Media Campaign',
      type: 'Social Media',
      status: 'Active',
            startDate: '2024-01-20',
            endDate: '2024-03-20',
            budget: 8000000,
            spent: 4500000,
            leads: 400,
            conversions: 60,
            roi: 220.0
          }
        ],
        leads: [
    {
      id: 'LEAD-001',
      name: 'John Doe',
            email: 'john@example.com',
            phone: '+62 21 1234 5678',
      source: 'Website',
            status: 'Qualified',
            campaign: 'Summer Sale 2024',
            created_at: '2024-01-20 10:30:00'
    },
    {
      id: 'LEAD-002',
      name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+62 21 1234 5679',
      source: 'Social Media',
            status: 'New',
            campaign: 'Social Media Campaign',
            created_at: '2024-01-19 15:45:00'
          }
        ],
        analytics: {
          websiteVisits: 15420,
          socialMediaReach: 25000,
          emailOpens: 8500,
          clickThroughRate: 12.5
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data marketing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Marketing</h1>
          <p className="text-gray-600">
            Kelola kampanye dan analisis marketing
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
        </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
                <div className="text-2xl font-bold text-gray-800">{marketingData.overview.totalCampaigns}</div>
                <div className="text-xs text-green-600">
                  {marketingData.overview.activeCampaigns} active
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Leads</div>
                <div className="text-2xl font-bold text-gray-800">{marketingData.overview.totalLeads}</div>
                <div className="text-xs text-blue-600">
                  {marketingData.overview.convertedLeads} converted
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Conversion Rate</div>
                <div className="text-2xl font-bold text-purple-600">{marketingData.overview.conversionRate}%</div>
                <div className="text-xs text-gray-600">
                  Lead to customer
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">ROI</div>
                <div className="text-2xl font-bold text-orange-600">{marketingData.overview.roi}%</div>
                <div className="text-xs text-gray-600">
                  Return on investment
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Campaigns</span>
                    <Badge variant="outline">{marketingData.overview.totalCampaigns}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Campaigns</span>
                    <Badge className="bg-green-100 text-green-800">{marketingData.overview.activeCampaigns}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-semibold">Rp {marketingData.overview.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-green-600">Rp {marketingData.overview.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lead Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Leads</span>
                    <Badge variant="outline">{marketingData.overview.totalLeads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Converted Leads</span>
                    <Badge className="bg-green-100 text-green-800">{marketingData.overview.convertedLeads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-green-600">{marketingData.overview.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROI</span>
                    <span className="font-semibold text-orange-600">{marketingData.overview.roi}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingData.campaigns.map((campaign) => (
                    <TableRow key={campaign.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{campaign.type}</TableCell>
                      <TableCell>
                        <Badge className={campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>Rp {campaign.budget.toLocaleString()}</TableCell>
                      <TableCell>Rp {campaign.spent.toLocaleString()}</TableCell>
                      <TableCell>{campaign.leads}</TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{campaign.roi}%</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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

        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marketingData.leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <Badge className={lead.status === 'Qualified' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.campaign}</TableCell>
                      <TableCell className="text-sm text-gray-500">{lead.created_at}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Website Visits</span>
                    <Badge variant="outline">{marketingData.analytics.websiteVisits.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Social Media Reach</span>
                    <Badge variant="outline">{marketingData.analytics.socialMediaReach.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Opens</span>
                    <Badge variant="outline">{marketingData.analytics.emailOpens.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Click Through Rate</span>
                    <span className="font-semibold text-blue-600">{marketingData.analytics.clickThroughRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Per Lead</span>
                    <span className="font-semibold">Rp {(marketingData.overview.totalSpent / marketingData.overview.totalLeads).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Per Conversion</span>
                    <span className="font-semibold">Rp {(marketingData.overview.totalSpent / marketingData.overview.convertedLeads).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenue Per Lead</span>
                    <span className="font-semibold text-green-600">Rp {(marketingData.overview.totalRevenue / marketingData.overview.totalLeads).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Profit Margin</span>
                    <span className="font-semibold text-green-600">{(((marketingData.overview.totalRevenue - marketingData.overview.totalSpent) / marketingData.overview.totalRevenue) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;