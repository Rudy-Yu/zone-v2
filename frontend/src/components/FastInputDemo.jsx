import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { FastInput, FastAutoComplete, BulkPasteHandler } from './ui/fast-input';
import { useFastInput, validationSchemas, formUtils } from '../hooks/useFastInput';

// Schema untuk demo
const demoSchema = z.object({
  customer: z.string().min(1, 'Customer wajib dipilih'),
  product: z.string().min(1, 'Product wajib dipilih'),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  price: z.number().min(0, 'Price tidak boleh negatif'),
  notes: z.string().optional()
});

const FastInputDemo = () => {
  const [showBulkInput, setShowBulkInput] = useState(false);
  const { handleAutoFill } = useFastInput();

  // Form setup
  const form = useForm({
    resolver: zodResolver(demoSchema),
    defaultValues: {
      customer: '',
      product: '',
      quantity: 1,
      price: 0,
      notes: ''
    }
  });

  // Field order untuk navigasi keyboard
  const fieldOrder = ['customer', 'product', 'quantity', 'price', 'notes'];

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form data:', data);
    alert('Data berhasil disimpan!');
    form.reset();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const currentField = e.target.name;
      const currentIndex = fieldOrder.indexOf(currentField);
      
      if (currentIndex < fieldOrder.length - 1) {
        const nextField = document.querySelector(`[name="${fieldOrder[currentIndex + 1]}"]`);
        if (nextField) {
          nextField.focus();
        }
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  // Handle auto-fill ketika customer dipilih
  const handleCustomerSelect = (customer) => {
    console.log('Customer selected:', customer);
    // Auto-fill bisa dilakukan di sini jika ada field yang perlu diisi otomatis
  };

  // Handle auto-fill ketika product dipilih
  const handleProductSelect = (product) => {
    console.log('Product selected:', product);
    form.setValue('price', product.price);
  };

  // Handle bulk data import
  const handleBulkData = (data) => {
    console.log('Bulk data:', data);
    alert(`Berhasil mengimpor ${data.length} record!`);
    setShowBulkInput(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Fast Input Demo</h1>
          <p className="text-gray-600">Demo fitur input cepat dengan autocomplete, auto-fill, dan keyboard shortcuts</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowBulkInput(true)}
          >
            Bulk Import
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Navigasi Form:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - Pindah ke field berikutnya</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> - Pindah ke field berikutnya atau submit</li>
                <li><kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Enter</kbd> - Submit form</li>
              </ul>
            </div>
            <div>
              <strong>Input Features:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Auto-complete dengan pencarian real-time</li>
                <li>Auto-fill field terkait</li>
                <li>Input masking untuk phone & currency</li>
                <li>Bulk paste dari Excel</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fast Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Fast Input Form</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Autocomplete */}
                <FastAutoComplete
                  name="customer"
                  label="Customer"
                  placeholder="Pilih atau cari customer..."
                  searchEndpoint="/customers/search"
                  displayField="name"
                  valueField="id"
                  onSelect={handleCustomerSelect}
                />

                {/* Product Autocomplete */}
                <FastAutoComplete
                  name="product"
                  label="Product"
                  placeholder="Pilih atau cari product..."
                  searchEndpoint="/products/search"
                  displayField="name"
                  valueField="id"
                  onSelect={handleProductSelect}
                />

                {/* Quantity Input */}
                <FastInput
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="Jumlah"
                />

                {/* Price Input dengan Currency Masking */}
                <FastInput
                  name="price"
                  label="Price (Rp)"
                  mask="currency"
                  placeholder="0"
                />

                {/* Notes Textarea */}
                <div className="md:col-span-2">
                  <FastInput
                    name="notes"
                    label="Notes"
                    type="textarea"
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  Simpan Data
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>

      {/* Demo Data */}
      <Card>
        <CardHeader>
          <CardTitle>Demo Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Customer Data (untuk autocomplete):</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                CUST-001: PT. ABC Indonesia<br/>
                CUST-002: CV. XYZ Trading<br/>
                CUST-003: Toko Maju Jaya<br/>
                CUST-004: PT. DEF Corp
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Product Data (untuk autocomplete):</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                PROD-001: Product A (Rp 100.000)<br/>
                PROD-002: Product B (Rp 200.000)<br/>
                PROD-003: Product C (Rp 300.000)
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Bulk Import Format:</h4>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                Customer ID | Product ID | Quantity | Price | Notes<br/>
                CUST-001 | PROD-001 | 5 | 100000 | Order pertama<br/>
                CUST-002 | PROD-002 | 3 | 200000 | Order kedua
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import Modal */}
      {showBulkInput && (
        <BulkPasteHandler
          onBulkData={handleBulkData}
          fields={[
            { name: 'customer' },
            { name: 'product' },
            { name: 'quantity' },
            { name: 'price' },
            { name: 'notes' }
          ]}
        />
      )}
    </div>
  );
};

export default FastInputDemo;
