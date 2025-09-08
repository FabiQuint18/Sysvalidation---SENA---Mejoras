
import { useToast } from "@/hooks/use-toast";

export const useExport = () => {
  const { toast } = useToast();

  const exportToExcel = (data: any[], filename: string) => {
    // Simular exportación a Excel
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    
    toast({
      title: "Exportación exitosa",
      description: `Datos exportados a ${filename}.csv`,
    });
  };

  const exportToPowerBI = (data: any[]) => {
    // Simular conexión con Power BI
    const powerBIData = JSON.stringify(data, null, 2);
    downloadFile(powerBIData, 'powerbi-data.json', 'application/json');
    
    toast({
      title: "Datos preparados para Power BI",
      description: "Archivo JSON descargado para importar en Power BI",
    });
  };

  const downloadChart = (chartId: string, filename: string) => {
    // Simular descarga de gráfico como imagen
    toast({
      title: "Descarga iniciada",
      description: `Descargando gráfico: ${filename}`,
    });
  };

  const convertToCSV = (data: any[]): string => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    exportToExcel,
    exportToPowerBI,
    downloadChart,
  };
};
