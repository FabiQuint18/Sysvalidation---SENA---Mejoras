
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  suffix?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  className?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  suffix = '',
  variant = 'default',
  className = ''
}: StatsCardProps) => {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-600 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    danger: 'bg-red-50 text-red-600 border-red-200',
    success: 'bg-green-50 text-green-600 border-green-200',
  };

  const iconStyles = {
    default: 'bg-blue-100 text-blue-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    success: 'bg-green-100 text-green-600',
  };

  return (
    <Card className={`shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${variantStyles[variant]} ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">
          {title}
        </CardTitle>
        <div className={`p-3 rounded-full ${iconStyles[variant]} shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {value.toLocaleString()}{suffix}
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-2">
            {description}
          </p>
        )}
        {trend && (
          <div className={`flex items-center text-sm font-medium ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {typeof trend.value === 'number' ? `${trend.value}%` : trend.value}
            {typeof trend.value === 'number' && ' vs mes anterior'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
