
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardCheck, 
  Users, 
  Settings,
  FlaskConical,
  Shield
} from 'lucide-react';
import { UserRole } from '@/types/validation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  userRole: UserRole;
  alertCounts?: {
    expiring: number;
    expired: number;
  };
}

const Sidebar = ({ activeModule, onModuleChange, userRole, alertCounts }: SidebarProps) => {
  const { t } = useLanguage();

  const menuItems = [
    {
      id: 'dashboard',
      label: t('menu.dashboard'),
      icon: LayoutDashboard,
      roles: ['super_administrador', 'administrador', 'coordinador', 'analista', 'visualizador'],
    },
    {
      id: 'products',
      label: t('menu.products'),
      icon: Package,
      roles: ['administrador', 'coordinador', 'analista'],
    },
    {
      id: 'validations',
      label: t('menu.validations'),
      icon: ClipboardCheck,
      roles: ['administrador', 'coordinador', 'analista', 'visualizador'],
    },
    {
      id: 'equipments',
      label: t('menu.equipments'),
      icon: FlaskConical,
      roles: ['administrador', 'coordinador', 'analista'],
    },
    {
      id: 'users',
      label: t('menu.users'),
      icon: Users,
      roles: ['super_administrador', 'administrador'],
    },
    {
      id: 'security',
      label: t('menu.security'),
      icon: Shield,
      roles: ['super_administrador', 'administrador'],
    },
    {
      id: 'settings',
      label: t('menu.settings'),
      icon: Settings,
      roles: ['administrador'],
    },
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleModuleClick = (moduleId: string) => {
    console.log('Switching to module:', moduleId);
    onModuleChange(moduleId);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 border-r border-blue-800/30 h-full shadow-2xl">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          const showAlert = item.id === 'validations' && alertCounts && (alertCounts.expiring > 0 || alertCounts.expired > 0);
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start transition-all duration-300 rounded-xl',
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-105'
              )}
              onClick={() => handleModuleClick(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{item.label}</span>
              {showAlert && (
                <Badge variant="destructive" className="ml-auto text-xs px-2 py-1 bg-red-500 text-white rounded-full animate-pulse">
                  {alertCounts.expiring + alertCounts.expired}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
