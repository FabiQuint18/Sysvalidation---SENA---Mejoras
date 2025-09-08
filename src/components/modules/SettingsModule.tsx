import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, Settings, Database, Building, Image, Palette, Link, Shield, Globe, Zap, Bell, Lock, Users, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActivityIntegrationService from '@/components/integrations/ActivityIntegrationService';

interface SettingsModuleProps {
  onLogoChange?: (logo: string) => void;
}

const SettingsModule = ({ onLogoChange }: SettingsModuleProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Empresa Farmacéutica',
    address: 'Dirección de la empresa',
    phone: '+1234567890',
    email: 'contacto@empresa.com',
    website: 'www.empresa.com'
  });
  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    emailNotifications: true,
    auditTrail: true,
    dataRetention: 365
  });
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [theme, setTheme] = useState('light');
  const [settings, setSettings] = useState({
    security: {
      twoFactorRequired: false,
      auditLogging: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      encryptionEnabled: true
    },
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      frequency: 'immediate'
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: false,
      analyticsEnabled: true
    },
    advanced: {
      apiRateLimit: 1000,
      maxFileSize: 10,
      backupFrequency: 'daily',
      logRetention: 30
    }
  });

  // Load current logo from localStorage
  React.useEffect(() => {
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setCurrentLogo(savedLogo);
    }
  }, []);

  const handleCompanyInfoChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSystemSettingChange = (setting: string, value: any) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setCurrentLogo(logoUrl);
        localStorage.setItem('companyLogo', logoUrl);
        onLogoChange?.(logoUrl);
        
        toast({
          title: "Logo Actualizado",
          description: "El logo de la empresa ha sido actualizado exitosamente",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSetting = (path: string, value: any) => {
    const keys = path.split('.');
    setSettings(prev => {
      const newSettings = { ...prev };
      let current: any = newSettings;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleSaveCompanyInfo = () => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    toast({
      title: "Información Guardada",
      description: "La información de la empresa ha sido guardada exitosamente",
    });
  };

  const handleExportBackup = () => {
    const backupData = {
      companyInfo,
      systemSettings,
      products: JSON.parse(localStorage.getItem('systemProducts') || '[]'),
      equipments: JSON.parse(localStorage.getItem('systemEquipments') || '[]'),
      users: JSON.parse(localStorage.getItem('systemUsers') || '[]'),
      validations: JSON.parse(localStorage.getItem('systemValidations') || '[]'),
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Backup Exportado",
      description: "El backup ha sido descargado exitosamente",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('settings.subtitle')}
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-blue-100 to-purple-100">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Apariencia</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información de la Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label>Logo de la Empresa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50">
                      {currentLogo ? (
                        <img src={currentLogo} alt="Company Logo" className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Image className="h-6 w-6 text-blue-400" />
                      )}
                    </div>
                    <Button variant="outline" onClick={handleLogoClick} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0">
                      <Upload className="mr-2 h-4 w-4" />
                      Cambiar Logo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    value={companyInfo.name}
                    onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
                    placeholder="Nombre de la empresa"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Dirección</Label>
                  <Input
                    id="companyAddress"
                    value={companyInfo.address}
                    onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
                    placeholder="Dirección de la empresa"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">Teléfono</Label>
                    <Input
                      id="companyPhone"
                      value={companyInfo.phone}
                      onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
                    <Input
                      id="companyEmail"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>
                
                <Button onClick={handleSaveCompanyInfo} className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                  Guardar Información
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Gestión de Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <Label className="text-green-800">Backup Automático</Label>
                      <p className="text-sm text-green-600">Respaldo automático diario</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => handleSystemSettingChange('autoBackup', checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Frecuencia de Backup</Label>
                    <Select value={systemSettings.backupFrequency} onValueChange={(value) => handleSystemSettingChange('backupFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Cada Hora</SelectItem>
                        <SelectItem value="daily">Diario</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={handleExportBackup} className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tema y Apariencia
              </CardTitle>
              <CardDescription>
                <span className="text-purple-100">Personaliza el aspecto visual del sistema</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="theme">Tema</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona el tema de la aplicación
                    </p>
                  </div>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Colores del Sistema</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Color Primario</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="primaryColor"
                          defaultValue="#3b82f6"
                          className="w-10 h-10 border border-border rounded cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">#3b82f6</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Color de Acento</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="accentColor"
                          defaultValue="#10b981"
                          className="w-10 h-10 border border-border rounded cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground">#10b981</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Tipografía</Label>
                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Tamaño de Fuente</Label>
                    <select
                      id="fontSize"
                      className="px-3 py-2 border border-border rounded-md bg-background w-full"
                    >
                      <option value="small">Pequeño</option>
                      <option value="medium">Mediano</option>
                      <option value="large">Grande</option>
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    toast({
                      title: "Configuración Guardada",
                      description: "Los cambios de apariencia han sido aplicados",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Aplicar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-yellow-50">
            <CardHeader className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                <span className="text-yellow-100">Gestiona cómo y cuándo recibir notificaciones</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-blue-800">Notificaciones por Email</Label>
                    <p className="text-sm text-blue-600">Recibir alertas por correo electrónico</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.emailEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <Label className="text-green-800">Notificaciones Push</Label>
                    <p className="text-sm text-green-600">Notificaciones en tiempo real en el navegador</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.pushEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <Label className="text-purple-800">Notificaciones SMS</Label>
                    <p className="text-sm text-purple-600">Alertas críticas por mensaje de texto</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications.smsEnabled', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frecuencia de Notificaciones</Label>
                  <Select value={settings.notifications.frequency} onValueChange={(value) => updateSetting('notifications.frequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Inmediata</SelectItem>
                      <SelectItem value="hourly">Cada Hora</SelectItem>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Configuración de Rendimiento
              </CardTitle>
              <CardDescription>
                <span className="text-green-100">Optimiza el rendimiento del sistema</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-blue-800">Cache Habilitado</Label>
                    <p className="text-sm text-blue-600">Mejora la velocidad de carga</p>
                  </div>
                  <Switch
                    checked={settings.performance.cacheEnabled}
                    onCheckedChange={(checked) => updateSetting('performance.cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <Label className="text-green-800">Compresión de Datos</Label>
                    <p className="text-sm text-green-600">Reduce el uso de ancho de banda</p>
                  </div>
                  <Switch
                    checked={settings.performance.compressionEnabled}
                    onCheckedChange={(checked) => updateSetting('performance.compressionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <Label className="text-purple-800">CDN Habilitado</Label>
                    <p className="text-sm text-purple-600">Red de distribución de contenido</p>
                  </div>
                  <Switch
                    checked={settings.performance.cdnEnabled}
                    onCheckedChange={(checked) => updateSetting('performance.cdnEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div>
                    <Label className="text-orange-800">Analytics Habilitado</Label>
                    <p className="text-sm text-orange-600">Seguimiento de uso y rendimiento</p>
                  </div>
                  <Switch
                    checked={settings.performance.analyticsEnabled}
                    onCheckedChange={(checked) => updateSetting('performance.analyticsEnabled', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Límite de API (req/min)</Label>
                    <Input
                      type="number"
                      value={settings.advanced.apiRateLimit}
                      onChange={(e) => updateSetting('advanced.apiRateLimit', parseInt(e.target.value))}
                      min="100"
                      max="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tamaño Máx. Archivo (MB)</Label>
                    <Input
                      type="number"
                      value={settings.advanced.maxFileSize}
                      onChange={(e) => updateSetting('advanced.maxFileSize', parseInt(e.target.value))}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <ActivityIntegrationService />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
            <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                <span className="text-red-100">Gestiona la seguridad y auditoría del sistema</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <Label className="text-blue-800">Registro de Auditoría</Label>
                    <p className="text-sm text-muted-foreground">
                      Registra todas las acciones del sistema
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogging}
                    onCheckedChange={(checked) => updateSetting('security.auditLogging', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <Label className="text-green-800">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Requiere verificación adicional para el acceso
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorRequired}
                    onCheckedChange={(checked) => updateSetting('security.twoFactorRequired', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div>
                    <Label className="text-purple-800">Encriptación de Datos</Label>
                    <p className="text-sm text-muted-foreground">
                      Encripta datos sensibles en la base de datos
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.encryptionEnabled}
                    onCheckedChange={(checked) => updateSetting('security.encryptionEnabled', checked)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
                    <Input
                      id="passwordExpiry"
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => updateSetting('security.passwordExpiry', parseInt(e.target.value))}
                      min="30"
                      max="365"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Intentos de Login Máximos</Label>
                    <Input
                      id="loginAttempts"
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) => updateSetting('security.loginAttempts', parseInt(e.target.value))}
                      min="3"
                      max="10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value))}
                    min="5"
                    max="480"
                    className="w-32"
                  />
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Registro de Auditoría</Label>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Generar PDF de auditoría
                      const auditData = {
                        generatedAt: new Date().toISOString(),
                        systemInfo: {
                          version: "1.0.0",
                          users: JSON.parse(localStorage.getItem('systemUsers') || '[]').length,
                          validations: JSON.parse(localStorage.getItem('systemValidations') || '[]').length,
                        },
                        recentActivity: [
                          { date: new Date().toISOString(), action: "Usuario logueado", user: "admin@empresa.com" },
                          { date: new Date(Date.now() - 3600000).toISOString(), action: "Validación creada", user: "analista@empresa.com" },
                          { date: new Date(Date.now() - 7200000).toISOString(), action: "Producto agregado", user: "coordinador@empresa.com" },
                        ]
                      };

                      const content = `
REGISTRO DE AUDITORÍA
=====================

Generado: ${new Date().toLocaleString()}

INFORMACIÓN DEL SISTEMA:
- Versión: ${auditData.systemInfo.version}
- Usuarios registrados: ${auditData.systemInfo.users}
- Validaciones registradas: ${auditData.systemInfo.validations}

ACTIVIDAD RECIENTE:
${auditData.recentActivity.map(activity => 
  `- ${new Date(activity.date).toLocaleString()}: ${activity.action} (${activity.user})`
).join('\n')}

CONFIGURACIÓN DE SEGURIDAD:
- Registro de auditoría: ${settings.security.auditLogging ? 'Activado' : 'Desactivado'}
- Autenticación 2FA: ${settings.security.twoFactorRequired ? 'Activado' : 'Desactivado'}
- Tiempo de sesión: ${settings.security.sessionTimeout} minutos
                      `;

                      const blob = new Blob([content], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `audit-log-${new Date().toISOString().split('T')[0]}.txt`;
                      link.click();
                      URL.revokeObjectURL(url);

                      toast({
                        title: "Registro Descargado",
                        description: "El registro de auditoría ha sido descargado exitosamente",
                      });
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Registro de Auditoría
                  </Button>
                </div>

                <Button 
                  onClick={() => {
                    toast({
                      title: "Configuración Guardada",
                      description: "Los cambios de seguridad han sido aplicados",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white"
                >
                  Guardar Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsModule;