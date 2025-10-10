import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';

type StatCardVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: StatCardVariant;
  main?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: {
    main: {
      bg: 'bg-gradient-to-br from-green-600 to-green-700',
      text: 'text-white',
      titleText: 'text-green-100',
      iconColor: 'text-green-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-green-600',
      titleText: 'text-gray-600',
      iconColor: 'text-green-600',
      circle: 'bg-green-50',
      valueColor: 'text-green-600',
    },
  },
  danger: {
    main: {
      bg: 'bg-gradient-to-br from-red-600 to-red-700',
      text: 'text-white',
      titleText: 'text-red-100',
      iconColor: 'text-red-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-red-600',
      titleText: 'text-gray-600',
      iconColor: 'text-red-600',
      circle: 'bg-red-50',
      valueColor: 'text-red-600',
    },
  },
  warning: {
    main: {
      bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      text: 'text-white',
      titleText: 'text-yellow-100',
      iconColor: 'text-yellow-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-yellow-600',
      titleText: 'text-gray-600',
      iconColor: 'text-yellow-600',
      circle: 'bg-yellow-50',
      valueColor: 'text-yellow-600',
    },
  },
  info: {
    main: {
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      text: 'text-white',
      titleText: 'text-blue-100',
      iconColor: 'text-blue-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-blue-600',
      titleText: 'text-gray-600',
      iconColor: 'text-blue-600',
      circle: 'bg-blue-50',
      valueColor: 'text-blue-600',
    },
  },
  neutral: {
    main: {
      bg: 'bg-gradient-to-br from-gray-600 to-gray-700',
      text: 'text-white',
      titleText: 'text-gray-100',
      iconColor: 'text-gray-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-gray-600',
      titleText: 'text-gray-600',
      iconColor: 'text-gray-600',
      circle: 'bg-gray-50',
      valueColor: 'text-gray-900',
    },
  },
  purple: {
    main: {
      bg: 'bg-gradient-to-br from-purple-600 to-purple-700',
      text: 'text-white',
      titleText: 'text-purple-100',
      iconColor: 'text-purple-200',
      circle: 'bg-white/10',
      valueColor: 'text-white',
    },
    secondary: {
      bg: 'bg-white',
      text: 'text-purple-800',
      titleText: 'text-gray-600',
      iconColor: 'text-purple-800',
      circle: 'bg-purple-50',
      valueColor: 'text-purple-800',
    },
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon = TrendingUp,
  variant = 'info',
  main = false,
  children,
  className = '',
}) => {
  const styles = main ? variantStyles[variant].main : variantStyles[variant].secondary;
  const circleSize = main ? 'w-32 h-32 -mr-16 -mt-16' : 'w-20 h-20 -mr-10 -mt-10';

  return (
    <Card
      className={`border-0 shadow-xl ${styles.bg} overflow-hidden relative ${
        !main ? 'group hover:shadow-2xl transition-shadow' : ''
      } ${className}`}
    >
      <div
        className={`absolute top-0 right-0 ${circleSize} ${styles.circle} rounded-full ${
          !main ? 'group-hover:scale-110 transition-transform' : ''
        }`}
      ></div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-semibold ${styles.titleText} uppercase tracking-wide`}>
            {title}
          </CardTitle>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold mb-1 ${styles.valueColor}`}>
          {value}
        </div>
        {children && (
          <div className={main ? styles.text : 'text-gray-600'}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;