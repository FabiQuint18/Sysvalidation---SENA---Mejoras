
import React, { useState, useEffect, useMemo } from 'react';
import StatsCard from './StatsCard';
import AnalyticsCharts from './AnalyticsCharts';
import AnalyticsSection from './AnalyticsSection';
import ExpiryNotifications from '@/components/notifications/ExpiryNotifications';
import EmailNotificationService from '@/components/notifications/EmailNotificationService';
import { ClipboardCheck, Package, Users, AlertTriangle, TrendingUp, FileText, BarChart3, Calendar, Target, Award, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole, ValidationType, Validation, ProductType } from '@/types/validation';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend, AreaChart, Area } from 'recharts';

interface DashboardProps {
  userRole?: UserRole;
  currentUserEmail?: string;
}

const Dashboard = ({ userRole = 'visualizador', currentUserEmail }: DashboardProps) => {
  const { t } = useLanguage();
  const [selectedValidationType, setSelectedValidationType] = useState<ValidationType | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [validations, setValidations] = useState<Validation[]>([]);
  const [products, setProducts] = useState([]);
  const [equipments, setEquipments] = useState([]);

  // Cargar datos del localStorage
  useEffect(() => {
    const savedValidations = localStorage.getItem('systemValidations');
    if (savedValidations) {
      setValidations(JSON.parse(savedValidations));
    }

    const savedProducts = localStorage.getItem('systemProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    const savedEquipments = localStorage.getItem('systemEquipments');
    if (savedEquipments) {
      setEquipments(JSON.parse(savedEquipments));
    }
  }, []);

  // Filtrar validaciones por tipo, año y mes
  const filteredValidations = useMemo(() => {
    return validations.filter(v => {
      const validationDate = new Date(v.created_at);
      const validationYear = validationDate.getFullYear().toString();
      const validationMonth = validationDate.getMonth().toString();
      
      const typeMatch = selectedValidationType === 'all' || v.validation_type === selectedValidationType;
      const yearMatch = validationYear === selectedYear;
      const monthMatch = selectedMonth === 'all' || validationMonth === selectedMonth;
      
      return typeMatch && yearMatch && monthMatch;
    });
  }, [validations, selectedValidationType, selectedYear, selectedMonth]);

  // Obtener años y meses disponibles
  const availableYears = useMemo(() => {
    return [...new Set(validations.map(v => new Date(v.created_at).getFullYear().toString()))].sort((a, b) => b.localeCompare(a));
  }, [validations]);

  const availableMonths = useMemo(() => {
    const months = [
      { value: 'all', label: 'Todos los meses' },
      { value: '0', label: 'Enero' },
      { value: '1', label: 'Febrero' },
      { value: '2', label: 'Marzo' },
      { value: '3', label: 'Abril' },
      { value: '4', label: 'Mayo' },
      { value: '5', label: 'Junio' },
      { value: '6', label: 'Julio' },
      { value: '7', label: 'Agosto' },
      { value: '8', label: 'Septiembre' },
      { value: '9', label: 'Octubre' },
      { value: '10', label: 'Noviembre' },
      { value: '11', label: 'Diciembre' }
    ];
    return months;
  }, []);

  // Estadísticas calculadas desde validaciones reales
  const stats = useMemo(() => {
    const validatedProducts = filteredValidations.filter(v => v.status === 'validado');
    const uniqueValidatedProducts = [...new Set(validatedProducts.map(v => v.product?.id))].length;
    
    // Contar productos por tipo
    const productsByType = filteredValidations.reduce((acc, v) => {
      const type = v.product?.type || 'producto_terminado';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Contar equipos más usados
    const equipmentUsage = filteredValidations.reduce((acc, v) => {
      acc[v.equipment_type] = (acc[v.equipment_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Validaciones por mes
    const validationsByMonth = Array.from({ length: 12 }, (_, i) => {
      const monthValidations = filteredValidations.filter(v => 
        new Date(v.created_at).getMonth() === i
      );
      return {
        month: new Date(2024, i).toLocaleDateString('es-ES', { month: 'short' }),
        validations: monthValidations.length,
        validated: monthValidations.filter(v => v.status === 'validado').length,
        protocols: monthValidations.filter(v => v.files && v.files.length > 0).length
      };
    });

    return {
      totalValidations: filteredValidations.length,
      validatedProducts: uniqueValidatedProducts,
      totalProducts: products.length,
      expiring: filteredValidations.filter(v => v.status === 'proximo_vencer').length,
      expired: filteredValidations.filter(v => v.status === 'vencido').length,
      validated: filteredValidations.filter(v => v.status === 'validado').length,
      protocols: filteredValidations.filter(v => v.files && v.files.length > 0).length,
      reports: filteredValidations.filter(v => 
        v.status === 'validado' || 
        v.status === 'primera_revision' || 
        v.status === 'segunda_revision'
      ).length,
      productsByType,
      equipmentUsage,
      validationsByMonth
    };
  }, [filteredValidations, products]);

  // Control de acceso por roles
  const canViewAnalytics = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'visualizador' || userRole === 'analista';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.subtitle')} - Análisis detallado de validaciones farmacéuticas
        </p>
      </div>

      {/* Filtros del Dashboard */}
      {canViewAnalytics && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Filtros de Dashboard
            </CardTitle>
            <CardDescription className="text-blue-100">
              Filtrar datos por tipo de validación, año y mes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year-filter" className="text-sm font-medium">Año:</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="month-filter" className="text-sm font-medium">Mes:</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map(month => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validation-type-filter" className="text-sm font-medium">Tipo de Validación:</Label>
                <Select value={selectedValidationType} onValueChange={(value) => setSelectedValidationType(value as ValidationType | 'all')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="procesos">{t('validations.processes')}</SelectItem>
                    <SelectItem value="limpieza">{t('validations.cleaning')}</SelectItem>
                    <SelectItem value="metodos_analiticos">{t('validations.analytical_methods')}</SelectItem>
                    <SelectItem value="sistemas_computarizados">{t('validations.computerized_systems')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Productos Validados"
          value={stats.validatedProducts}
          icon={Award}
          description={`${stats.validatedProducts} de ${stats.totalProducts} productos validados`}
          trend={{ value: ((stats.validatedProducts / stats.totalProducts) * 100).toFixed(1), isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        />
        <StatsCard
          title="Total Validaciones"
          value={stats.totalValidations}
          icon={ClipboardCheck}
          description={`Validaciones en ${selectedYear}`}
          trend={{ value: stats.validated, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        />
        <StatsCard
          title="Protocolos"
          value={stats.protocols}
          icon={FileText}
          description={`Protocolos completados`}
          trend={{ value: ((stats.protocols / stats.totalValidations) * 100).toFixed(1), isPositive: true }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        />
        <StatsCard
          title="Reportes"
          value={stats.reports}
          icon={Target}
          description={`Reportes de validación`}
          trend={{ value: ((stats.reports / stats.totalValidations) * 100).toFixed(1), isPositive: true }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
        />
      </div>

      {/* Métricas Detalladas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tipo de Material */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-emerald-50">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Tipo de Material
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Object.entries(stats.productsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800">
                      {type === 'producto_terminado' ? 'Producto' : 
                       type === 'materia_prima' ? 'Materia Prima' :
                       type === 'material_empaque' ? 'Empaque o Envase' : 'Granel'}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipos Más Usados */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Equipos Más Usados
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {Object.entries(stats.equipmentUsage)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([equipment, count]) => (
                <div key={equipment} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {equipment}
                    </Badge>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Validaciones por Mes */}
      {canViewAnalytics && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Validaciones por Mes - {selectedYear}
            </CardTitle>
            <CardDescription className="text-purple-100">
              Evolución de validaciones, productos validados y protocolos por mes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.validationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="validations" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  name="Total Validaciones"
                />
                <Area 
                  type="monotone" 
                  dataKey="validated" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  name="Productos Validados"
                />
                <Area 
                  type="monotone" 
                  dataKey="protocols" 
                  stackId="3" 
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  name="Protocolos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Email Notification Service */}
      <EmailNotificationService 
        validations={filteredValidations} 
        userEmail={currentUserEmail}
        enabled={true}
      />

      {/* Expiry Notifications */}
      {(userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista') && (
        <ExpiryNotifications validations={filteredValidations} />
      )}

      {/* Analíticas de Validaciones */}
      {canViewAnalytics && (
        <div className="grid gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-indigo-50">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Analíticas de Validaciones
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Análisis detallado de validaciones - {selectedYear}
                {selectedValidationType !== 'all' && ` - ${t('validations.' + selectedValidationType.replace('_', '.'))}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnalyticsCharts validations={filteredValidations} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mensaje para roles sin acceso */}
      {!canViewAnalytics && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-red-50">
          <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              {t('dashboard.access_restricted')}
            </CardTitle>
            <CardDescription className="text-red-100">
              {t('dashboard.contact_administrator')}
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
