import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ClipboardCheck, 
  Languages,
  Mail,
  Chrome,
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import ValidationsModule from '@/components/modules/ValidationsModule';
import ProductsModule from '@/components/modules/ProductsModule';
import EquipmentsModule from '@/components/modules/EquipmentsModule';
import UsersModule from '@/components/modules/UsersModule';
import SecurityModule from '@/components/modules/SecurityModule';
import SettingsModule from '@/components/modules/SettingsModule';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole, Language } from '@/types/validation';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  last_login?: string;
}

const Index = () => {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: '0',
      email: 'superadmin@company.com',
      full_name: 'Super Administrador', 
      role: 'super_administrador',
      last_login: '2024-01-15T11:00:00Z'
    },
    {
      id: '1',
      email: 'admin@company.com',
      full_name: 'Administrador Sistema', 
      role: 'administrador',
      last_login: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      email: 'coordinador@company.com',
      full_name: 'Coordinador QA',
      role: 'coordinador',
      last_login: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      email: 'analista@company.com',
      full_name: 'Analista QC',
      role: 'analista',
      last_login: '2024-01-15T08:45:00Z'
    },
    {
      id: '4',
      email: 'viewer@company.com',
      full_name: 'Visualizador',
      role: 'visualizador',
      last_login: '2024-01-14T16:20:00Z'
    }
  ];

  // Mock passwords for demonstration
  const mockPasswords: Record<string, string> = {
    'superadmin@company.com': 'Super123!',
    'admin@company.com': 'Admin123!',
    'coordinador@company.com': 'Coord123!',
    'analista@company.com': 'Analyst123!',
    'viewer@company.com': 'Viewer123!'
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedLogo = localStorage.getItem('companyLogo');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    toast({
      title: "🔄 Conectando con Google",
      description: "Redirigiendo a Google para autenticación...",
    });
    
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === 'analista@company.com');
      if (user) {
        const updatedUser = { 
          ...user, 
          full_name: 'Usuario Google',
          email: 'usuario@gmail.com',
          last_login: new Date().toISOString() 
        };
        setCurrentUser(updatedUser);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        toast({
          title: "✅ Login con Google exitoso",
          description: "¡Bienvenido al sistema!",
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    toast({
      title: "🔄 Conectando con Microsoft",
      description: "Redirigiendo a Microsoft para autenticación...",
    });
    
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === 'coordinador@company.com');
      if (user) {
        const updatedUser = { 
          ...user, 
          full_name: 'Usuario Microsoft',
          email: 'usuario@outlook.com',
          last_login: new Date().toISOString() 
        };
        setCurrentUser(updatedUser);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        toast({
          title: "✅ Login con Microsoft exitoso",
          description: "¡Bienvenido al sistema!",
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = mockUsers.find(u => u.email === loginData.email);
      const expectedPassword = mockPasswords[loginData.email];

      if (user && expectedPassword === loginData.password) {
        const updatedUser = {
          ...user,
          last_login: new Date().toISOString()
        };
        
        setCurrentUser(updatedUser);
        setIsLoggedIn(true);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        toast({
          title: "✅ " + t('login.success'),
          description: t('login.welcome'),
        });
      } else {
        toast({
          title: "❌ " + t('login.error'),
          description: 'Credenciales inválidas',
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('login.error'),
        description: 'Error al conectar con el servidor',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveModule('dashboard');
    localStorage.removeItem('currentUser');
    setLoginData({ email: '', password: '' });
    
    toast({
      title: "👋 " + t('login.logout'),
      description: t('login.logoutSuccess'),
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        setCompanyLogo(logoUrl);
        localStorage.setItem('companyLogo', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (newLogo: string) => {
    setCompanyLogo(newLogo);
    localStorage.setItem('companyLogo', newLogo);
  };

  const renderModule = () => {
    const userRole = currentUser?.role || 'visualizador';
    
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard userRole={userRole} currentUserEmail={currentUser?.email} />;
      case 'products':
        return <ProductsModule />;
      case 'validations':
        return <ValidationsModule userRole={userRole} />;
      case 'equipments':
        return <EquipmentsModule />;
      case 'users':
        return <UsersModule userRole={userRole} />;
      case 'security':
        return <SecurityModule userRole={userRole} />;
      case 'settings':
        return <SettingsModule onLogoChange={handleLogoChange} />;
      default:
        return <Dashboard userRole={userRole} currentUserEmail={currentUser?.email} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <Card className="w-full max-w-md backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-6 text-center">
            <div className="flex items-center justify-center mb-6">
              {companyLogo ? (
                <div className="relative">
                  <img src={companyLogo} alt="Company Logo" className="h-20 w-20 object-contain rounded-2xl shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl"></div>
                </div>
              ) : (
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <ClipboardCheck className="text-white h-10 w-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                {t('login.title')}
              </CardTitle>
              <CardDescription className="text-blue-100/80 text-lg">
                {t('system.subtitle')}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* SSO Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Chrome className="mr-3 h-5 w-5" />
                Continuar con Google
              </Button>
              
              <Button 
                onClick={handleMicrosoftLogin}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="mr-3 h-5 w-5" />
                Continuar con Microsoft
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-r from-indigo-900 to-purple-900 px-4 text-white/60">o continúa con email</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/90 font-medium">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
                  placeholder="tu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 font-medium">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:bg-white/20 focus:border-blue-400 transition-all duration-300 pr-12"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {t('login.loading')}
                  </div>
                ) : (
                  <>
                    <Shield className="mr-3 h-5 w-5" />
                    {t('login.button')}
                  </>
                )}
              </Button>
            </form>
            
            {/* Company Logo Upload */}
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
              <Label htmlFor="logo-upload" className="text-white/90 font-medium flex items-center mb-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Logo de la Empresa:
              </Label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white/90 hover:file:bg-white/20 transition-all duration-300"
              />
            </div>
            
            {/* Demo credentials info */}
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
              <h4 className="font-semibold text-blue-200 mb-3 flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Credenciales de Demostración:
              </h4>
              <div className="text-sm text-blue-100/80 space-y-2">
                <div className="grid grid-cols-1 gap-1">
                  <div><strong className="text-blue-200">Super Admin:</strong> superadmin@company.com / Super123!</div>
                  <div><strong className="text-blue-200">Administrador:</strong> admin@company.com / Admin123!</div>
                  <div><strong className="text-blue-200">Coordinador:</strong> coordinador@company.com / Coord123!</div>
                  <div><strong className="text-blue-200">Analista:</strong> analista@company.com / Analyst123!</div>
                  <div><strong className="text-blue-200">Visualizador:</strong> viewer@company.com / Viewer123!</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-400/20">
                <h5 className="font-semibold text-blue-200 mb-2 flex items-center">
                  <Chrome className="mr-2 h-4 w-4" />
                  Autenticación SSO:
                </h5>
                <div className="text-sm text-blue-100/80 space-y-1">
                  <div><strong className="text-green-300">Google:</strong> Usar botón "Continuar con Google"</div>
                  <div><strong className="text-blue-300">Microsoft:</strong> Usar botón "Continuar con Microsoft"</div>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/5 rounded-xl border border-white/10">
              <Languages className="h-5 w-5 text-white/70" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:bg-white/20 focus:border-blue-400 transition-all duration-300"
              >
                <option value="es" className="bg-gray-800">🇪🇸 Español</option>
                <option value="en" className="bg-gray-800">🇺🇸 English</option>
                <option value="pt" className="bg-gray-800">🇧🇷 Português</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar 
        activeModule={activeModule} 
        onModuleChange={setActiveModule}
        userRole={currentUser?.role || 'visualizador'}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          currentUser={currentUser}
          onLogout={handleLogout}
          companyLogo={companyLogo}
        />
        
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50/50 to-blue-50/50">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};

export default Index;