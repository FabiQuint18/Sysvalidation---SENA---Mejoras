import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { ValidationFilters, ValidationType, ProcessSubcategory, AnalyticalSubcategory, CleaningSubcategory, ComputerizedSubcategory } from '@/types/validation';
import { useLanguage } from '@/contexts/LanguageContext';

interface ValidationFiltersProps {
  filters: ValidationFilters;
  onFiltersChange: (filters: ValidationFilters) => void;
  onClearFilters: () => void;
}

const ValidationFiltersComponent = ({ filters, onFiltersChange, onClearFilters }: ValidationFiltersProps) => {
  const { t } = useLanguage();

  const updateFilter = (key: keyof ValidationFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' || value === '' ? undefined : value,
    };

    // Clear subcategory when validation type changes
    if (key === 'validationType' && value !== filters.validationType) {
      newFilters.subcategory = undefined;
    }

    onFiltersChange(newFilters);
  };

  const getSubcategoryOptions = (validationType?: ValidationType) => {
    switch (validationType) {
      case 'procesos':
        return [
          { value: 'fabricacion', label: t('validations.manufacturing') },
          { value: 'empaque', label: t('validations.packaging') },
        ];
      case 'metodos_analiticos':
        return [
          { value: 'valoracion', label: t('validations.assay') },
          { value: 'disolucion', label: t('validations.dissolution') },
          { value: 'impurezas', label: t('validations.impurities') },
          { value: 'uniformidad_unidades_dosificacion', label: t('validations.uniformity') },
          { value: 'identificacion', label: t('validations.identification') },
          { value: 'trazas', label: t('validations.traces') },
        ];
      case 'limpieza':
        return [
          { value: 'no_aplica', label: t('validations.not_applicable') },
        ];
      case 'sistemas_computarizados':
        return [
          { value: 'validacion_inicial', label: t('validations.initial_validation') },
          { value: 'revalidacion_periodica', label: t('validations.periodic_revalidation') },
        ];
      default:
        return [];
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            {t('validations.search_filters')}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            {t('validations.clear_filters')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="validation-type">{t('validations.validation_type')}</Label>
            <Select
              value={filters.validationType || 'all'}
              onValueChange={(value) => updateFilter('validationType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('validations.select_type')} />
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

          <div>
            <Label htmlFor="subcategory">{t('validations.subcategory')}</Label>
            <Select
              value={filters.subcategory || 'all'}
              onValueChange={(value) => updateFilter('subcategory', value)}
              disabled={!filters.validationType}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('validations.select_subcategory')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {getSubcategoryOptions(filters.validationType).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="validation-code">{t('validations.validation_code')}</Label>
            <Input
              id="validation-code"
              placeholder={t('validations.search_by_code')}
              value={filters.validationCode || ''}
              onChange={(e) => updateFilter('validationCode', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="product-code">{t('validations.product_code')}</Label>
            <Input
              id="product-code"
              placeholder={t('validations.search_by_code')}
              value={filters.productCode || ''}
              onChange={(e) => updateFilter('productCode', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="material-type">{t('validations.material_type')}</Label>
            <Select
              value={filters.materialType || 'all'}
              onValueChange={(value) => updateFilter('materialType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('validations.select_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="materia_prima">{t('material_types.raw_material')}</SelectItem>
                <SelectItem value="producto_terminado">{t('material_types.finished_product')}</SelectItem>
                <SelectItem value="material_empaque">{t('material_types.packaging_material')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="equipment-type">{t('validations.equipment')}</Label>
            <Select
              value={filters.equipmentType || 'all'}
              onValueChange={(value) => updateFilter('equipmentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('validations.select_equipment')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="HPLC">HPLC</SelectItem>
                <SelectItem value="GC">GC</SelectItem>
                <SelectItem value="UV-VIS">UV-VIS</SelectItem>
                <SelectItem value="NIR">NIR</SelectItem>
                <SelectItem value="RAMAN">RAMAN</SelectItem>
                <SelectItem value="IR">IR</SelectItem>
                <SelectItem value="AA">AA</SelectItem>
                <SelectItem value="Karl Fischer">Karl Fischer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">{t('common.status')}</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('validations.select_status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="validado">{t('status.validado')}</SelectItem>
                <SelectItem value="en_validacion">{t('status.en_validacion')}</SelectItem>
                <SelectItem value="por_revalidar">{t('status.por_revalidar')}</SelectItem>
                <SelectItem value="vencido">{t('status.vencido')}</SelectItem>
                <SelectItem value="proximo_vencer">{t('status.proximo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiry-from">{t('validations.validity_date')}</Label>
            <Input
              id="expiry-from"
              type="date"
              value={filters.expiryDateFrom || ''}
              onChange={(e) => updateFilter('expiryDateFrom', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="expiry-to">{t('validations.expiry_date')}</Label>
            <Input
              id="expiry-to"
              type="date"
              value={filters.expiryDateTo || ''}
              onChange={(e) => updateFilter('expiryDateTo', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationFiltersComponent;