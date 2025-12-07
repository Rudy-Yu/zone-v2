import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Factory, Calendar, Package, Users, Clock, CheckCircle, Settings } from 'lucide-react';
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

const Manufacturing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [manufacturingData, setManufacturingData] = useState({
    overview: {
      totalOrders: 0,
      completedOrders: 0,
      inProgressOrders: 0,
      efficiency: 0,
      totalWorkstations: 0,
      activeWorkstations: 0
    },
    workstations: [],
    schedules: [],
    quality: {
      totalInspections: 0,
      passedInspections: 0,
      failedInspections: 0,
      qualityRate: 0
    }
  });

  useEffect(() => {
    fetchManufacturingData();
  }, []);

  const fetchManufacturingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/manufacturing`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setManufacturingData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching manufacturing data:', err);
      setError(err.message);
      setManufacturingData({
        overview: {
          totalOrders: 45,
          completedOrders: 32,
          inProgressOrders: 13,
          efficiency: 85.2,
          totalWorkstations: 8,
          activeWorkstations: 6
        },
        workstations: [
          {
            id: 'WS-001',
            name: 'Assembly Line A',
            status: 'Active',
            currentOrder: 'PO-2024-001',
            efficiency: 90.5,
            workers: 5,
            capacity: 100
          },
          {
            id: 'WS-002',
            name: 'Assembly Line B',
            status: 'Active',
            currentOrder: 'PO-2024-002',
            efficiency: 82.3,
            workers: 4,
            capacity: 80
          }
        ],
        schedules: [
          {
            id: 'SCH-001',
            workstation: 'Assembly Line A',
            order: 'PO-2024-001',
            startTime: '08:00',
            endTime: '16:00',
            status: 'In Progress'
          }
        ],
        quality: {
          totalInspections: 150,
          passedInspections: 142,
          failedInspections: 8,
          qualityRate: 94.7
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
            <p className="text-gray-600">Memuat data manufacturing...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Manufacturing</h1>
          <p className="text-gray-600">
            Kelola produksi dan manufacturing
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
              <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
              </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Order
                </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Orders</div>
                <div className="text-2xl font-bold text-gray-800">{manufacturingData.overview.totalOrders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Completed</div>
                <div className="text-2xl font-bold text-green-600">{manufacturingData.overview.completedOrders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-yellow-600">{manufacturingData.overview.inProgressOrders}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-2xl font-bold text-purple-600">{manufacturingData.overview.efficiency}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Workstations</div>
                <div className="text-2xl font-bold text-orange-600">{manufacturingData.overview.totalWorkstations}</div>
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
                <div className="text-sm text-gray-600">Active</div>
                <div className="text-2xl font-bold text-green-600">{manufacturingData.overview.activeWorkstations}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workstations">Workstations</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Production Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <Badge variant="outline">{manufacturingData.overview.totalOrders}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed</span>
                    <Badge className="bg-green-100 text-green-800">{manufacturingData.overview.completedOrders}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">In Progress</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{manufacturingData.overview.inProgressOrders}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <span className="font-semibold text-green-600">{manufacturingData.overview.efficiency}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Inspections</span>
                    <Badge variant="outline">{manufacturingData.quality.totalInspections}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passed</span>
                    <Badge className="bg-green-100 text-green-800">{manufacturingData.quality.passedInspections}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <Badge className="bg-red-100 text-red-800">{manufacturingData.quality.failedInspections}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality Rate</span>
                    <span className="font-semibold text-green-600">{manufacturingData.quality.qualityRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workstations Tab */}
        <TabsContent value="workstations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workstations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Order</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Workers</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturingData.workstations.map((workstation) => (
                    <TableRow key={workstation.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{workstation.name}</TableCell>
                      <TableCell>
                        <Badge className={workstation.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {workstation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{workstation.currentOrder}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">{workstation.efficiency}%</span>
                      </TableCell>
                      <TableCell>{workstation.workers}</TableCell>
                      <TableCell>{workstation.capacity}</TableCell>
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

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Schedules</CardTitle>
            </CardHeader>
            <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                    <TableHead>Workstation</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  {manufacturingData.schedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{schedule.workstation}</TableCell>
                      <TableCell>{schedule.order}</TableCell>
                      <TableCell>{schedule.startTime}</TableCell>
                      <TableCell>{schedule.endTime}</TableCell>
                      <TableCell>
                        <Badge className={schedule.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                          {schedule.status}
                        </Badge>
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

        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
                <CardTitle>Quality Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Inspections</span>
                    <Badge variant="outline">{manufacturingData.quality.totalInspections}</Badge>
                        </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Passed</span>
                    <Badge className="bg-green-100 text-green-800">{manufacturingData.quality.passedInspections}</Badge>
                      </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <Badge className="bg-red-100 text-red-800">{manufacturingData.quality.failedInspections}</Badge>
                        </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality Rate</span>
                    <span className="font-semibold text-green-600">{manufacturingData.quality.qualityRate}%</span>
                      </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Recent Inspections</CardTitle>
            </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">PO-2024-001</span>
                    <Badge className="bg-green-100 text-green-800">Passed</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">PO-2024-002</span>
                    <Badge className="bg-green-100 text-green-800">Passed</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">PO-2024-003</span>
                    <Badge className="bg-red-100 text-red-800">Failed</Badge>
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

export default Manufacturing;