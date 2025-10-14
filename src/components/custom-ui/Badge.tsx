
import React from 'react';
import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple' | 'yellow';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  value?: string | number | null;
  label?: string | null;
  icon?: LucideIcon | null;
  size?: BadgeSize;
  className?: string;
}

interface VariantStyle {
  bg: string;
  border: string;
  valueColor: string;
  labelColor: string;
  iconColor: string;
}

interface SizeStyle {
  padding: string;
  valueSize: string;
  labelSize: string;
  iconSize: number;
  gap: string;
}

const Badge: React.FC<BadgeProps> = ({ 
    variant = 'neutral',
    value = null,
    label = null,
    icon: Icon = null,
    size = 'md',
    className = ''
}) => {
    const variantStyles: Record<BadgeVariant, VariantStyle> = {
        success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        valueColor: 'text-emerald-700',
        labelColor: 'text-emerald-600',
        iconColor: 'text-emerald-600',
        },
        danger: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        valueColor: 'text-red-700',
        labelColor: 'text-red-600',
        iconColor: 'text-red-600',
        },
        warning: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        valueColor: 'text-orange-700',
        labelColor: 'text-orange-600',
        iconColor: 'text-orange-600',
        },
        info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        valueColor: 'text-blue-700',
        labelColor: 'text-blue-600',
        iconColor: 'text-blue-600',
        },
        neutral: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        valueColor: 'text-gray-700',
        labelColor: 'text-gray-600',
        iconColor: 'text-gray-600',
        },
        purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        valueColor: 'text-purple-700',
        labelColor: 'text-purple-600',
        iconColor: 'text-purple-600',
        },
        yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        valueColor: 'text-yellow-700',
        labelColor: 'text-yellow-600',
        iconColor: 'text-yellow-600',
        },
    };

    const sizeStyles: Record<BadgeSize, SizeStyle> = {
        sm: {
        padding: 'px-2 py-1',
        valueSize: 'text-sm',
        labelSize: 'text-xs',
        iconSize: 14,
        gap: 'gap-1',
        },
        md: {
        padding: 'px-3 py-1.5',
        valueSize: 'text-lg',
        labelSize: 'text-xs',
        iconSize: 16,
        gap: 'gap-2',
        },
        lg: {
        padding: 'px-4 py-2',
        valueSize: 'text-xl',
        labelSize: 'text-sm',
        iconSize: 18,
        gap: 'gap-2',
        },
    };

    const style = variantStyles[variant];
    const sizing = sizeStyles[size];

    return (
        <div className={`inline-flex items-center ${sizing.gap} ${sizing.padding} rounded-lg ${style.bg} border ${style.border} ${className}`}>
            {Icon && (
                <Icon className={style.iconColor} size={sizing.iconSize} />
            )}
            {value !== null && (
                <span className={`${style.valueColor} font-bold ${sizing.valueSize}`}>
                {value}
                </span>
            )}
            {label && (
                <span className={`${style.labelColor} ${sizing.labelSize} font-medium`}>
                {label}
                </span>
            )}
        </div>
    );
};

export default Badge;