import React, { useState } from 'react';
import { Plus, Save, Trash2, Play, Server, FileCode, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

const ApiBuilder = () => {
  const [endpoints, setEndpoints] = useState([
    { id: 'get-products', method: 'GET', path: '/api/products', name: 'Get Products', description: 'List products', enabled: true },
  ]);
  const [selected, setSelected] = useState(endpoints[0]);
  const [testResult, setTestResult] = useState(null);

  const addEndpoint = () => {
    const ep = {
      id: `ep_${Date.now()}`,
      method: 'GET',
      path: '/api/new-endpoint',
      name: 'New Endpoint',
      description: '',
      enabled: true,
      requestSchema: '{\n  "type": "object",\n  "properties": {}\n}',
      responseSchema: '{\n  "type": "object",\n  "properties": {}\n}'
    };
    setEndpoints(prev => [...prev, ep]);
    setSelected(ep);
  };

  const updateSelected = (changes) => {
    if (!selected) return;
    const updated = { ...selected, ...changes };
    setSelected(updated);
    setEndpoints(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteSelected = () => {
    if (!selected) return;
    setEndpoints(prev => prev.filter(e => e.id !== selected.id));
    setSelected(null);
  };

  const runTest = async () => {
    if (!selected) return;
    try {
      const url = selected.path.startsWith('http') ? selected.path : `${window.location.origin}${selected.path}`;
      const res = await fetch(url, { method: selected.method });
      const text = await res.text();
      setTestResult({ status: res.status, ok: res.ok, body: text });
    } catch (err) {
      setTestResult({ status: 'ERR', ok: false, body: String(err) });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">API Builder</h1>
          <p className="text-gray-600">Rancang endpoint, kelola schema, dan uji request secara cepat</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addEndpoint}>
            <Plus className="h-4 w-4 mr-2" />
            New Endpoint
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-6">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="tester">Tester</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Endpoint List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Method</TableHead>
                      <TableHead>Path</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {endpoints.map((ep) => (
                      <TableRow key={ep.id} className="cursor-pointer" onClick={() => setSelected(ep)}>
                        <TableCell>{ep.method}</TableCell>
                        <TableCell className="font-medium">{ep.path}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Endpoint Detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selected ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nama</Label>
                        <Input value={selected.name || ''} onChange={(e) => updateSelected({ name: e.target.value })} />
                      </div>
                      <div>
                        <Label>Method</Label>
                        <Select value={selected.method} onValueChange={(v) => updateSelected({ method: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['GET','POST','PUT','PATCH','DELETE'].map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Path</Label>
                        <div className="flex gap-2">
                          <Input value={selected.path} onChange={(e) => updateSelected({ path: e.target.value })} />
                          <Button variant="outline" onClick={() => updateSelected({ enabled: !selected.enabled })}>
                            {selected.enabled ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>Deskripsi</Label>
                        <Textarea rows={3} value={selected.description || ''} onChange={(e) => updateSelected({ description: e.target.value })} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={deleteSelected}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600">Pilih endpoint dari daftar</div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schema Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Request Schema (JSON)</Label>
                    <Textarea rows={16} className="font-mono" value={selected.requestSchema || ''} onChange={(e) => updateSelected({ requestSchema: e.target.value })} />
                  </div>
                  <div>
                    <Label>Response Schema (JSON)</Label>
                    <Textarea rows={16} className="font-mono" value={selected.responseSchema || ''} onChange={(e) => updateSelected({ responseSchema: e.target.value })} />
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Pilih endpoint untuk mengedit schema</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tester" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Tester</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selected ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Method</Label>
                      <Input value={selected.method} readOnly />
                    </div>
                    <div className="md:col-span-3">
                      <Label>URL</Label>
                      <div className="flex gap-2">
                        <Input value={selected.path} readOnly />
                        <Button variant="outline" onClick={runTest}>
                          <Play className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Result</Label>
                    <div className="border rounded p-3 bg-gray-50">
                      {testResult ? (
                        <pre className="text-sm overflow-auto max-h-64">{JSON.stringify(testResult, null, 2)}</pre>
                      ) : (
                        <span className="text-gray-500">Belum ada hasil</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-600">Pilih endpoint untuk menjalankan test</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiBuilder;


