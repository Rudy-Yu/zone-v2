import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Megaphone, Calendar, Users, TrendingUp, Target, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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

const MarketingCampaign = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  const [campaigns, setCampaigns] = useState([
    {
      id: 'CAMP-001',
      campaignName: 'Summer Sale 2024',
      campaignType: 'Promotional',
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      status: 'Active',
      budget: 50000000,
      spent: 25000000,
      targetAudience: 'All Customers',
      channels: ['Social Media', 'Email', 'Website'],
      metrics: {
        impressions: 125000,
        clicks: 8500,
        conversions: 450,
        leads: 320,
        sales: 280
      },
      roi: 180,
      createdBy: 'John Marketing',
      notes: 'Focus on summer products',
      createdAt: '2024-01-20 10:30:00'
    },
    {
      id: 'CAMP-002',
      campaignName: 'New Product Launch',
      campaignType: 'Product Launch',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      status: 'Completed',
      budget: 30000000,
      spent: 30000000,
      targetAudience: 'Tech Enthusiasts',
      channels: ['YouTube', 'Instagram', 'TikTok'],
      metrics: {
        impressions: 85000,
        clicks: 12000,
        conversions: 650,
        leads: 480,
        sales: 420
      },
      roi: 220,
      createdBy: 'Jane Marketing',
      notes: 'Successful product launch',
      createdAt: '2024-01-15 14:15:00',
      completedDate: '2024-01-30 18:00:00'
    },
    {
      id: 'CAMP-003',
      campaignName: 'Brand Awareness Q1',
      campaignType: 'Brand Awareness',
      startDate: '2024-01-10',
      endDate: '2024-03-31',
      status: 'Active',
      budget: 75000000,
      spent: 35000000,
      targetAudience: 'General Public',
      channels: ['TV', 'Radio', 'Billboard', 'Online Ads'],
      metrics: {
        impressions: 500000,
        clicks: 15000,
        conversions: 800,
        leads: 600,
        sales: 450
      },
      roi: 150,
      createdBy: 'Bob Marketing',
      notes: 'Long-term brand building',
      createdAt: '2024-01-10 09:45:00'
    },
    {
      id: 'CAMP-004',
      campaignName: 'Loyalty Program',
      campaignType: 'Retention',
      startDate: '2024-01-05',
      endDate: '2024-12-31',
      status: 'Draft',
      budget: 100000000,
      spent: 0,
      targetAudience: 'Existing Customers',
      channels: ['Email', 'SMS', 'App Push'],
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        leads: 0,
        sales: 0
      },
      roi: 0,
      createdBy: 'Alice Marketing',
      notes: 'Customer retention strategy',
      createdAt: '2024-01-05 16:20:00'
    }
  ]);

  const [newCampaign, setNewCampaign] = useState({
    campaignName: '',
    campaignType: 'Promotional',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: 0,
    targetAudience: '',
    channels: [],
    notes: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-purple-100 text-purple-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Promotional': return 'bg-blue-100 text-blue-800';
      case 'Product Launch': return 'bg-green-100 text-green-800';
      case 'Brand Awareness': return 'bg-purple-100 text-purple-800';
      case 'Retention': return 'bg-orange-100 text-orange-800';
      case 'Lead Generation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getROIColor = (roi) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 150) return 'text-blue-600';
    if (roi >= 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.campaignType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.targetAudience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCampaign = () => {
    const campaign = {
      id: `CAMP-${String(campaigns.length + 1).padStart(3, '0')}`,
      ...newCampaign,
      status: 'Draft',
      spent: 0,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        leads: 0,
        sales: 0
      },
      roi: 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      campaignName: '',
      campaignType: 'Promotional',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: 0,
      targetAudience: '',
      channels: [],
      notes: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setNewCampaign(campaign);
    setIsAddDialogOpen(true);
  };

  const handleUpdateCampaign = () => {
    setCampaigns(campaigns.map(campaign => 
      campaign.id === editingCampaign.id ? { ...campaign, ...newCampaign } : campaign
    ));
    setEditingCampaign(null);
    setIsAddDialogOpen(false);
  };

  const handleDeleteCampaign = (campaignId) => {
    if (confirm('Apakah Anda yakin ingin menghapus campaign ini?')) {
      setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    }
  };

  const updateCampaignStatus = (campaignId, newStatus) => {
    const updatedCampaigns = campaigns.map(campaign => {
      if (campaign.id === campaignId) {
        const updated = { ...campaign, status: newStatus };
        if (newStatus === 'Completed') {
          updated.completedDate = new Date().toISOString();
        }
        return updated;
      }
      return campaign;
    });
    setCampaigns(updatedCampaigns);
  };

  const activateCampaign = (campaignId) => {
    updateCampaignStatus(campaignId, 'Active');
  };

  const pauseCampaign = (campaignId) => {
    updateCampaignStatus(campaignId, 'Paused');
  };

  const completeCampaign = (campaignId) => {
    updateCampaignStatus(campaignId, 'Completed');
  };

  const calculateROI = (spent, sales) => {
    if (spent === 0) return 0;
    return Math.round(((sales - spent) / spent) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Marketing Campaign Management</h1>
          <p className="text-gray-600">Kelola campaign marketing dan tracking performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Buat Campaign Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Marketing Campaign' : 'Buat Campaign Baru'}
              </DialogTitle>
              <DialogDescription>
                {editingCampaign ? 'Update informasi campaign' : 'Masukkan informasi campaign baru'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Nama Campaign *</Label>
                <Input
                  id="campaignName"
                  value={newCampaign.campaignName}
                  onChange={(e) => setNewCampaign({...newCampaign, campaignName: e.target.value})}
                  placeholder="Nama campaign"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaignType">Tipe Campaign *</Label>
                <select
                  id="campaignType"
                  value={newCampaign.campaignType}
                  onChange={(e) => setNewCampaign({...newCampaign, campaignType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Promotional">Promotional</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Retention">Retention</option>
                  <option value="Lead Generation">Lead Generation</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (Rp) *</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({...newCampaign, budget: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  value={newCampaign.targetAudience}
                  onChange={(e) => setNewCampaign({...newCampaign, targetAudience: e.target.value})}
                  placeholder="Target audience"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Catatan</Label>
                <Input
                  id="notes"
                  value={newCampaign.notes}
                  onChange={(e) => setNewCampaign({...newCampaign, notes: e.target.value})}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={editingCampaign ? handleUpdateCampaign : handleAddCampaign}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {editingCampaign ? 'Update Campaign' : 'Buat Campaign'}
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
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
                <div className="text-2xl font-bold text-gray-800">{campaigns.length}</div>
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
                <div className="text-sm text-gray-600">Active</div>
                <div className="text-2xl font-bold text-green-600">
                  {campaigns.filter(c => c.status === 'Active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Budget</div>
                <div className="text-2xl font-bold text-purple-600">
                  Rp {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Conversions</div>
                <div className="text-2xl font-bold text-orange-600">
                  {campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)}
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
              placeholder="Cari campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Marketing Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.campaignName}</div>
                      <div className="text-sm text-gray-500">{campaign.targetAudience}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(campaign.campaignType)}>
                      {campaign.campaignType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{campaign.startDate}</div>
                      <div className="text-gray-500">to {campaign.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {campaign.status === 'Draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => activateCampaign(campaign.id)}
                        >
                          Activate
                        </Button>
                      )}
                      {campaign.status === 'Active' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pauseCampaign(campaign.id)}
                        >
                          Pause
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>Rp {campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Rp {campaign.spent.toLocaleString()}</div>
                      <div className="text-gray-500">
                        {Math.round((campaign.spent / campaign.budget) * 100)}% used
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-semibold ${getROIColor(campaign.roi)}`}>
                      {campaign.roi}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <div>Impressions: {campaign.metrics.impressions.toLocaleString()}</div>
                      <div>Clicks: {campaign.metrics.clicks.toLocaleString()}</div>
                      <div>Conversions: {campaign.metrics.conversions}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingCampaign;


