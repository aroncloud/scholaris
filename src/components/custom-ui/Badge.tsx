import React from 'react';
import { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'purple' | 'yellow';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string | number | null;
  description?: string | null;
  icon?: LucideIcon | null;
  size?: BadgeSize;
  className?: string;
  value?: string;
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

// Fonction pour déterminer la variante basée sur la valeur
const getVariantFromValue = (value: string): BadgeVariant => {
  const upperValue = value.toUpperCase();
  
  // Statuts de succès/actifs (vert)
  if ([
    'APPROVED', 'ACTIVE', 'ENROLLED', 'TERMINATED', 'PAID', 
    'ACTIF', 'IN_PROGRESS', 'JUSTIFIED',
  ].includes(upperValue)) {
    return 'success';
  }
  
  // Statuts en attente (jaune)
  if ([
    'PENDING', 'PENDING_APPROVAL', 'EN_ATTENTE', 'PENDING_REVIEW', 'READY_FOR_GRADING'
  ].includes(upperValue)) {
    return 'yellow';
  }
  
  // Statuts de progression/complétés (bleu)
  if ([
    'CONVERTED', 'COMPLETED', 'GRADUATED', 'AVAILABLE', 
    'PROMOTED', 'TRANSFERRED', 'PARTIALLY_PAID', 'CLOSED'
  ].includes(upperValue)) {
    return 'info';
  }
  
  // Statuts spéciaux (violet)
  if ([
    'EXEMPTED', 'PLANNED', 'UNJUSTIFIED'
  ].includes(upperValue)) {
    return 'purple';
  }
  
  // Statuts d'erreur/rejet (rouge)
  if ([
    'CANCELED', 'CANCEL', 'REJECTED', 'REJETE', 'UNPAID', 
    'INACTIVE', 'INACTIF', 'WITHDRAWN', 'SUSPENDED', 
    'REPEATER', 'DROPPED_OUT', 'OVERDUE'
  ].includes(upperValue)) {
    return 'danger';
  }
  
  // Brouillon ou neutre (gris)
  if ([
    'DRAFT', 'DRAFTING', 'REFUNDED'
  ].includes(upperValue)) {
    return 'neutral';
  }
  
  // Fallback
  return 'neutral';
};

const Badge: React.FC<BadgeProps> = ({ 
    variant,
    label = null,
    description = null,
    icon: Icon = null,
    size = 'md',
    className = '',
    value
}) => {
    // Si variant est fourni, l'utiliser, sinon déterminer à partir de value (si value existe)
    const effectiveVariant = variant || (value ? getVariantFromValue(value) : 'neutral');
    
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

    const style = variantStyles[effectiveVariant];
    const sizing = sizeStyles[size];

    return (
        <div className={`inline-flex items-center flex-nowrap ${sizing.gap} ${sizing.padding} rounded-lg ${style.bg} border ${style.border} ${className}`}>
            {Icon && (
                <Icon className={style.iconColor} size={sizing.iconSize} />
            )}
            {label !== null && (
                <span className={`${style.valueColor} font-semibold ${sizing.valueSize}`}>
                    {label}
                </span>
            )}
            {description && (
                <span className={`${style.labelColor} ${sizing.labelSize} font-medium`}>
                    {description}
                </span>
            )}
        </div>
    );
};

export default Badge;