
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/types/validation';
import { useToast } from '@/hooks/use-toast';

interface UsersModuleProps {
  userRole?: UserRole;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  last_login?: string;
}

interface Permission {
  module: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface RolePermissions {
  [key: string]: Permission[];
}

const UsersModule = ({ userRole = 'administrador' }: UsersModuleProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showNewUserDialog, setShowNewUserDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    role: 'visualizador' as UserRole,
    password: '',
    confirmPassword: ''
  });

  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('systemUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default users
      const defaultUsers: User[] = [
        {
          id: '0',
          full_name: 'Super Administrador',
          email: 'superadmin@company.com',
          role: 'super_administrador',
          created_at: '2024-01-01T00:00:00Z',
          last_login: '2024-01-15T11:00:00Z'
        },
        {
          id: '1',
          full_name: 'Administrador Sistema',
          email: 'admin@company.com',
          role: 'administrador',
          created_at: '2024-01-01T00:00:00Z',
          last_login: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          full_name: 'Coordinador QA',
          email: 'coordinador@company.com',
          role: 'coordinador',
          created_at: '2024-01-01T00:00:00Z',
          last_login: '2024-01-15T09:15:00Z'
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  // Control de acceso - solo super admin puede hacer CRUD
  const canManageUsers = userRole === 'super_administrador';
  const canViewUsers = userRole === 'super_administrador' || userRole === 'administrador';

  if (!canViewUsers) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Acceso Restringido</CardTitle>
            <CardDescription>
              No tienes permisos para ver este módulo
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const rolePermissions: RolePermissions = {
    super_administrador: [
      { module: 'Dashboard', create: false, read: true, update: false, delete: false },
      { module: 'Validaciones', create: false, read: false, update: false, delete: false },
      { module: 'Productos', create: false, read: false, update: false, delete: false },
      { module: 'Equipos', create: false, read: false, update: false, delete: false },
      { module: 'Usuarios', create: true, read: true, update: true, delete: true },
      { module: 'Seguridad', create: true, read: true, update: true, delete: true },
      { module: 'Configuración', create: false, read: false, update: false, delete: false },
    ],
    administrador: [
      { module: 'Dashboard', create: true, read: true, update: true, delete: true },
      { module: 'Validaciones', create: true, read: true, update: true, delete: true },
      { module: 'Productos', create: true, read: true, update: true, delete: true },
      { module: 'Equipos', create: true, read: true, update: true, delete: true },
      { module: 'Usuarios', create: false, read: true, update: false, delete: false },
      { module: 'Seguridad', create: false, read: true, update: false, delete: false },
      { module: 'Configuración', create: true, read: true, update: true, delete: true },
    ],
    coordinador: [
      { module: 'Dashboard', create: false, read: true, update: false, delete: false },
      { module: 'Validaciones', create: true, read: true, update: true, delete: true },
      { module: 'Productos', create: true, read: true, update: true, delete: false },
      { module: 'Equipos', create: true, read: true, update: true, delete: false },
      { module: 'Usuarios', create: false, read: false, update: false, delete: false },
      { module: 'Seguridad', create: false, read: false, update: false, delete: false },
      { module: 'Configuración', create: false, read: false, update: false, delete: false },
    ],
    analista: [
      { module: 'Dashboard', create: false, read: true, update: false, delete: false },
      { module: 'Validaciones', create: true, read: true, update: true, delete: false },
      { module: 'Productos', create: false, read: true, update: false, delete: false },
      { module: 'Equipos', create: false, read: true, update: false, delete: false },
      { module: 'Usuarios', create: false, read: false, update: false, delete: false },
      { module: 'Seguridad', create: false, read: false, update: false, delete: false },
      { module: 'Configuración', create: false, read: false, update: false, delete: false },
    ],
    visualizador: [
      { module: 'Dashboard', create: false, read: true, update: false, delete: false },
      { module: 'Validaciones', create: false, read: true, update: false, delete: false },
      { module: 'Productos', create: false, read: true, update: false, delete: false },
      { module: 'Equipos', create: false, read: true, update: false, delete: false },
      { module: 'Usuarios', create: false, read: false, update: false, delete: false },
      { module: 'Seguridad', create: false, read: false, update: false, delete: false },
      { module: 'Configuración', create: false, read: false, update: false, delete: false },
    ],
  };

  const validatePassword = (password: string): boolean => {
    // At least 7 characters, 1 uppercase, 1 special character
    const minLength = password.length >= 7;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[*+\-!@#$%^&(){}[\]:;<>,.?~_|]/.test(password);
    
    return minLength && hasUppercase && hasSpecialChar;
  };

  const handleNewUser = () => {
    setShowNewUserDialog(true);
  };

  const handleSaveUser = () => {
    // Validate required fields
    if (!newUser.full_name || !newUser.email || !newUser.password || !newUser.confirmPassword) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    if (!validatePassword(newUser.password)) {
      toast({
        title: "Error",
        description: t('users.password.weak'),
        variant: "destructive",
      });
      return;
    }

    // Validate password confirmation
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Error",
        description: t('users.password.mismatch'),
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email === newUser.email)) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con este correo electrónico",
        variant: "destructive",
      });
      return;
    }

    // Create new user
    const user: User = {
      id: Date.now().toString(),
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      created_at: new Date().toISOString()
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: t('users.created.successfully'),
      description: `Usuario ${newUser.full_name} creado exitosamente`,
    });

    // Reset form and close dialog
    setNewUser({
      full_name: '',
      email: '',
      role: 'visualizador' as UserRole,
      password: '',
      confirmPassword: ''
    });
    setShowNewUserDialog(false);
  };

  const handleCloseDialog = () => {
    setShowNewUserDialog(false);
    setNewUser({
      full_name: '',
      email: '',
      role: 'visualizador' as UserRole,
      password: '',
      confirmPassword: ''
    });
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));
    
    toast({
      title: "Usuario Eliminado",
      description: "Usuario eliminado exitosamente",
    });
  };

  const getActionIcon = (allowed: boolean) => {
    return allowed ? '✓' : '✗';
  };

  const getActionColor = (allowed: boolean) => {
    return allowed ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('users.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('users.subtitle')}
          </p>
        </div>
        {canManageUsers && (
          <Button onClick={handleNewUser}>
            <Plus className="mr-2 h-4 w-4" />
            {t('users.new')}
          </Button>
        )}
      </div>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>{t('users.list')}</CardTitle>
          <CardDescription>
            {t('users.manage')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('users.name')}</TableHead>
                    <TableHead>{t('users.email')}</TableHead>
                    <TableHead>{t('users.role')}</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Último Acceso</TableHead>
                    {canManageUsers && <TableHead>Acciones</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`roles.${user.role}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Nunca'}
                      </TableCell>
                      {canManageUsers && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.email === 'superadmin@company.com'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay usuarios registrados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Matriz de Acceso por Roles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Matriz de Acceso por Roles
          </CardTitle>
          <CardDescription>
            Permisos de cada rol en los diferentes módulos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="text-center">Crear</TableHead>
                  <TableHead className="text-center">Leer</TableHead>
                  <TableHead className="text-center">Actualizar</TableHead>
                  <TableHead className="text-center">Eliminar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(rolePermissions).map(([role, permissions]) =>
                  permissions.map((permission, index) => (
                    <TableRow key={`${role}-${permission.module}`}>
                      {index === 0 && (
                        <TableCell rowSpan={permissions.length} className="font-medium align-top">
                          <Badge variant="outline" className="mt-1">
                            {t(`roles.${role}`)}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>{permission.module}</TableCell>
                      <TableCell className={`text-center ${getActionColor(permission.create)}`}>
                        {getActionIcon(permission.create)}
                      </TableCell>
                      <TableCell className={`text-center ${getActionColor(permission.read)}`}>
                        {getActionIcon(permission.read)}
                      </TableCell>
                      <TableCell className={`text-center ${getActionColor(permission.update)}`}>
                        {getActionIcon(permission.update)}
                      </TableCell>
                      <TableCell className={`text-center ${getActionColor(permission.delete)}`}>
                        {getActionIcon(permission.delete)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New User Dialog */}
      {canManageUsers && (
        <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('users.new')}</DialogTitle>
              <DialogDescription>
                Crear un nuevo usuario en el sistema con contraseña local
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('users.name')}</Label>
                <Input
                  id="full_name"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  placeholder="Nombre completo del usuario"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('users.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="usuario@empresa.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t('users.role')}</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as UserRole})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrador">{t('roles.administrador')}</SelectItem>
                    <SelectItem value="coordinador">{t('roles.coordinador')}</SelectItem>
                    <SelectItem value="analista">{t('roles.analista')}</SelectItem>
                    <SelectItem value="visualizador">{t('roles.visualizador')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('users.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Contraseña"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('users.confirm.password')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => setNewUser({...newUser, confirmPassword: e.target.value})}
                  placeholder="Confirmar contraseña"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  {t('users.password.requirements')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSaveUser}>
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersModule;
