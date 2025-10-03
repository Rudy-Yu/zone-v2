import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../../lib/utils';
import { Input } from './input';
import { Label } from './label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

// Utility untuk input masking
const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.startsWith('62')) {
    return `+62 ${cleaned.slice(2).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
  }
  if (cleaned.startsWith('0')) {
    return `+62 ${cleaned.slice(1).replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
  }
  return `+62 ${cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')}`;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const parseCurrency = (value) => {
  return parseInt(value.replace(/[^\d]/g, '')) || 0;
};

// Hook untuk keyboard shortcuts
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const shortcut = shortcuts.find(s => 
        s.keys.every(key => e[key]) && 
        s.key === e.key
      );
      
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Komponen AutoComplete dengan pencarian real-time
const FastAutoComplete = ({ 
  name, 
  label, 
  placeholder, 
  searchEndpoint, 
  displayField = 'name', 
  valueField = 'id',
  onSelect,
  className,
  ...props 
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceRef = useRef(null);

  const fieldValue = watch(name);
  const error = errors[name];

  // Debounced search
  const searchData = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api${searchEndpoint}?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : data.items || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [searchEndpoint]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      searchData(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, searchData]);

  const handleSelect = (option) => {
    setValue(name, option[valueField]);
    setSearchTerm(option[displayField]);
    setOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {fieldValue ? (
              options.find((option) => option[valueField] === fieldValue)?.[displayField] || searchTerm
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option[valueField]}
                    value={option[displayField]}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        fieldValue === option[valueField] ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option[displayField]}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

// Komponen input dengan auto-fill
const FastInput = ({ 
  name, 
  label, 
  type = 'text', 
  placeholder, 
  mask,
  autoComplete,
  onAutoFill,
  className,
  ...props 
}) => {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [internalValue, setInternalValue] = useState('');
  const inputRef = useRef(null);

  const fieldValue = watch(name);
  const error = errors[name];

  // Handle input masking
  const handleInputChange = (e) => {
    let value = e.target.value;
    
    if (mask === 'phone') {
      value = formatPhone(value);
    } else if (mask === 'currency') {
      const numericValue = parseCurrency(value);
      setValue(name, numericValue);
      setInternalValue(formatCurrency(numericValue));
      return;
    }
    
    setInternalValue(value);
    setValue(name, value);
  };

  // Handle paste for bulk data
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data looks like tabular data (Excel/CSV)
    if (pastedData.includes('\t') || pastedData.includes(',')) {
      e.preventDefault();
      
      // Parse tabular data
      const rows = pastedData.split('\n').filter(row => row.trim());
      const parsedData = rows.map(row => {
        const cells = row.includes('\t') ? row.split('\t') : row.split(',');
        return cells.map(cell => cell.trim());
      });
      
      // Trigger bulk import handler
      if (window.handleBulkPaste) {
        window.handleBulkPaste(name, parsedData);
      }
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      keys: ['ctrlKey'],
      key: 'Enter',
      action: () => {
        if (inputRef.current) {
          inputRef.current.form?.dispatchEvent(new Event('submit', { bubbles: true }));
        }
      }
    }
  ]);

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...register(name)}
        ref={inputRef}
        id={name}
        type={type}
        placeholder={placeholder}
        value={mask === 'currency' ? internalValue : undefined}
        onChange={handleInputChange}
        onPaste={handlePaste}
        className={cn(error && "border-red-500")}
        autoComplete={autoComplete}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

// Komponen untuk paste massal dari Excel
const BulkPasteHandler = ({ onBulkData, fields }) => {
  const [showBulkInput, setShowBulkInput] = useState(false);
  const [bulkData, setBulkData] = useState('');

  useEffect(() => {
    // Register global bulk paste handler
    window.handleBulkPaste = (fieldName, data) => {
      setShowBulkInput(true);
      setBulkData(data.map(row => row.join('\t')).join('\n'));
    };

    return () => {
      delete window.handleBulkPaste;
    };
  }, []);

  const handleBulkSubmit = () => {
    const rows = bulkData.split('\n').filter(row => row.trim());
    const parsedData = rows.map(row => {
      const cells = row.split('\t');
      const record = {};
      fields.forEach((field, index) => {
        record[field.name] = cells[index] || '';
      });
      return record;
    });

    onBulkData(parsedData);
    setShowBulkInput(false);
    setBulkData('');
  };

  if (!showBulkInput) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Bulk Data Import</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste tabular data from Excel (Ctrl+V). Each row will create a new record.
        </p>
        <textarea
          className="w-full h-64 p-3 border rounded-md font-mono text-sm"
          value={bulkData}
          onChange={(e) => setBulkData(e.target.value)}
          placeholder="Paste your data here..."
        />
        <div className="flex gap-2 mt-4">
          <Button onClick={handleBulkSubmit}>Import Data</Button>
          <Button variant="outline" onClick={() => setShowBulkInput(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook untuk form validation real-time
const useRealTimeValidation = (schema) => {
  const { watch, formState: { errors }, setError, clearErrors } = useFormContext();
  const watchedFields = watch();

  useEffect(() => {
    // Real-time validation using Zod
    const validateField = async (fieldName, value) => {
      try {
        await schema.pick({ [fieldName]: true }).parseAsync({ [fieldName]: value });
        clearErrors(fieldName);
      } catch (error) {
        if (error.errors && error.errors[0]) {
          setError(fieldName, {
            type: 'validation',
            message: error.errors[0].message
          });
        }
      }
    };

    // Debounced validation
    const timeouts = {};
    Object.entries(watchedFields).forEach(([fieldName, value]) => {
      if (timeouts[fieldName]) {
        clearTimeout(timeouts[fieldName]);
      }
      
      timeouts[fieldName] = setTimeout(() => {
        validateField(fieldName, value);
      }, 500);
    });

    return () => {
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, [watchedFields, schema, setError, clearErrors]);
};

export {
  FastInput,
  FastAutoComplete,
  BulkPasteHandler,
  useRealTimeValidation,
  useKeyboardShortcuts,
  formatPhone,
  formatCurrency,
  parseCurrency
};
