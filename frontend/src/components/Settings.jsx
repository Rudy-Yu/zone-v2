import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Database, Globe, Mail, Bell, Shield, Palette, Download, Upload, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const API_URL = `${BACKEND_URL}/api`;

  const [settings, setSettings] = useState({
    general: {
      company_name: 'ZONE v.2',
      company_address: 'Jl. Industri No. 123, Jakarta Pusat',
      company_phone: '+62 21 1234 5678',
      company_email: 'info@zone.com',
      company_website: 'www.zone.com',
      tax_number: '123456789012345',
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      date_format: 'DD/MM/YYYY',
      time_format: '24h'
    },
    database: {
      db_host: 'localhost',
      db_port: '27017',
      db_name: 'zone_db',
      backup_frequency: 'daily',
      last_backup: '2024-01-20 02:00:00',
      auto_backup: true,
      backup_retention: '30'
    },
    email: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: '587',
      smtp_username: 'noreply@zone.com',
      smtp_password: '********',
      smtp_encryption: 'TLS',
      from_name: 'ZONE System',
      from_email: 'noreply@zone.com'
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      low_stock_alert: true,
      payment_reminder: true,
      order_status_update: true,
      system_maintenance: true
    },
    security: {
      password_policy: 'strong',
      session_timeout: '30',
      two_factor_auth: false,
      ip_whitelist: '',
      login_attempts: '5',
      account_lockout: '15'
    },
    appearance: {
      theme: 'light',
      primary_color: '#3B82F6',
      sidebar_collapsed: false,
      language: 'id',
      font_size: 'medium'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/settings`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
      // Keep default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      alert('Settings saved successfully!');
      setError(null);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to default? This action cannot be undone.')) {
      fetchSettings();
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat pengaturan...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pengaturan</h1>
          <p className="text-gray-600">
            Kelola konfigurasi sistem
            {error && (
              <span className="ml-2 text-orange-600 text-sm">(Menggunakan data offline)</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={saving} className="bg-red-500 hover:bg-red-600 text-white">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Informasi Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Nama Perusahaan</Label>
                  <Input
                    id="company_name"
                    value={settings.general.company_name}
                    onChange={(e) => handleSettingChange('general', 'company_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_phone">Telepon</Label>
                  <Input
                    id="company_phone"
                    value={settings.general.company_phone}
                    onChange={(e) => handleSettingChange('general', 'company_phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_email">Email</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={settings.general.company_email}
                    onChange={(e) => handleSettingChange('general', 'company_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_website">Website</Label>
                  <Input
                    id="company_website"
                    value={settings.general.company_website}
                    onChange={(e) => handleSettingChange('general', 'company_website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_number">NPWP</Label>
                  <Input
                    id="tax_number"
                    value={settings.general.tax_number}
                    onChange={(e) => handleSettingChange('general', 'tax_number', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Input
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_address">Alamat</Label>
                <Input
                  id="company_address"
                  value={settings.general.company_address}
                  onChange={(e) => handleSettingChange('general', 'company_address', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db_host">Host</Label>
                  <Input
                    id="db_host"
                    value={settings.database.db_host}
                    onChange={(e) => handleSettingChange('database', 'db_host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_port">Port</Label>
                  <Input
                    id="db_port"
                    value={settings.database.db_port}
                    onChange={(e) => handleSettingChange('database', 'db_port', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_name">Database Name</Label>
                  <Input
                    id="db_name"
                    value={settings.database.db_name}
                    onChange={(e) => handleSettingChange('database', 'db_name', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_backup">Auto Backup</Label>
                  <p className="text-sm text-gray-500">Enable automatic database backup</p>
                </div>
                <Switch
                  id="auto_backup"
                  checked={settings.database.auto_backup}
                  onCheckedChange={(checked) => handleSettingChange('database', 'auto_backup', checked)}
                />
              </div>
              <div className="text-sm text-gray-600">
                Last backup: {settings.database.last_backup}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={settings.email.smtp_host}
                    onChange={(e) => handleSettingChange('email', 'smtp_host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    value={settings.email.smtp_port}
                    onChange={(e) => handleSettingChange('email', 'smtp_port', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_username">Username</Label>
                  <Input
                    id="smtp_username"
                    value={settings.email.smtp_username}
                    onChange={(e) => handleSettingChange('email', 'smtp_username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_password">Password</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={settings.email.smtp_password}
                    onChange={(e) => handleSettingChange('email', 'smtp_password', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                    </div>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => handleSettingChange('notifications', key, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password_policy">Password Policy</Label>
                  <Input
                    id="password_policy"
                    value={settings.security.password_policy}
                    onChange={(e) => handleSettingChange('security', 'password_policy', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={settings.security.session_timeout}
                    onChange={(e) => handleSettingChange('security', 'session_timeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login_attempts">Max Login Attempts</Label>
                  <Input
                    id="login_attempts"
                    type="number"
                    value={settings.security.login_attempts}
                    onChange={(e) => handleSettingChange('security', 'login_attempts', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_lockout">Account Lockout (minutes)</Label>
                  <Input
                    id="account_lockout"
                    type="number"
                    value={settings.security.account_lockout}
                    onChange={(e) => handleSettingChange('security', 'account_lockout', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two_factor_auth">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Enable 2FA for enhanced security</p>
                </div>
                <Switch
                  id="two_factor_auth"
                  checked={settings.security.two_factor_auth}
                  onCheckedChange={(checked) => handleSettingChange('security', 'two_factor_auth', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Input
                    id="theme"
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.appearance.primary_color}
                    onChange={(e) => handleSettingChange('appearance', 'primary_color', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    value={settings.appearance.language}
                    onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="font_size">Font Size</Label>
                  <Input
                    id="font_size"
                    value={settings.appearance.font_size}
                    onChange={(e) => handleSettingChange('appearance', 'font_size', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sidebar_collapsed">Collapsed Sidebar</Label>
                  <p className="text-sm text-gray-500">Start with sidebar collapsed</p>
                </div>
                <Switch
                  id="sidebar_collapsed"
                  checked={settings.appearance.sidebar_collapsed}
                  onCheckedChange={(checked) => handleSettingChange('appearance', 'sidebar_collapsed', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;