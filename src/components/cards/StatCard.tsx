import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp } from 'lucide-react';

type StatCardVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  variant?: StatCardVariant;
  main?: boolean;
  compact?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// Type pour les styles
interface VariantStyle {
  bg: string;
  text: string;
  titleText: string;
  iconColor: string;
  circle: string;
  valueColor: string;
}

// Type pour les styles compacts
interface CompactVariantStyle {
  bg: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  valueColor: string;
  border: string;
}

// Typage explicite de variantStyles
const variantStyles: Record<StatCardVariant, { main: VariantStyle; secondary: VariantStyle }> = {
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

// Styles pour le mode compact
const compactVariantStyles: Record<StatCardVariant, CompactVariantStyle> = {
  success: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-green-200',
  },
  danger: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-red-200',
  },
  warning: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-yellow-200',
  },
  info: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-blue-200',
  },
  neutral: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-gray-200',
  },
  purple: {
    bg: 'bg-white/80 backdrop-blur-sm',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    titleColor: 'text-slate-600',
    valueColor: 'text-slate-900',
    border: 'border-purple-200',
  },
};

// Fonction pour obtenir une variante aléatoire
const getRandomVariant = (): StatCardVariant => {
  const variants: StatCardVariant[] = ['success', 'danger', 'warning', 'info', 'neutral', 'purple'];
  return variants[Math.floor(Math.random() * variants.length)];
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon = TrendingUp,
  variant,
  main = false,
  compact = false,
  children,
  className = '',
}) => {
  const selectedVariant = useMemo(() => variant ?? getRandomVariant(), [variant]);

  // Mode compact
  if (compact) {
    const compactStyles = compactVariantStyles[selectedVariant];
    
    return (
      <div className={`${compactStyles.bg} rounded-lg p-4 border ${compactStyles.border} ${className}`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${compactStyles.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${compactStyles.iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs ${compactStyles.titleColor} font-medium`}>{title}</p>
            <p className={`text-sm font-bold ${compactStyles.valueColor} truncate`}>{value}</p>
            {children && (
              <div className="text-xs text-slate-500 mt-0.5">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mode normal
  const styles = main ? variantStyles[selectedVariant].main : variantStyles[selectedVariant].secondary;
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
        } z-0`}
      ></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-semibold ${styles.titleText} uppercase tracking-wide`}>
            {title}
          </CardTitle>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className={`text-lg lg:text-xl xl:text-2xl font-bold mb-1 ${styles.valueColor}`}>
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