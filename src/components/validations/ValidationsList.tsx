import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Validation, UserRole, ValidationFilters as ValidationFiltersType } from '@/types/validation';
import { formatDate, getDaysUntilExpiry } from '@/utils/dateUtils';
import { Search, Edit, Trash2, Plus, FileText, ChevronDown, Eye, Upload, Printer, Download, FileSpreadsheet, ArrowUpDown, SortAsc, SortDesc, Calendar, Variable as AlphabeticalVariant } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ValidationFilters from '@/components/filters/ValidationFilters';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ValidationsListProps {
  validations: Validation[];
  onEdit: (validation: Validation) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onFileUpload: (validationId: string, file: File) => void;
  onFileDelete: (fileId: string) => void;
  onImportExcel: (data: any[]) => void;
  userRole?: UserRole;
}

type SortOption = 'alphabetical-az' | 'alphabetical-za' | 'date-oldest' | 'date-newest';

const ValidationsList = ({ 
  validations, 
  onEdit, 
  onDelete, 
  onAdd, 
  onFileUpload, 
  onFileDelete,
  onImportExcel,
  userRole = 'analista'
}: ValidationsListProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ValidationFiltersType>({});
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical-az');

  // Aplicar filtros y ordenamiento
  const applyFiltersAndSort = (validationsList: Validation[]): Validation[] => {
    let filtered = validationsList;

    // Aplicar búsqueda
    if (searchTerm) {
      filtered = filtered.filter(validation =>
        validation.validation_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        validation.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        validation.product?.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtros adicionales
    if (filters.validationType) {
      filtered = filtered.filter(v => v.validation_type === filters.validationType);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(v => v.subcategory === filters.subcategory);
    }

    if (filters.validationCode) {
      filtered = filtered.filter(v => 
        v.validation_code.toLowerCase().includes(filters.validationCode.toLowerCase())
      );
    }

    if (filters.productCode) {
      filtered = filtered.filter(v => 
        v.product?.code.toLowerCase().includes(filters.productCode.toLowerCase())
      );
    }

    if (filters.equipmentType) {
      filtered = filtered.filter(v => v.equipment_type === filters.equipmentType);
    }

    if (filters.status) {
      filtered = filtered.filter(v => v.status === filters.status);
    }

    // Aplicar ordenamiento
    switch (sortOption) {
      case 'alphabetical-az':
        filtered.sort((a, b) => (a.product?.name || '').localeCompare(b.product?.name || ''));
        break;
      case 'alphabetical-za':
        filtered.sort((a, b) => (b.product?.name || '').localeCompare(a.product?.name || ''));
        break;
      case 'date-oldest':
        filtered.sort((a, b) => new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime());
        break;
      case 'date-newest':
        filtered.sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime());
        break;
    }

    return filtered;
  };

  const filteredValidations = applyFiltersAndSort(validations);

  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos Excel (.xlsx, .xls)",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Excel data loaded:', jsonData);

      // Mapear datos del Excel al formato esperado
      const mappedData = jsonData.map((row: any, index: number) => {
        // Mapear tipo de material desde Excel
        const excelMaterialType = row['Tipo de Material'] || row['material_type'] || '';
        let mappedMaterialType = 'producto_terminado'; // valor por defecto
        
        // Mapear tipos de material desde Excel a los valores del sistema
        if (excelMaterialType) {
          const materialTypeLower = excelMaterialType.toLowerCase();
          if (materialTypeLower.includes('materia') || materialTypeLower.includes('raw')) {
            mappedMaterialType = 'materia_prima';
          } else if (materialTypeLower.includes('empaque') || materialTypeLower.includes('packaging')) {
            mappedMaterialType = 'material_empaque';
          } else if (materialTypeLower.includes('terminado') || materialTypeLower.includes('finished')) {
            mappedMaterialType = 'producto_terminado';
          } else if (materialTypeLower.includes('granel') || materialTypeLower.includes('bulk')) {
            mappedMaterialType = 'granel';
          }
        }

        return {
          validation_code: row['Código de Validación'] || row['validation_code'] || `VAL-EXCEL-${index + 1}`,
          product_code: row['Código de Producto/MP'] || row['product_code'] || `PT-EXCEL-${index + 1}`,
          product_name: row['Producto/Materia Prima'] || row['product_name'] || `Producto Excel ${index + 1}`,
          material_type: mappedMaterialType,
          validation_type: row['Tipo de Validación'] || row['validation_type'] || 'metodos_analiticos',
          subcategory: row['Subcategoría'] || row['subcategory'] || 'valoracion',
          equipment_type: row['Equipo'] || row['equipment_type'] || 'HPLC',
          status: row['Estado'] || row['status'] || 'validado',
          issue_date: formatExcelDate(row['Fecha de Vigencia'] || row['issue_date']) || new Date().toISOString().split('T')[0],
          expiry_date: formatExcelDate(row['Fecha de Vencimiento'] || row['expiry_date']) || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
      });

      console.log('Mapped data:', mappedData);
      onImportExcel(mappedData);
      
      toast({
        title: "✅ Importación Exitosa",
        description: `Se procesaron ${mappedData.length} validaciones desde Excel. Los tipos de material y fechas han sido mapeados correctamente.`,
      });
    } catch (error) {
      console.error('Error processing Excel:', error);
      toast({
        title: "Error de Importación",
        description: "Error al procesar el archivo Excel. Verifique el formato.",
        variant: "destructive",
      });
    }
    
    // Reset input
    event.target.value = '';
  };

  const formatExcelDate = (dateValue: any): string => {
    if (!dateValue) return '';
    
    // Si ya está en formato YYYY-MM-DD
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    
    // Si es un número de Excel (días desde 1900-01-01)
    if (typeof dateValue === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const date = new Date(excelEpoch.getTime() + (dateValue - 2) * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    }
    
    // Si es una fecha en formato DD/MM/YYYY o similar
    if (typeof dateValue === 'string') {
      // Intentar diferentes formatos de fecha
      const dateFormats = [
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // DD/MM/YYYY o MM/DD/YYYY
        /^\d{4}-\d{1,2}-\d{1,2}$/, // YYYY-MM-DD
        /^\d{1,2}-\d{1,2}-\d{4}$/, // DD-MM-YYYY
        /^\d{4}\/\d{1,2}\/\d{1,2}$/, // YYYY/MM/DD
      ];
      
      for (const format of dateFormats) {
        if (format.test(dateValue)) {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }
      
      // Si es un objeto Date de Excel
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
    }
    
    return '';
  };

  const handlePrintPreview = () => {
    const content = generatePrintableContent(filteredValidations);
    const title = getReportTitle();
    
    setPreviewContent(content);
    setPreviewTitle(title);
    setShowPreview(true);
  };

  const handlePrintFromPreview = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(previewContent);
      printWindow.document.close();
      printWindow.print();
    }
    setShowPreview(false);
  };

  const handleDownloadPDF = () => {
    const printContent = generatePrintableContent(filteredValidations);
    const blob = new Blob([printContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const fileName = getFileName();
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileName = () => {
    if (filters.subcategory && filters.validationType) {
      return `validaciones_${filters.validationType}_${filters.subcategory}`;
    } else if (filters.validationType) {
      return `validaciones_${filters.validationType}`;
    } else {
      return 'validaciones_todas';
    }
  };

  const getReportTitle = () => {
    if (filters.subcategory && filters.validationType) {
      const typeLabel = getValidationTypeLabel(filters.validationType);
      const subcategoryLabel = getSubcategoryLabel(filters.validationType, filters.subcategory);
      return `Listado de Validaciones ${typeLabel} - ${subcategoryLabel}`;
    } else if (filters.validationType) {
      return `Listado de Validaciones ${getValidationTypeLabel(filters.validationType)}`;
    } else {
      return 'Listado de Todas las Validaciones';
    }
  };

  const generatePrintableContent = (validationsList: Validation[]) => {
    const reportTitle = getReportTitle();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 20px; 
              background: white;
              color: #333;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 15px;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #667eea;
              padding-bottom: 20px;
            }
            .logo { 
              width: 120px; 
              height: auto; 
              margin-bottom: 15px;
              border-radius: 10px;
            }
            h1 { 
              color: #2d3748; 
              text-align: center; 
              margin: 20px 0; 
              font-size: 28px;
              font-weight: 700;
            }
            .info { 
              margin-bottom: 30px; 
              text-align: center;
              background: #f7fafc;
              padding: 20px;
              border-radius: 10px;
              border-left: 5px solid #667eea;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              font-size: 11px;
              background: white;
              border-radius: 10px;
              overflow: hidden;
            }
            th, td { 
              border: 1px solid #e2e8f0; 
              padding: 12px 8px; 
              text-align: center; 
            }
            th { 
              background: #667eea;
              color: white;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .status-text { 
              padding: 4px 8px; 
              border-radius: 20px; 
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              background: transparent !important;
              color: #333 !important;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #718096;
              font-size: 12px;
              border-top: 2px solid #e2e8f0;
              padding-top: 20px;
            }
            @media print {
              body { 
                margin: 10px; 
                background: white;
              }
              .container {
                box-shadow: none;
                border-radius: 0;
              }
              .header { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMTIwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGF0dGVybiBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM3NjRiYTI7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8dGV4dCB4PSI2MCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FTVBSRVNBPC90ZXh0Pgo8dGV4dCB4PSI2MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNpc3RlbWEgZGUgVmFsaWRhY2lvbmVzPC90ZXh0Pgo8L3N2Zz4K" alt="Logo Empresa" class="logo" />
              <h1>${reportTitle}</h1>
            </div>
            <div class="info">
              <p><strong>📅 Fecha de generación:</strong> ${new Date().toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p><strong>📊 Total de registros:</strong> ${validationsList.length}</p>
              <p><strong>🏢 Sistema de Gestión de Validaciones Farmacéuticas</strong></p>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Código de Validación</th>
                  <th>Producto/Materia Prima</th>
                  <th>Código de Producto/MP</th>
                  <th>Tipo de Validación</th>
                  <th>Subcategoría</th>
                  <th>Equipo</th>
                  <th>Estado</th>
                  <th>Fecha de Vigencia</th>
                  <th>Fecha de Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                ${validationsList.map((validation, index) => `
                  <tr>
                    <td><strong>${index + 1}</strong></td>
                    <td><strong>${validation.validation_code}</strong></td>
                    <td>${validation.product?.name || 'N/A'}</td>
                    <td>${validation.product?.code || 'N/A'}</td>
                    <td>${getValidationTypeLabel(validation.validation_type)}</td>
                    <td>${getSubcategoryLabel(validation.validation_type, validation.subcategory)}</td>
                    <td><strong>${validation.equipment_type}</strong></td>
                    <td><span class="status-text">${validation.status.replace(/_/g, ' ')}</span></td>
                    <td>${formatDate(validation.issue_date)}</td>
                    <td>${formatDate(validation.expiry_date)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="footer">
              <p>🔒 Documento generado automáticamente por el Sistema de Gestión de Validaciones</p>
              <p>📧 Para más información contacte al administrador del sistema</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const getStatusBadge = (status: string, expiryDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    switch (status) {
      case 'validado':
        return <Badge className="bg-green-100 text-green-800">{t('status.validado')}</Badge>;
      case 'proximo_vencer':
        return <Badge className="bg-yellow-100 text-yellow-800">{t('status.proximo')} ({daysUntilExpiry} días)</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800">{t('status.vencido')}</Badge>;
      case 'en_revalidacion':
        return <Badge className="bg-blue-100 text-blue-800">{t('status.revalidacion')}</Badge>;
      case 'en_validacion':
        return <Badge className="bg-purple-100 text-purple-800">{t('status.en_validacion')}</Badge>;
      case 'por_revalidar':
        return <Badge className="bg-orange-100 text-orange-800">{t('status.por_revalidar')}</Badge>;
      case 'primera_revision':
        return <Badge className="bg-cyan-100 text-cyan-800">{t('status.primera_revision')}</Badge>;
      case 'segunda_revision':
        return <Badge className="bg-indigo-100 text-indigo-800">{t('status.segunda_revision')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getValidationTypeLabel = (type: string) => {
    switch (type) {
      case 'procesos':
        return 'Procesos';
      case 'limpieza':
        return 'Limpieza';
      case 'metodos_analiticos':
        return 'Métodos Analíticos';
      case 'sistemas_computarizados':
        return 'Sistemas Computarizados';
      default:
        return type;
    }
  };

  const getSubcategoryLabel = (validationType: string, subcategory?: string) => {
    if (!subcategory) return 'N/A';
    
    switch (validationType) {
      case 'procesos':
        return subcategory === 'fabricacion' ? t('validations.manufacturing') : 
               subcategory === 'empaque' ? t('validations.packaging') : subcategory;
      case 'metodos_analiticos':
        switch (subcategory) {
          case 'valoracion': return t('validations.assay');
          case 'disolucion': return t('validations.dissolution');
          case 'impurezas': return t('validations.impurities');
          case 'uniformidad_unidades_dosificacion': return t('validations.uniformity');
          case 'identificacion': return t('validations.identification');
          case 'trazas': return t('validations.traces');
          default: return subcategory;
        }
      case 'limpieza':
        return t('validations.not_applicable');
      default:
        return subcategory;
    }
  };

  const getMaterialTypeLabel = (type: string) => {
    switch (type) {
      case 'producto_terminado':
        return t('material_types.finished_product');
      case 'materia_prima':
        return t('material_types.raw_material');
      case 'material_empaque':
        return t('material_types.packaging_material');
      case 'granel':
        return t('material_types.bulk');
      default:
        return type;
    }
  };

  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'alphabetical-az':
        return 'Alfabéticamente (A-Z)';
      case 'alphabetical-za':
        return 'Alfabéticamente (Z-A)';
      case 'date-oldest':
        return 'Fecha: Más antiguo a más reciente';
      case 'date-newest':
        return 'Fecha: Más reciente a más antiguo';
      default:
        return 'Ordenar';
    }
  };

  const FilesDropdown = ({ validation }: { validation: Validation }) => {
    const files = validation.files || [];
    const canUploadFiles = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista';
    const canDelete = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista';

    if (files.length === 0 && !canUploadFiles) {
      return <span className="text-sm text-muted-foreground">Sin archivos</span>;
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        {files.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                <FileText className="h-4 w-4 mr-1" />
                {files.length}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50">
              {files.map((file) => (
                <div key={file.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-900">{file.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.file_url, '_blank')}
                        title="Ver"
                        className="hover:bg-blue-100"
                      >
                        <Eye className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.file_url;
                          link.target = '_blank';
                          link.download = file.file_name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        title="Imprimir"
                        className="hover:bg-green-100"
                      >
                        <Printer className="h-3 w-3 text-green-600" />
                      </Button>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFileDelete(file.id)}
                          title="Eliminar"
                          className="hover:bg-red-100"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {canUploadFiles && (
          <>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(validation.id, file);
              }}
              className="hidden"
              id={`file-upload-${validation.id}`}
            />
            <label htmlFor={`file-upload-${validation.id}`}>
              <Button variant="outline" size="sm" asChild className="bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700">
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
            </label>
          </>
        )}
      </div>
    );
  };

  // Control de acceso por roles
  const canEdit = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista';
  const canDelete = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista';
  const canAdd = userRole === 'administrador' || userRole === 'coordinador' || userRole === 'analista';

  return (
    <div className="space-y-6">
      {/* Filtros de validaciones */}
      <ValidationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({})}
      />

      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">{t('validations.list')}</CardTitle>
              <CardDescription className="text-blue-100">
                {t('validations.manage')}
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              {/* Importar Excel */}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelImport}
                className="hidden"
                id="excel-import"
              />
              <label htmlFor="excel-import">
                <Button variant="secondary" className="gap-2 bg-[#1D6F42] hover:bg-[#0F5132] text-white border-0 shadow-lg" asChild>
                  <span>
                    <FileSpreadsheet className="h-4 w-4" />
                    Importar Excel
                  </span>
                </Button>
              </label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="gap-2 bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200">
                    <Printer className="h-4 w-4" />
                    Imprimir
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border border-gray-200">
                  <DropdownMenuItem onClick={handlePrintPreview}>
                    <Eye className="h-4 w-4 mr-2" />
                    Vista Previa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handlePrintFromPreview}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadPDF}>
                    <Download className="h-4 w-4 mr-2" />
                    Descargar PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {canAdd && (
                <Button onClick={onAdd} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('validations.new')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('validations.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm border-2 border-blue-200 focus:border-blue-500 rounded-lg"
              />
              
              {/* Botón de Ordenar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-2 border-purple-200 hover:bg-purple-50">
                    <ArrowUpDown className="h-4 w-4" />
                    Ordenar
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border border-gray-200">
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                      <AlphabeticalVariant className="h-4 w-4 mr-2" />
                      Alfabéticamente
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setSortOption('alphabetical-az')}>
                        <SortAsc className="h-4 w-4 mr-2" />
                        A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('alphabetical-za')}>
                        <SortDesc className="h-4 w-4 mr-2" />
                        Z-A
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Por Fecha Vigencia
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setSortOption('date-oldest')}>
                        <SortAsc className="h-4 w-4 mr-2" />
                        De lo más antiguo a lo más reciente
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOption('date-newest')}>
                        <SortDesc className="h-4 w-4 mr-2" />
                        De lo más reciente a lo más antiguo
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <TableHead className="text-center font-semibold text-gray-700">Número</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.validation_code')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.material_name')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">Código de Producto/MP</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.material_type')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.validation_type')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.subcategory')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.equipment')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.status')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.validity_date')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.expiry_date')}</TableHead>
                    <TableHead className="text-center font-semibold text-gray-700">{t('validations.files')}</TableHead>
                    {(canEdit || canDelete) && <TableHead className="text-center font-semibold text-gray-700">{t('validations.actions')}</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValidations.map((validation, index) => (
                    <TableRow key={validation.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <TableCell className="text-center font-bold text-blue-700">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-center font-medium text-blue-700">
                        {validation.validation_code}
                      </TableCell>
                      <TableCell className="text-center">
                        <div>
                          <div className="font-medium text-gray-900">{validation.product?.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium text-purple-700">
                        {validation.product?.code}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                          {getMaterialTypeLabel(validation.product?.type || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          {getValidationTypeLabel(validation.validation_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{getSubcategoryLabel(validation.validation_type, validation.subcategory)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {validation.equipment_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(validation.status, validation.expiry_date)}</TableCell>
                      <TableCell className="text-center text-gray-700">{formatDate(validation.issue_date)}</TableCell>
                      <TableCell className="text-center text-gray-700">{formatDate(validation.expiry_date)}</TableCell>
                      <TableCell className="text-center">
                        <FilesDropdown validation={validation} />
                      </TableCell>
                      {(canEdit || canDelete) && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(validation)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(validation.id)}
                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 border-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredValidations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? t('validations.no_results') : t('validations.no_validations')}
                </h3>
                <p className="text-sm">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primera validación'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vista Previa Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">Vista Previa - {previewTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-lg bg-white">
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </div>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePrintFromPreview} className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidationsList;