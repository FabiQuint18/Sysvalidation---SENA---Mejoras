
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, FileText, Clock, AlertTriangle } from 'lucide-react';

interface SecurityFeature {
  name: string;
  status: 'active' | 'inactive';
  description: string;
  cfr21Compliant: boolean;
}

const SecurityManager = () => {
  const [securityFeatures] = useState<SecurityFeature[]>([
    {
      name: 'Backup Automático',
      status: 'active',
      description: 'Respaldo automático cada 24 horas',
      cfr21Compliant: true
    },
    {
      name: 'Audit Trail',
      status: 'active',
      description: 'Registro completo de todas las acciones del usuario',
      cfr21Compliant: true
    },
    {
      name: 'Bloqueo por Inactividad',
      status: 'active',
      description: 'Bloqueo automático después de 5 minutos de inactividad',
      cfr21Compliant: true
    },
    {
      name: 'Control de Intentos Fallidos',
      status: 'active',
      description: 'Bloqueo de cuenta por usuario después de 3 intentos fallidos',
      cfr21Compliant: true
    },
    {
      name: 'Firmas Electrónicas',
      status: 'active',
      description: 'Cumplimiento con CFR 21 Parte 11',
      cfr21Compliant: true
    },
    {
      name: 'Integridad de Datos',
      status: 'active',
      description: 'Verificación de integridad mediante checksums',
      cfr21Compliant: true
    }
  ]);

  const [auditLogs] = useState([
    { timestamp: '2024-06-11 10:30:00', user: 'admin@company.com', action: 'Login exitoso', ip: '192.168.1.100' },
    { timestamp: '2024-06-11 10:28:00', user: 'test@company.com', action: 'Cuenta bloqueada por 3 intentos fallidos', ip: '192.168.1.105' },
    { timestamp: '2024-06-11 10:25:00', user: 'analista@company.com', action: 'Validación VAL-001-2024 editada', ip: '192.168.1.101' },
    { timestamp: '2024-06-11 10:23:00', user: 'coordinador@company.com', action: 'Sesión cerrada por inactividad (5 minutos)', ip: '192.168.1.103' },
    { timestamp: '2024-06-11 10:20:00', user: 'coordinador@company.com', action: 'Nuevo producto creado', ip: '192.168.1.102' },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Estado de Seguridad CFR 21 Parte 11
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{feature.name}</h4>
                  <Badge variant={feature.status === 'active' ? 'default' : 'destructive'}>
                    {feature.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                {feature.cfr21Compliant && (
                  <Badge variant="outline" className="text-xs">
                    CFR 21 Parte 11 ✓
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Audit Trail - Últimas Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {auditLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{log.timestamp}</span>
                  <span className="text-sm font-medium">{log.user}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{log.action}</span>
                  <span className="text-xs text-muted-foreground">{log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityManager;
