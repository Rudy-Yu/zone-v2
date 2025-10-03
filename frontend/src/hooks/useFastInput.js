import { useState, useCallback, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';

// Hook untuk mengelola state input cepat
export const useFastInput = (initialData = {}) => {
  const { setValue, getValues, watch } = useFormContext();
  const [autoFillData, setAutoFillData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const debounceRefs = useRef({});

  // Auto-fill field berdasarkan data yang dipilih
  const handleAutoFill = useCallback(async (fieldName, selectedId, endpoint) => {
    if (!selectedId || !endpoint) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api${endpoint}/${selectedId}`);
      if (response.ok) {
        const data = await response.json();
        setAutoFillData(prev => ({ ...prev, [fieldName]: data }));
        
        // Auto-fill related fields
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'id' && value !== null && value !== undefined) {
            setValue(key, value);
          }
        });
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  // Debounced validation
  const validateField = useCallback((fieldName, value, schema) => {
    if (debounceRefs.current[fieldName]) {
      clearTimeout(debounceRefs.current[fieldName]);
    }

    debounceRefs.current[fieldName] = setTimeout(() => {
      try {
        schema.parse({ [fieldName]: value });
        // Field is valid
      } catch (error) {
        console.warn(`Validation error for ${fieldName}:`, error.errors[0]?.message);
      }
    }, 500);
  }, []);

  return {
    autoFillData,
    isLoading,
    handleAutoFill,
    validateField
  };
};

// Hook untuk keyboard shortcuts global
export const useGlobalShortcuts = () => {
  const shortcutHandlers = useRef({});

  const registerShortcut = useCallback((keys, handler, description) => {
    const key = keys.join('+');
    shortcutHandlers.current[key] = { handler, description };
  }, []);

  const unregisterShortcut = useCallback((keys) => {
    const key = keys.join('+');
    delete shortcutHandlers.current[key];
  }, []);

  // Global keyboard listener
  useState(() => {
    const handleKeyDown = (e) => {
      const modifiers = [];
      if (e.ctrlKey) modifiers.push('ctrl');
      if (e.altKey) modifiers.push('alt');
      if (e.shiftKey) modifiers.push('shift');
      
      const key = [...modifiers, e.key.toLowerCase()].join('+');
      const shortcut = shortcutHandlers.current[key];
      
      if (shortcut) {
        e.preventDefault();
        shortcut.handler(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  return { registerShortcut, unregisterShortcut };
};

// Hook untuk bulk data import
export const useBulkImport = () => {
  const [importData, setImportData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  const parseBulkData = useCallback((text, fieldMapping) => {
    const lines = text.split('\n').filter(line => line.trim());
    const parsed = lines.map((line, index) => {
      const values = line.split('\t'); // Tab-separated
      const record = { _row: index + 1 };
      
      fieldMapping.forEach((field, colIndex) => {
        if (values[colIndex] !== undefined) {
          record[field] = values[colIndex].trim();
        }
      });
      
      return record;
    });

    setImportData(parsed);
    return parsed;
  }, []);

  const validateBulkData = useCallback((data, schema) => {
    const errors = [];
    
    data.forEach((record, index) => {
      try {
        schema.parse(record);
      } catch (error) {
        errors.push({
          row: index + 1,
          errors: error.errors
        });
      }
    });

    return errors;
  }, []);

  const importBulkData = useCallback(async (data, endpoint) => {
    setIsImporting(true);
    const results = [];
    
    try {
      for (const record of data) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record)
        });
        
        results.push({
          record,
          success: response.ok,
          data: response.ok ? await response.json() : await response.text()
        });
      }
    } catch (error) {
      console.error('Bulk import error:', error);
    } finally {
      setIsImporting(false);
    }

    return results;
  }, []);

  return {
    importData,
    isImporting,
    parseBulkData,
    validateBulkData,
    importBulkData
  };
};

// Utility functions untuk form enhancement
export const formUtils = {
  // Format nomor telepon Indonesia
  formatPhone: (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('62')) {
      return `+62 ${cleaned.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
    }
    if (cleaned.startsWith('0')) {
      return `+62 ${cleaned.slice(1).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
    }
    return `+62 ${cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
  },

  // Format currency Indonesia
  formatCurrency: (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  },

  // Parse currency dari string
  parseCurrency: (value) => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  },

  // Format tanggal Indonesia
  formatDate: (date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  },

  // Generate ID otomatis
  generateId: (prefix, existingIds = []) => {
    let counter = 1;
    let newId;
    
    do {
      newId = `${prefix}-${String(counter).padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    
    return newId;
  },

  // Focus field berikutnya
  focusNextField: (currentFieldName, fieldOrder) => {
    const currentIndex = fieldOrder.indexOf(currentFieldName);
    if (currentIndex < fieldOrder.length - 1) {
      const nextField = document.querySelector(`[name="${fieldOrder[currentIndex + 1]}"]`);
      if (nextField) {
        nextField.focus();
      }
    }
  }
};

// Schema validasi umum
export const validationSchemas = {
  customer: z.object({
    name: z.string().min(1, 'Nama perusahaan wajib diisi'),
    contactPerson: z.string().min(1, 'Contact person wajib diisi'),
    email: z.string().email('Format email tidak valid'),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    address: z.string().min(1, 'Alamat wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    creditLimit: z.number().min(0, 'Credit limit tidak boleh negatif')
  }),

  product: z.object({
    name: z.string().min(1, 'Nama produk wajib diisi'),
    sku: z.string().min(1, 'SKU wajib diisi'),
    price: z.number().min(0, 'Harga tidak boleh negatif'),
    description: z.string().optional(),
    category: z.string().min(1, 'Kategori wajib diisi'),
    stock: z.number().min(0, 'Stok tidak boleh negatif')
  }),

  vendor: z.object({
    name: z.string().min(1, 'Nama vendor wajib diisi'),
    contact: z.string().email('Format email tidak valid'),
    phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    address: z.string().min(1, 'Alamat wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi')
  })
};
