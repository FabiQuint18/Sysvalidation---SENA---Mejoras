import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip, Legend, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Validation } from '@/types/validation';
import { getDaysUntilExpiry } from '@/utils/dateUtils';

interface AnalyticsChartsProps {
  validations: Validation[];
}

const AnalyticsCharts = ({ validations = [] }: AnalyticsChartsProps) => {
  const { t } = useLanguage();

  // Ensure validations is always an array
  const safeValidations = Array.isArray(validations) ? validations : [];

  // Productos validados
  const validatedProducts = safeValidations.filter(v => v.status === 'validado');
  const uniqueValidatedProducts = [...new Set(validatedProducts.map(v => v.product?.id))].length;

  // Validaciones por tipo con colores mejorados
  const validationsByType = [
    { 
      name: 'Procesos', 
      value: safeValidations.filter(v => v.validation_type === 'procesos').length,
      fill: '#3b82f6',
      percentage: 0
    },
    { 
      name: 'Métodos Analíticos', 
      value: safeValidations.filter(v => v.validation_type === 'metodos_analiticos').length,
      fill: '#10b981',
      percentage: 0
    },
    { 
      name: 'Limpieza', 
      value: safeValidations.filter(v => v.validation_type === 'limpieza').length,
      fill: '#f59e0b',
      percentage: 0
    },
    { 
      name: 'Sistemas', 
      value: safeValidations.filter(v => v.validation_type === 'sistemas_computarizados').length,
      fill: '#8b5cf6',
      percentage: 0
    },
  ].map(item => ({
    ...item,
    percentage: safeValidations.length > 0 ? ((item.value / safeValidations.length) * 100).toFixed(1) : 0
  }));

  // Validaciones por subcategoría
  const validationsBySubcategory = [
    { 
      name: 'Valoración', 
      value: safeValidations.filter(v => v.subcategory === 'valoracion').length,
      fill: '#3b82f6'
    },
    { 
      name: 'Disolución', 
      value: safeValidations.filter(v => v.subcategory === 'disolucion').length,
      fill: '#10b981'
    },
    { 
      name: 'Impurezas', 
      value: safeValidations.filter(v => v.subcategory === 'impurezas').length,
      fill: '#f59e0b'
    },
    { 
      name: 'Fabricación', 
      value: safeValidations.filter(v => v.subcategory === 'fabricacion').length,
      fill: '#8b5cf6'
    },
    { 
      name: 'Empaque', 
      value: safeValidations.filter(v => v.subcategory === 'empaque').length,
      fill: '#ef4444'
    },
    { 
      name: 'Identificación', 
      value: safeValidations.filter(v => v.subcategory === 'identificacion').length,
      fill: '#06b6d4'
    },
  ].filter(item => item.value > 0);

  // Protocolos (validaciones con archivos)
  const protocolsCount = safeValidations.filter(v => v.files && v.files.length > 0).length;

  // Reportes (validaciones completadas)
  const reportsCount = safeValidations.filter(v => 
    v.status === 'validado' || 
    v.status === 'primera_revision' || 
    v.status === 'segunda_revision'
  ).length;

  // Validaciones por estado
  const validationsByStatus = [
    { name: 'Validado', value: safeValidations.filter(v => v.status === 'validado').length, fill: '#10b981' },
    { name: 'En Validación', value: safeValidations.filter(v => v.status === 'en_validacion').length, fill: '#3b82f6' },
    { name: 'Próximo a Vencer', value: safeValidations.filter(v => v.status === 'proximo_vencer').length, fill: '#f59e0b' },
    { name: 'Vencido', value: safeValidations.filter(v => v.status === 'vencido').length, fill: '#ef4444' },
    { name: 'En Revalidación', value: safeValidations.filter(v => v.status === 'en_revalidacion').length, fill: '#8b5cf6' },
  ].filter(item => item.value > 0);

  // Equipos más utilizados
  const equipmentUsage = safeValidations.reduce((acc, v) => {
    acc[v.equipment_type] = (acc[v.equipment_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEquipment = Object.entries(equipmentUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([equipment, count]) => ({
      name: equipment,
      value: count,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

  // Validaciones por mes (últimos 6 meses)
  const validationsByMonth = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthValidations = safeValidations.filter(v => {
      const validationDate = new Date(v.created_at);
      return validationDate.getMonth() === date.getMonth() && 
             validationDate.getFullYear() === date.getFullYear();
    });
    
    return {
      month: date.toLocaleDateString('es-ES', { month: 'short' }),
      validations: monthValidations.length,
      validated: monthValidations.filter(v => v.status === 'validado').length,
      protocols: monthValidations.filter(v => v.files && v.files.length > 0).length
    };
  }).reverse();

  // Estadísticas generales para gráfico radial
  const generalStats = [
    { 
      name: 'Productos Validados', 
      value: uniqueValidatedProducts,
      fill: '#10b981'
    },
    { 
      name: 'Total Validaciones', 
      value: safeValidations.length,
      fill: '#3b82f6'
    },
    { 
      name: 'Protocolos', 
      value: protocolsCount,
      fill: '#f59e0b'
    },
    { 
      name: 'Reportes', 
      value: reportsCount,
      fill: '#8b5cf6'
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Estadísticas Generales - Gráfico Mejorado */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">📊 Estadísticas Generales</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              productos: { label: 'Productos Validados', color: '#10b981' },
              validaciones: { label: 'Total Validaciones', color: '#3b82f6' },
              protocolos: { label: 'Protocolos', color: '#f59e0b' },
              reportes: { label: 'Reportes', color: '#8b5cf6' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generalStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {generalStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const total = generalStats.reduce((sum, item) => sum + item.value, 0);
                      const percentage = ((data.value / total) * 100).toFixed(1);
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-bold text-gray-900">{data.name}</p>
                          <p className="text-blue-600">Cantidad: {data.value}</p>
                          <p className="text-green-600">Porcentaje: {percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Validaciones por Tipo - Gráfico de Barras Mejorado */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">🔬 Validaciones por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              procesos: { label: 'Procesos', color: '#3b82f6' },
              metodos: { label: 'Métodos Analíticos', color: '#10b981' },
              limpieza: { label: 'Limpieza', color: '#f59e0b' },
              sistemas: { label: 'Sistemas', color: '#8b5cf6' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={validationsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  textAnchor="middle"
                />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-bold">{label}</p>
                          <p className="text-blue-600">Validaciones: {payload[0].value}</p>
                          <p className="text-green-600">Porcentaje: {payload[0].payload.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Validaciones por Estado - Gráfico de Dona */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">📋 Estado de Validaciones</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              status: { label: 'Estado', color: '#8b5cf6' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={validationsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {validationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Equipos Más Utilizados */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-orange-50">
        <CardHeader className="text-center bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">🔧 Equipos Más Utilizados</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              equipment: { label: 'Equipo', color: '#f97316' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topEquipment} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Validaciones por Subcategoría */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-cyan-50">
        <CardHeader className="text-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">📊 Validaciones por Subcategoría</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              subcategory: { label: 'Subcategoría', color: '#06b6d4' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={validationsBySubcategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  textAnchor="middle"
                  angle={-45}
                />
                <YAxis />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Evolución Temporal - Gráfico de Líneas */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-pink-50 lg:col-span-2 xl:col-span-3">
        <CardHeader className="text-center bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
          <CardTitle className="text-lg font-bold">📈 Evolución Temporal (Últimos 6 Meses)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <ChartContainer
            config={{
              validations: { label: 'Total Validaciones', color: '#3b82f6' },
              validated: { label: 'Productos Validados', color: '#10b981' },
              protocols: { label: 'Protocolos', color: '#f59e0b' },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validationsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="validations" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Total Validaciones"
                />
                <Line 
                  type="monotone" 
                  dataKey="validated" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Productos Validados"
                />
                <Line 
                  type="monotone" 
                  dataKey="protocols" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Protocolos"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCharts;