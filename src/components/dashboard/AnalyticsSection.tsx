
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, ClipboardCheck, FileBarChart } from 'lucide-react';
import { Validation } from '@/types/validation';
import AnalyticsCharts from './AnalyticsCharts';

interface AnalyticsSectionProps {
  validations: Validation[];
}

const AnalyticsSection = ({ validations = [] }: AnalyticsSectionProps) => {
  const [analyticsType, setAnalyticsType] = useState<'validations' | 'protocols' | 'reports'>('validations');

  // Ensure validations is always an array
  const safeValidations = Array.isArray(validations) ? validations : [];

  const validationsWithProtocols = safeValidations.filter(v => v.files && v.files.length > 0);
  const validationsWithoutProtocols = safeValidations.filter(v => !v.files || v.files.length === 0);
  const reportsData = safeValidations.filter(v => v.status === 'validado' || v.status === 'primera_revision' || v.status === 'segunda_revision');

  const getAnalyticsData = () => {
    switch (analyticsType) {
      case 'protocols':
        return validationsWithProtocols;
      case 'reports':
        return reportsData;
      default:
        return safeValidations;
    }
  };

  const getAnalyticsTitle = () => {
    switch (analyticsType) {
      case 'protocols':
        return 'Analíticas de Protocolos Realizados';
      case 'reports':
        return 'Analíticas de Reportes de Validación';
      default:
        return 'Analíticas de Validaciones';
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              {getAnalyticsTitle()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={analyticsType === 'validations' ? 'default' : 'outline'}
                onClick={() => setAnalyticsType('validations')}
                size="sm"
                className="flex items-center"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Validaciones ({safeValidations.length})
              </Button>
              <Button
                variant={analyticsType === 'protocols' ? 'default' : 'outline'}
                onClick={() => setAnalyticsType('protocols')}
                size="sm"
                className="flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Protocolos ({validationsWithProtocols.length})
              </Button>
              <Button
                variant={analyticsType === 'reports' ? 'default' : 'outline'}
                onClick={() => setAnalyticsType('reports')}
                size="sm"
                className="flex items-center"
              >
                <FileBarChart className="mr-2 h-4 w-4" />
                Reportes ({reportsData.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              {analyticsType === 'protocols' 
                ? `Análisis de ${validationsWithProtocols.length} validaciones con protocolos documentados`
                : analyticsType === 'reports'
                ? `Análisis de ${reportsData.length} reportes de validación completados`
                : `Análisis de ${safeValidations.length} validaciones totales en el sistema`
              }
            </p>
          </div>
          <AnalyticsCharts validations={getAnalyticsData()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
