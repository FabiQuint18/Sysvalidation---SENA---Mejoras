import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, MessageCircle, Calendar, Send, Check, X, Settings, Globe, Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Validation } from '@/types/validation';

interface IntegrationSettings {
  email: {
    enabled: boolean;
    provider: 'gmail' | 'outlook' | 'exchange';
    smtp_server?: string;
    port?: number;
    username?: string;
    password?: string;
    sender_email?: string;
  };
  teams: {
    enabled: boolean;
    webhook_url?: string;
    channel_id?: string;
    tenant_id?: string;
  };
  google: {
    enabled: boolean;
    workspace_id?: string;
    calendar_id?: string;
    drive_folder_id?: string;
    client_id?: string;
    client_secret?: string;
  };
  authentication: {
    google_auth: boolean;
    microsoft_auth: boolean;
    teams_auth: boolean;
  };
}

interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'email' | 'teams' | 'calendar' | 'auth';
  status: 'sent' | 'failed' | 'pending' | 'success';
  recipient: string;
  subject: string;
  validation_id?: string;
  message: string;
}

const ActivityIntegrationService = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<IntegrationSettings>({
    email: {
      enabled: true,
      provider: 'outlook',
      sender_email: 'validaciones@empresa.com'
    },
    teams: {
      enabled: true,
      webhook_url: 'https://outlook.office.com/webhook/...'
    },
    google: {
      enabled: true,
      workspace_id: 'empresa.com',
      client_id: 'google-client-id'
    },
    authentication: {
      google_auth: true,
      microsoft_auth: true,
      teams_auth: true
    }
  });
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [testRecipient, setTestRecipient] = useState('');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('integrationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedLogs = localStorage.getItem('activityLogs');
    if (savedLogs) {
      setActivityLogs(JSON.parse(savedLogs));
    }

    // Simulate some activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        type: 'email',
        status: 'sent',
        recipient: 'admin@empresa.com',
        subject: 'Validación próxima a vencer',
        message: 'Notificación automática de vencimiento'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'teams',
        status: 'sent',
        recipient: 'Canal QA',
        subject: 'Nueva validación creada',
        message: 'VAL-001-2024 ha sido creada'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        type: 'auth',
        status: 'success',
        recipient: 'usuario@empresa.com',
        subject: 'Login con Google',
        message: 'Autenticación exitosa'
      }
    ];
    setActivityLogs(mockLogs);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('integrationSettings', JSON.stringify(settings));
    toast({
      title: "Configuración Guardada",
      description: "Las configuraciones de integración han sido guardadas exitosamente",
    });
    setShowSettings(false);
  };

  const sendEmailNotification = async (recipient: string, subject: string, message: string, validation?: Validation) => {
    if (!settings.email.enabled) {
      toast({
        title: "Email Deshabilitado",
        description: "Las notificaciones por email están deshabilitadas",
        variant: "destructive",
      });
      return;
    }

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'email',
      status: 'pending',
      recipient,
      subject,
      validation_id: validation?.id,
      message
    };

    setActivityLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      const success = Math.random() > 0.1;
      setActivityLogs(prev => prev.map(log => 
        log.id === newLog.id 
          ? { ...log, status: success ? 'sent' : 'failed' }
          : log
      ));

      if (success) {
        toast({
          title: "Email Enviado",
          description: `Notificación enviada exitosamente a ${recipient} via ${settings.email.provider.toUpperCase()}`,
        });
      } else {
        toast({
          title: "Error de Envío",
          description: `No se pudo enviar el email a ${recipient}`,
          variant: "destructive",
        });
      }

      localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
    }, 2000);

    console.log(`📧 Sending email via ${settings.email.provider}:`, {
      to: recipient,
      subject,
      message,
      smtp: settings.email.smtp_server,
      sender: settings.email.sender_email
    });
  };

  const sendTeamsNotification = async (message: string, validation?: Validation) => {
    if (!settings.teams.enabled || !settings.teams.webhook_url) {
      toast({
        title: "Teams Deshabilitado",
        description: "Las notificaciones de Teams están deshabilitadas o no configuradas",
        variant: "destructive",
      });
      return;
    }

    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: 'teams',
      status: 'pending',
      recipient: 'Teams Channel',
      subject: 'Validación Notification',
      validation_id: validation?.id,
      message
    };

    setActivityLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      const success = Math.random() > 0.05;
      setActivityLogs(prev => prev.map(log => 
        log.id === newLog.id 
          ? { ...log, status: success ? 'sent' : 'failed' }
          : log
      ));

      if (success) {
        toast({
          title: "Teams Notificado",
          description: "Mensaje enviado exitosamente a Microsoft Teams",
        });
      } else {
        toast({
          title: "Error Teams",
          description: "No se pudo enviar el mensaje a Teams",
          variant: "destructive",
        });
      }

      localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
    }, 1500);

    console.log('📢 Sending Teams notification:', {
      webhook: settings.teams.webhook_url,
      channel: settings.teams.channel_id,
      message,
      validation: validation?.validation_code
    });
  };

  const testEmailConnection = async () => {
    if (!testRecipient) {
      toast({
        title: "Error",
        description: "Ingrese un email de prueba",
        variant: "destructive",
      });
      return;
    }

    await sendEmailNotification(
      testRecipient,
      "Prueba de Conexión - Sistema de Validaciones",
      "Este es un mensaje de prueba para verificar la configuración de email del sistema de validaciones."
    );
  };

  const testTeamsConnection = async () => {
    await sendTeamsNotification(
      "🧪 **Prueba de Conexión Teams**\n\nEste es un mensaje de prueba para verificar la integración con Microsoft Teams del sistema de validaciones."
    );
  };

  const testGoogleAuth = () => {
    toast({
      title: "Autenticación Google",
      description: "Redirigiendo a Google para autenticación...",
    });
    
    // Simulate Google OAuth flow
    setTimeout(() => {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'auth',
        status: 'success',
        recipient: 'usuario@gmail.com',
        subject: 'Google Authentication',
        message: 'Autenticación con Google exitosa'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Google Auth Exitoso",
        description: "Autenticación con Google configurada correctamente",
      });
    }, 2000);
  };

  const testMicrosoftAuth = () => {
    toast({
      title: "Autenticación Microsoft",
      description: "Redirigiendo a Microsoft para autenticación...",
    });
    
    setTimeout(() => {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: 'auth',
        status: 'success',
        recipient: 'usuario@outlook.com',
        subject: 'Microsoft Authentication',
        message: 'Autenticación con Microsoft exitosa'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      
      toast({
        title: "Microsoft Auth Exitoso",
        description: "Autenticación con Microsoft configurada correctamente",
      });
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'success':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <X className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Send className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Exitoso</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Fallido</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  return (
    <div className="space-y-6">
      {/* Integration Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Email (Outlook/Gmail)</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${settings.email.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">{settings.email.enabled ? 'Activo' : 'Inactivo'}</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              {settings.email.provider ? settings.email.provider.toUpperCase() : 'No configurado'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Microsoft Teams</CardTitle>
            <MessageCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${settings.teams.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">{settings.teams.enabled ? 'Activo' : 'Inactivo'}</span>
            </div>
            <p className="text-xs text-purple-700 mt-1">
              {settings.teams.webhook_url ? 'Webhook configurado' : 'No configurado'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Google Workspace</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${settings.google.enabled ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">{settings.google.enabled ? 'Activo' : 'Inactivo'}</span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              {settings.google.workspace_id ? 'Workspace conectado' : 'No configurado'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Autenticación SSO</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${settings.authentication.google_auth || settings.authentication.microsoft_auth ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium">
                {settings.authentication.google_auth || settings.authentication.microsoft_auth ? 'Configurado' : 'Inactivo'}
              </span>
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Google & Microsoft
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration and Testing */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
            <CardDescription className="text-blue-100">
              Configurar integraciones con servicios externos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Button onClick={() => setShowSettings(true)} className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800">
              <Settings className="mr-2 h-4 w-4" />
              Configurar Integraciones
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={testGoogleAuth} variant="outline" className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100">
                <Globe className="mr-2 h-4 w-4" />
                Test Google
              </Button>
              <Button onClick={testMicrosoftAuth} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100">
                <Shield className="mr-2 h-4 w-4" />
                Test Microsoft
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle>Pruebas de Conectividad</CardTitle>
            <CardDescription className="text-green-100">
              Probar la conectividad con los servicios configurados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="testEmail">Email de Prueba</Label>
              <Input
                id="testEmail"
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="test@empresa.com"
                className="border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Button 
                onClick={testEmailConnection} 
                variant="outline" 
                className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                disabled={!settings.email.enabled}
              >
                <Mail className="mr-2 h-4 w-4" />
                Probar Email ({settings.email.provider})
              </Button>
              <Button 
                onClick={testTeamsConnection} 
                variant="outline" 
                className="w-full bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                disabled={!settings.teams.enabled}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Probar Teams
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Registro de Actividades en Tiempo Real
          </CardTitle>
          <CardDescription className="text-gray-200">
            Historial de notificaciones y comunicaciones enviadas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {activityLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Fecha</TableHead>
                    <TableHead className="font-semibold">Tipo</TableHead>
                    <TableHead className="font-semibold">Destinatario</TableHead>
                    <TableHead className="font-semibold">Asunto</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.slice(0, 10).map((log, index) => (
                    <TableRow key={log.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <TableCell className="font-medium text-gray-700">
                        {formatDate(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {log.type === 'email' && <Mail className="h-4 w-4 text-blue-600" />}
                          {log.type === 'teams' && <MessageCircle className="h-4 w-4 text-purple-600" />}
                          {log.type === 'calendar' && <Calendar className="h-4 w-4 text-green-600" />}
                          {log.type === 'auth' && <Shield className="h-4 w-4 text-orange-600" />}
                          <span className="capitalize font-medium">{log.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{log.recipient}</TableCell>
                      <TableCell className="text-gray-700">{log.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-gray-50 to-blue-50">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No hay actividades registradas</h3>
              <p className="text-sm">Las actividades aparecerán aquí cuando se configuren las integraciones</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">Configuración Avanzada de Integraciones</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="email" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="email" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Email</TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Teams</TabsTrigger>
              <TabsTrigger value="google" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">Google</TabsTrigger>
              <TabsTrigger value="auth" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">Autenticación</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-lg text-blue-800">Configuración de Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <Label>Habilitar notificaciones por email</Label>
                    <Switch
                      checked={settings.email.enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Proveedor de Email</Label>
                    <Select 
                      value={settings.email.provider} 
                      onValueChange={(value: 'gmail' | 'outlook' | 'exchange') => 
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, provider: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outlook">Outlook (Microsoft)</SelectItem>
                        <SelectItem value="gmail">Gmail (Google)</SelectItem>
                        <SelectItem value="exchange">Exchange Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Email del Remitente</Label>
                    <Input
                      type="email"
                      value={settings.email.sender_email || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          email: { ...prev.email, sender_email: e.target.value }
                        }))
                      }
                      placeholder="validaciones@empresa.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Servidor SMTP</Label>
                      <Input
                        value={settings.email.smtp_server || ''}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, smtp_server: e.target.value }
                          }))
                        }
                        placeholder={settings.email.provider === 'outlook' ? 'smtp-mail.outlook.com' : 'smtp.gmail.com'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Puerto</Label>
                      <Input
                        type="number"
                        value={settings.email.port || ''}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            email: { ...prev.email, port: parseInt(e.target.value) }
                          }))
                        }
                        placeholder="587"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              <Card className="border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <CardTitle className="text-lg text-purple-800">Configuración de Microsoft Teams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <Label>Habilitar notificaciones de Teams</Label>
                    <Switch
                      checked={settings.teams.enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          teams: { ...prev.teams, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook URL de Teams</Label>
                    <Input
                      value={settings.teams.webhook_url || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          teams: { ...prev.teams, webhook_url: e.target.value }
                        }))
                      }
                      placeholder="https://outlook.office.com/webhook/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ID del Canal (opcional)</Label>
                    <Input
                      value={settings.teams.channel_id || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          teams: { ...prev.teams, channel_id: e.target.value }
                        }))
                      }
                      placeholder="19:channel-id@thread.tacv2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tenant ID (opcional)</Label>
                    <Input
                      value={settings.teams.tenant_id || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          teams: { ...prev.teams, tenant_id: e.target.value }
                        }))
                      }
                      placeholder="tenant-id-uuid"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="google" className="space-y-6">
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="text-lg text-green-800">Configuración de Google Workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <Label>Habilitar integración con Google</Label>
                    <Switch
                      checked={settings.google.enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          google: { ...prev.google, enabled: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ID del Workspace</Label>
                    <Input
                      value={settings.google.workspace_id || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          google: { ...prev.google, workspace_id: e.target.value }
                        }))
                      }
                      placeholder="empresa.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input
                        value={settings.google.client_id || ''}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            google: { ...prev.google, client_id: e.target.value }
                          }))
                        }
                        placeholder="google-client-id"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        value={settings.google.client_secret || ''}
                        onChange={(e) => 
                          setSettings(prev => ({
                            ...prev,
                            google: { ...prev.google, client_secret: e.target.value }
                          }))
                        }
                        placeholder="google-client-secret"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ID del Calendario</Label>
                    <Input
                      value={settings.google.calendar_id || ''}
                      onChange={(e) => 
                        setSettings(prev => ({
                          ...prev,
                          google: { ...prev.google, calendar_id: e.target.value }
                        }))
                      }
                      placeholder="validaciones@empresa.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auth" className="space-y-6">
              <Card className="border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
                  <CardTitle className="text-lg text-orange-800">Configuración de Autenticación SSO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <Label className="text-red-800">Autenticación con Google</Label>
                        <p className="text-sm text-red-600">Permitir login con cuentas de Google</p>
                      </div>
                      <Switch
                        checked={settings.authentication.google_auth}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            authentication: { ...prev.authentication, google_auth: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <Label className="text-blue-800">Autenticación con Microsoft</Label>
                        <p className="text-sm text-blue-600">Permitir login con cuentas de Microsoft/Outlook</p>
                      </div>
                      <Switch
                        checked={settings.authentication.microsoft_auth}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            authentication: { ...prev.authentication, microsoft_auth: checked }
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div>
                        <Label className="text-purple-800">Autenticación con Teams</Label>
                        <p className="text-sm text-purple-600">Permitir login directo desde Microsoft Teams</p>
                      </div>
                      <Switch
                        checked={settings.authentication.teams_auth}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({
                            ...prev,
                            authentication: { ...prev.authentication, teams_auth: checked }
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Configuración Requerida</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Configure los Client IDs en las pestañas correspondientes</li>
                      <li>• Asegúrese de tener los permisos necesarios en Azure AD</li>
                      <li>• Configure las URLs de redirección en las consolas de desarrollador</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-6 border-t">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSettings} className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              Guardar Configuración
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityIntegrationService;