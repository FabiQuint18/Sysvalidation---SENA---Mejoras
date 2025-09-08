
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, BarChart3, Printer } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { Validation } from '@/types/validation';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExportOptionsProps {
  validations: Validation[];
}

const ExportOptions = ({ validations }: ExportOptionsProps) => {
  const { exportToExcel, exportToPowerBI, downloadChart } = useExport();
  const { t } = useLanguage();

  const handleExportExcel = () => {
    const exportData = validations.map(v => ({
      codigo: v.validation_code,
      producto: v.product?.name || '',
      tipo: v.validation_type,
      equipo: v.equipment_type,
      estado: v.status,
      fecha_emision: v.issue_date,
      fecha_vencimiento: v.expiry_date,
    }));
    
    exportToExcel(exportData, 'validaciones');
  };

  const handleExportPowerBI = () => {
    exportToPowerBI(validations);
  };

  const handleDownloadChart = (chartType: string) => {
    downloadChart(`chart-${chartType}`, `grafico-${chartType}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5" />
          Opciones de Exportación
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button onClick={handleExportExcel} className="flex items-center">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Exportar Excel
          </Button>
          
          <Button onClick={handleExportPowerBI} variant="outline" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Power BI
          </Button>
          
          <Button 
            onClick={() => handleDownloadChart('tipos')} 
            variant="outline" 
            className="flex items-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Gráficos
          </Button>
          
          <Button 
            onClick={() => window.print()} 
            variant="outline" 
            className="flex items-center"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
