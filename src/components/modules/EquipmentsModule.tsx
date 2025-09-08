
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, Plus, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serial: string;
  location: string;
  created_at: string;
}

const EquipmentsModule = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    model: '',
    serial: '',
    location: ''
  });

  // Load equipments from localStorage on component mount
  useEffect(() => {
    const savedEquipments = localStorage.getItem('systemEquipments');
    if (savedEquipments) {
      setEquipments(JSON.parse(savedEquipments));
    }
  }, []);

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setFormData({ name: '', type: '', model: '', serial: '', location: '' });
    setShowForm(true);
  };

  const handleEditEquipment = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    setFormData({
      name: equipment.name,
      type: equipment.type,
      model: equipment.model,
      serial: equipment.serial,
      location: equipment.location
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.type || !formData.model || !formData.serial) {
      toast({
        title: "Error",
        description: "Todos los campos obligatorios deben ser completados",
        variant: "destructive",
      });
      return;
    }

    // Check if serial already exists (only for new equipment or different equipment)
    if (equipments.some(equipment => 
      equipment.serial === formData.serial && 
      (!editingEquipment || equipment.id !== editingEquipment.id)
    )) {
      toast({
        title: "Error",
        description: "Ya existe un equipo con este número de serie",
        variant: "destructive",
      });
      return;
    }

    let updatedEquipments;
    
    if (editingEquipment) {
      // Update existing equipment
      updatedEquipments = equipments.map(equipment =>
        equipment.id === editingEquipment.id
          ? {
              ...equipment,
              name: formData.name,
              type: formData.type,
              model: formData.model,
              serial: formData.serial,
              location: formData.location
            }
          : equipment
      );
    } else {
      // Create new equipment
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        model: formData.model,
        serial: formData.serial,
        location: formData.location,
        created_at: new Date().toISOString()
      };
      updatedEquipments = [...equipments, newEquipment];
    }

    setEquipments(updatedEquipments);
    localStorage.setItem('systemEquipments', JSON.stringify(updatedEquipments));

    toast({
      title: editingEquipment ? "Equipo Actualizado" : "Equipo Agregado",
      description: `El equipo ${formData.name} ha sido ${editingEquipment ? 'actualizado' : 'registrado'} exitosamente`,
    });
    
    setShowForm(false);
    setEditingEquipment(null);
    setFormData({ name: '', type: '', model: '', serial: '', location: '' });
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingEquipment(null);
    setFormData({ name: '', type: '', model: '', serial: '', location: '' });
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    const updatedEquipments = equipments.filter(equipment => equipment.id !== equipmentId);
    setEquipments(updatedEquipments);
    localStorage.setItem('systemEquipments', JSON.stringify(updatedEquipments));
    
    toast({
      title: "Equipo Eliminado",
      description: "Equipo eliminado exitosamente",
    });
  };

  const getEquipmentStats = () => {
    const hplc = equipments.filter(e => e.type === 'HPLC').length;
    const gc = equipments.filter(e => e.type === 'GC').length;
    const uvvis = equipments.filter(e => e.type === 'UV-VIS').length;
    
    return { hplc, gc, uvvis };
  };

  const stats = getEquipmentStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('equipments.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('equipments.subtitle')}
          </p>
        </div>
        <Button onClick={handleAddEquipment}>
          <Plus className="mr-2 h-4 w-4" />
          {t('equipments.add')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              HPLC
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hplc}</div>
            <p className="text-xs text-muted-foreground">
              Equipos Registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              GC
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gc}</div>
            <p className="text-xs text-muted-foreground">
              Equipos Registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              UV-VIS
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uvvis}</div>
            <p className="text-xs text-muted-foreground">
              Equipos Registrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('equipments.list')}</CardTitle>
          <CardDescription>
            Lista de equipos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {equipments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Número de Serie</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell className="font-medium">{equipment.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{equipment.type}</Badge>
                      </TableCell>
                      <TableCell>{equipment.model}</TableCell>
                      <TableCell>{equipment.serial}</TableCell>
                      <TableCell>{equipment.location}</TableCell>
                      <TableCell>{new Date(equipment.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit 
                              className="h-4 w-4" 
                              onClick={() => handleEditEquipment(equipment)}
                            />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteEquipment(equipment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay equipos registrados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-popover border border-border">
          <DialogHeader>
            <DialogTitle className="text-center">
              {editingEquipment ? 'Editar Equipo' : 'Agregar Nuevo Equipo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Del Equipo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="HPLC-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo De Equipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
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
              <Label htmlFor="model">Modelo</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Agilent 1260"
                required
              />
            </div>
            <div>
              <Label htmlFor="serial">Número De Serie</Label>
              <Input
                id="serial"
                value={formData.serial}
                onChange={(e) => setFormData({ ...formData, serial: e.target.value })}
                placeholder="ABC123456"
                required
              />
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Laboratorio A"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingEquipment ? 'Actualizar Equipo' : t('equipments.add')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EquipmentsModule;
