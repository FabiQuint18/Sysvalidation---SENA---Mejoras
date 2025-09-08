
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/types/validation';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { value: Language; label: string; flag: string }[] = [
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'pt', label: 'Português', flag: '🇧🇷' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Languages className="h-4 w-4 text-foreground" />
      <Select value={language} onValueChange={(value: Language) => setLanguage(value)}>
        <SelectTrigger className="w-32 bg-background border-border hover:bg-accent hover:text-accent-foreground">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover border border-border">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.value} 
              value={lang.value}
              className="hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <span className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
