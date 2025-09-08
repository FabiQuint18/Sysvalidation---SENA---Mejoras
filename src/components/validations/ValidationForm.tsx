import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ValidationType, ValidationStatus, Validation, calculateExpiryDate, ProductType } from '@/types/validation';
import { useLanguage } from '@/contexts/LanguageContext';

interface ValidationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (validation: any) => void;
  editingValidation?: Validation | null;
}

const ValidationForm = ({ isOpen, onClose, onSubmit, editingValidation }: ValidationFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    validation_code: '',
    product_code: '',
    product_name: '',
    material_type: '',
    validation_type: '',
    subcategory: '',
    equipment_type: '',
    status: '',
    issue_date: '',
    expiry_date: '',
  });

  useEffect(() => {
    if (editingValidation) {
      setFormData({
        validation_code: editingValidation.validation_code,
        product_code: editingValidation.product?.code || '',
        product_name: editingValidation.product?.name || '',
        material_type: editingValidation.product?.type || '',
        validation_type: editingValidation.validation_type,
        subcategory: editingValidation.subcategory || '',
        equipment_type: editingValidation.equipment_type,
        status: editingValidation.status,
        issue_date: editingValidation.issue_date,
        expiry_date: editingValidation.expiry_date,
      });
    } else {
      setFormData({
        validation_code: '',
        product_code: '',
        product_name: '',
        material_type: '',
        validation_type: '',
        subcategory: '',
        equipment_type: '',
        status: '',
        issue_date: '',
        expiry_date: '',
      });
    }
  }, [editingValidation, isOpen]);

  const getMaterialTypeOptions = () => {
    return [
      { value: 'materia_prima', label: t('material_types.raw_material') },
      { value: 'material_empaque', label: t('material_types.packaging_material') },
      { value: 'producto_terminado', label: t('material_types.finished_product') },
      { value: 'granel', label: t('material_types.bulk') },
    ];
  };

  const getSubcategoryOptions = (validationType: string) => {
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

  const getStatusOptions = (): Array<{value: ValidationStatus, label: string}> => {
    return [
      { value: 'validado', label: t('status.validado') },
      { value: 'proximo_vencer', label: t('status.proximo') },
      { value: 'vencido', label: t('status.vencido') },
      { value: 'en_revalidacion', label: t('status.revalidacion') },
      { value: 'en_validacion', label: t('status.en_validacion') },
      { value: 'por_revalidar', label: t('status.por_revalidar') },
      { value: 'primera_revision', label: t('status.primera_revision') },
      { value: 'segunda_revision', label: t('status.segunda_revision') },
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.validation_code || !formData.validation_type || !formData.status) {
      toast({
        title: t('common.error'),
        description: "Por favor completa los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      ...formData
    };

    onSubmit(submissionData);
    onClose();
    
    toast({
      title: editingValidation ? "Validación Actualizada" : "Validación Creada",
      description: `${editingValidation ? 'Actualización de' : 'Nueva'} validación ${formData.validation_code} ${editingValidation ? 'actualizada' : 'creada'} exitosamente`,
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
        // Reset subcategory when validation type changes
        ...(field === 'validation_type' ? { subcategory: '' } : {})
      };


      return newData;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-popover border border-border">
        <DialogHeader>
          <DialogTitle>
            {editingValidation ? t('common.edit') + ' ' + t('validations.validation_type') : t('validations.new')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validation_code">{t('validations.validation_code')} *</Label>
              <Input
                id="validation_code"
                value={formData.validation_code}
                onChange={(e) => updateField('validation_code', e.target.value)}
                placeholder="VAL-XXX-2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="product_code">{t('validations.product_code')}</Label>
              <Input
                id="product_code"
                value={formData.product_code}
                onChange={(e) => updateField('product_code', e.target.value)}
                placeholder="PT-XXX"
              />
            </div>

            <div>
              <Label htmlFor="product_name">{t('validations.material_name')}</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => updateField('product_name', e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <Label htmlFor="material_type">{t('validations.material_type')}</Label>
              <Select
                value={formData.material_type}
                onValueChange={(value) => updateField('material_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('validations.select_type')} />
                </SelectTrigger>
                <SelectContent>
                  {getMaterialTypeOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validation_type">{t('validations.validation_type')} *</Label>
              <Select
                value={formData.validation_type}
                onValueChange={(value) => updateField('validation_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('validations.select_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="procesos">{t('validations.processes')}</SelectItem>
                  <SelectItem value="metodos_analiticos">{t('validations.analytical_methods')}</SelectItem>
                  <SelectItem value="limpieza">{t('validations.cleaning')}</SelectItem>
                  <SelectItem value="sistemas_computarizados">{t('validations.computerized_systems')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subcategory">{t('validations.subcategory')}</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => updateField('subcategory', value)}
                disabled={!formData.validation_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('validations.select_subcategory')} />
                </SelectTrigger>
                <SelectContent>
                  {getSubcategoryOptions(formData.validation_type).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="equipment_type">{t('validations.equipment')}</Label>
              <Select
                value={formData.equipment_type}
                onValueChange={(value) => updateField('equipment_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('validations.select_equipment')} />
                </SelectTrigger>
                <SelectContent>
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
              <Label htmlFor="status">{t('common.status')} *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateField('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('validations.select_status')} />
                </SelectTrigger>
                <SelectContent>
                  {getStatusOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issue_date">{t('validations.validity_date')}</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => updateField('issue_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="expiry_date">{t('validations.expiry_date')}</Label>
              <Input
                id="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => updateField('expiry_date', e.target.value)}
                placeholder="Seleccionar fecha de vencimiento"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {editingValidation ? t('common.save') : t('common.add')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationForm;
