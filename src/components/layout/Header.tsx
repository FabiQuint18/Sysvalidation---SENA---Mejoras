
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, FlaskConical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LanguageSelector from '@/components/ui/language-selector';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  currentUser: any;
  onLogout: () => void;
  companyLogo?: string | null;
}

const Header = ({ currentUser, onLogout, companyLogo }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="bg-background shadow-sm border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {companyLogo ? (
              <div className="relative">
                <img src={companyLogo} alt="Company Logo" className="w-12 h-12 object-contain rounded-xl shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-xl"></div>
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <FlaskConical className="text-white h-7 w-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('system.title')}
              </h1>
              <p className="text-sm text-blue-600/70">{t('system.subtitle')}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-300">
                <User className="h-4 w-4" />
                <span className="font-medium">{currentUser?.full_name || currentUser?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-xl">
              <DropdownMenuItem onClick={onLogout} className="hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg m-1">
                <LogOut className="mr-2 h-4 w-4" />
                {t('login.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
