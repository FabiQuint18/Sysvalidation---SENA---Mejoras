
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, Key, AlertTriangle, Download, FileText, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/validation';

interface SecurityModuleProps {
  userRole?: UserRole;
}

const SecurityModule = ({ userRole = 'administrador' }: SecurityModuleProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    loginAttempts: 5,
    auditLogging: true,
    encryptionEnabled: true
  });

  // Control de acceso - solo super admin puede hacer cambios
  const canManageSecurity = userRole === 'super_administrador';
  const canViewSecurity = userRole === 'super_administrador' || userRole === 'administrador';

  if (!canViewSecurity) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              No tienes permisos para ver este módulo
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Mock security logs
  const mockSecurityLogs = [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'admin@company.com',
      action: 'Login',
      resource: 'Sistema',
      status: 'success',
      ip_address: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-01-15T09:15:00Z',
      user: 'analista@company.com',
      action: 'Crear Validación',
      resource: 'VAL-001-2024',
      status: 'success',
      ip_address: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: '2024-01-15T08:45:00Z',
      user: 'unknown',
      action: 'Login Failed',
      resource: 'Sistema',
      status: 'failed',
      ip_address: '192.168.1.999'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">{t('status.success')}</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">{t('status.failed')}</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('status.warning')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const updateSecuritySetting = (setting: string, value: any) => {
    if (!canManageSecurity) {
      toast({
        title: "Acceso Denegado",
        description: "Solo el Super Administrador puede modificar configuraciones de seguridad",
        variant: "destructive",
      });
      return;
    }
    
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
            toast({
              title: "Configuración Actualizada",
              description: "La configuración de seguridad ha sido actualizada",
            });
  };

  const handlePasswordReset = () => {
    setShowPasswordDialog(true);
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    // Validate password requirements
    const minLength = passwordData.newPassword.length >= 7;
    const hasUppercase = /[A-Z]/.test(passwordData.newPassword);
    const hasSpecialChar = /[*+\-_@#$%^&!?]/.test(passwordData.newPassword);
    const hasAlphaNumeric = /[a-zA-Z]/.test(passwordData.newPassword) && /[0-9]/.test(passwordData.newPassword);
    
    if (!minLength || !hasUppercase || !hasSpecialChar || !hasAlphaNumeric) {
      toast({
        title: "Error de Contraseña",
        description: t('users.password.requirements'),
        variant: "destructive",
      });
      return;
    }

    console.log('Changing password:', passwordData);
    
    toast({
      title: "Contraseña Cambiada",
      description: "La contraseña ha sido actualizada exitosamente",
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordDialog(false);
  };

  const downloadAuditTrail = () => {
    const csvContent = mockSecurityLogs.map(log => 
      `${formatDate(log.timestamp)},${log.user},${log.action},${log.resource},${log.status},${log.ip_address}`
    ).join('\n');
    
    const csvHeader = 'Fecha,Usuario,Acción,Recurso,Estado,IP\n';
    const csvData = csvHeader + csvContent;
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Auditoría Descargada",
      description: "Registro de auditoría descargado exitosamente",
    });
  };

  const viewAuditPDF = () => {
    toast({
      title: "Generando PDF de Auditoría",
      description: "Generando reporte PDF del registro de auditoría...",
    });
    // Aquí se implementaría la generación de PDF
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('security.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('security.subtitle')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePasswordReset}>
            <Lock className="mr-2 h-4 w-4" />
            Cambiar Contraseña
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Configuraciones de Seguridad
            </CardTitle>
            <CardDescription>
              Configurar parámetros de seguridad del sistema
              {!canManageSecurity && (
                <span className="block text-orange-600 mt-1">
                  Solo lectura - Contacte al Super Administrador para cambios
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Autenticación de Dos Factores</Label>
                <p className="text-sm text-muted-foreground">Habilitar autenticación de dos factores para mayor seguridad</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
                disabled={!canManageSecurity}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiración de Contraseña (días)</Label>
              <Input
                id="passwordExpiry"
                type="number"
                value={securitySettings.passwordExpiry}
                onChange={(e) => updateSecuritySetting('passwordExpiry', parseInt(e.target.value))}
                disabled={!canManageSecurity}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={securitySettings.sessionTimeout}
                onChange={(e) => updateSecuritySetting('sessionTimeout', parseInt(e.target.value))}
                disabled={!canManageSecurity}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Intentos de Login Permitidos</Label>
              <Input
                id="loginAttempts"
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => updateSecuritySetting('loginAttempts', parseInt(e.target.value))}
                disabled={!canManageSecurity}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Registro de Auditoría</Label>
                <p className="text-sm text-muted-foreground">Activar registro de todas las actividades del sistema</p>
              </div>
              <Switch
                checked={securitySettings.auditLogging}
                onCheckedChange={(checked) => updateSecuritySetting('auditLogging', checked)}
                disabled={!canManageSecurity}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Encriptación de Datos</Label>
                <p className="text-sm text-muted-foreground">Habilitar encriptación para datos sensibles</p>
              </div>
              <Switch
                checked={securitySettings.encryptionEnabled}
                onCheckedChange={(checked) => updateSecuritySetting('encryptionEnabled', checked)}
                disabled={!canManageSecurity}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Gestión de Contraseñas
            </CardTitle>
            <CardDescription>
              Herramientas para gestión de contraseñas y seguridad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handlePasswordReset} className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Cambiar Contraseña
            </Button>
            
            {canManageSecurity && (
              <Button variant="outline" className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Restablecer Contraseña de Usuario
              </Button>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Requisitos de Contraseña:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mínimo 7 caracteres</li>
                <li>• Al menos 1 letra mayúscula</li>
                <li>• Al menos 1 símbolo especial (*,+,-,_,@,#,$,%,^,&,!,?)</li>
                <li>• Debe contener números y letras</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Registro de Auditoría
              </CardTitle>
              <CardDescription>
                Historial de actividades y eventos de seguridad del sistema
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadAuditTrail}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Auditoría
              </Button>
              <Button variant="outline" onClick={viewAuditPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Ver PDF de Auditoría
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Recurso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Dirección IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSecurityLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>
              Cambiar contraseña de usuario actual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {t('users.password.requirements')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handlePasswordChange}>
              Cambiar Contraseña
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityModule;
