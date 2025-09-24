import React, { useState } from 'react';
import { Save, RefreshCw, Database, Globe, Mail, Bell, Shield, Palette, Download, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'ZONE v.2',
      companyAddress: 'Jl. Industri No. 123, Jakarta Pusat',
      companyPhone: '+62 21 1234 5678',
      companyEmail: 'info@zone.com',
      companyWebsite: 'www.zone.com',
      taxNumber: '123456789012345',
      currency: 'IDR',
      timezone: 'Asia/Jakarta',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    },
    database: {
      dbHost: 'localhost',
      dbPort: '27017',
      dbName: 'zone_db',
      backupFrequency: 'daily',
      lastBackup: '2024-01-20 02:00:00',
      autoBackup: true,
      backupRetention: '30'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'noreply@zone.com',
      smtpPassword: '********',
      smtpEncryption: 'TLS',
      fromName: 'ZONE System',
      fromEmail: 'noreply@zone.com'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlert: true,
      paymentReminder: true,
      systemMaintenance: true,
      newUserAlert: true,
      orderStatusUpdate: true
    },
    security: {
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxLoginAttempts: '5',
      lockoutDuration: '15',
      twoFactorAuth: false,
      ipWhitelist: '',
      auditLog: true
    },
    appearance: {
      theme: 'light',
      primaryColor: '#ef4444',
      secondaryColor: '#64748b',
      sidebarCollapsed: false,
      showNotifications: true,
      showQuickActions: true,
      defaultPageSize: '25',
      autoRefresh: true,
      refreshInterval: '30'
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // In real implementation, this would save to backend
    console.log('Saving settings:', settings);
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      setHasChanges(true);
    }
  };

  const handleBackupDatabase = () => {
    // In real implementation, this would trigger database backup
    alert('Database backup started. You will be notified when complete.');
  };

  const handleRestoreDatabase = () => {
    // In real implementation, this would open file picker for backup file
    alert('Please select a backup file to restore from.');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
          <p className="text-gray-600">Konfigurasi sistem dan pengaturan aplikasi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSaveSettings}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.general.companyName}
                    onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.general.companyEmail}
                    onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyPhone">Company Phone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.general.companyPhone}
                    onChange={(e) => handleSettingChange('general', 'companyPhone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={settings.general.companyWebsite}
                    onChange={(e) => handleSettingChange('general', 'companyWebsite', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxNumber">Tax Number</Label>
                  <Input
                    id="taxNumber"
                    value={settings.general.taxNumber}
                    onChange={(e) => handleSettingChange('general', 'taxNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="IDR">IDR - Indonesian Rupiah</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Asia/Jakarta">Asia/Jakarta</option>
                    <option value="Asia/Singapore">Asia/Singapore</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    value={settings.general.dateFormat}
                    onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  value={settings.general.companyAddress}
                  onChange={(e) => handleSettingChange('general', 'companyAddress', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Input
                    id="dbHost"
                    value={settings.database.dbHost}
                    onChange={(e) => handleSettingChange('database', 'dbHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Database Port</Label>
                  <Input
                    id="dbPort"
                    value={settings.database.dbPort}
                    onChange={(e) => handleSettingChange('database', 'dbPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input
                    id="dbName"
                    value={settings.database.dbName}
                    onChange={(e) => handleSettingChange('database', 'dbName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    value={settings.database.backupFrequency}
                    onChange={(e) => handleSettingChange('database', 'backupFrequency', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoBackup"
                  checked={settings.database.autoBackup}
                  onChange={(e) => handleSettingChange('database', 'autoBackup', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="autoBackup">Enable Automatic Backup</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                <Input
                  id="backupRetention"
                  type="number"
                  value={settings.database.backupRetention}
                  onChange={(e) => handleSettingChange('database', 'backupRetention', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBackupDatabase} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
                <Button onClick={handleRestoreDatabase} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => handleSettingChange('email', 'smtpPort', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUsername">SMTP Username</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => handleSettingChange('email', 'smtpUsername', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpEncryption">SMTP Encryption</Label>
                  <select
                    id="smtpEncryption"
                    value={settings.email.smtpEncryption}
                    onChange={(e) => handleSettingChange('email', 'smtpEncryption', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="TLS">TLS</option>
                    <option value="SSL">SSL</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={settings.email.fromEmail}
                  onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                  <input
                    type="checkbox"
                    id="lowStockAlert"
                    checked={settings.notifications.lowStockAlert}
                    onChange={(e) => handleSettingChange('notifications', 'lowStockAlert', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="paymentReminder">Payment Reminder</Label>
                  <input
                    type="checkbox"
                    id="paymentReminder"
                    checked={settings.notifications.paymentReminder}
                    onChange={(e) => handleSettingChange('notifications', 'paymentReminder', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="systemMaintenance">System Maintenance</Label>
                  <input
                    type="checkbox"
                    id="systemMaintenance"
                    checked={settings.notifications.systemMaintenance}
                    onChange={(e) => handleSettingChange('notifications', 'systemMaintenance', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="newUserAlert">New User Alert</Label>
                  <input
                    type="checkbox"
                    id="newUserAlert"
                    checked={settings.notifications.newUserAlert}
                    onChange={(e) => handleSettingChange('notifications', 'newUserAlert', e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="orderStatusUpdate">Order Status Update</Label>
                  <input
                    type="checkbox"
                    id="orderStatusUpdate"
                    checked={settings.notifications.orderStatusUpdate}
                    onChange={(e) => handleSettingChange('notifications', 'orderStatusUpdate', e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Password Min Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => handleSettingChange('security', 'passwordMinLength', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => handleSettingChange('security', 'lockoutDuration', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    checked={settings.security.requireSpecialChars}
                    onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="requireSpecialChars">Require Special Characters in Password</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    checked={settings.security.requireNumbers}
                    onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="requireNumbers">Require Numbers in Password</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    checked={settings.security.requireUppercase}
                    onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="requireUppercase">Require Uppercase in Password</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="auditLog"
                    checked={settings.security.auditLog}
                    onChange={(e) => handleSettingChange('security', 'auditLog', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="auditLog">Enable Audit Logging</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label>
                <Input
                  id="ipWhitelist"
                  value={settings.security.ipWhitelist}
                  onChange={(e) => handleSettingChange('security', 'ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    value={settings.appearance.theme}
                    onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.appearance.primaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.appearance.secondaryColor}
                    onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultPageSize">Default Page Size</Label>
                  <select
                    id="defaultPageSize"
                    value={settings.appearance.defaultPageSize}
                    onChange={(e) => handleSettingChange('appearance', 'defaultPageSize', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Auto Refresh Interval (seconds)</Label>
                  <Input
                    id="refreshInterval"
                    type="number"
                    value={settings.appearance.refreshInterval}
                    onChange={(e) => handleSettingChange('appearance', 'refreshInterval', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sidebarCollapsed"
                    checked={settings.appearance.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('appearance', 'sidebarCollapsed', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="sidebarCollapsed">Collapse Sidebar by Default</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showNotifications"
                    checked={settings.appearance.showNotifications}
                    onChange={(e) => handleSettingChange('appearance', 'showNotifications', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="showNotifications">Show Notification Badge</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showQuickActions"
                    checked={settings.appearance.showQuickActions}
                    onChange={(e) => handleSettingChange('appearance', 'showQuickActions', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="showQuickActions">Show Quick Actions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={settings.appearance.autoRefresh}
                    onChange={(e) => handleSettingChange('appearance', 'autoRefresh', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="autoRefresh">Enable Auto Refresh</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Status */}
      {hasChanges && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span>You have unsaved changes. Don't forget to save your settings.</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;



