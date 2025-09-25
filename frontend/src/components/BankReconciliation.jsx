import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Label } from './ui/label';

const BankReconciliation = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bank Reconciliation</h1>
          <p className="text-gray-600">Cocokkan transaksi bank dengan buku kas perusahaan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekening & Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Akun Bank</Label>
              <Input placeholder="BCA - 1234567890" />
            </div>
            <div>
              <Label>Periode Mulai</Label>
              <Input type="date" />
            </div>
            <div>
              <Label>Periode Akhir</Label>
              <Input type="date" />
            </div>
          </div>
          <div className="mt-4">
            <Button className="bg-red-500 hover:bg-red-600 text-white">Muat Transaksi</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pencocokan Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>GL</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2025-01-05</TableCell>
                <TableCell>Setoran</TableCell>
                <TableCell>+ 5.000.000</TableCell>
                <TableCell>+ 5.000.000</TableCell>
                <TableCell className="text-green-600">Matched</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2025-01-06</TableCell>
                <TableCell>Biaya Admin</TableCell>
                <TableCell>- 50.000</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-yellow-600">Unmatched</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankReconciliation;


