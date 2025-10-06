import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ContentLayoutProps {
  /** Titre principal du layout */
  title?: string;
  /** Description optionnelle sous le titre */
  description?: string;
  /** Actions à afficher dans le header (boutons, etc.) */
  actions?: ReactNode;
  /** Contenu principal du layout */
  children: ReactNode;
  /** Classes CSS personnalisées pour le conteneur principal */
  className?: string;
  /** Classes CSS personnalisées pour la card */
  cardClassName?: string;
  /** Classes CSS personnalisées pour le header de la card */
  headerClassName?: string;
  /** Classes CSS personnalisées pour le contenu de la card */
  contentClassName?: string;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  title,
  description,
  actions,
  children,
  className,
  cardClassName,
  headerClassName,
  contentClassName,
}) => {
  return (
    <div className={cn("", className)}>
      <Card className={cn("w-full", cardClassName)}>
        {/* {title || description || actions &&  */}
          <CardHeader className={cn(
            "flex flex-row items-center justify-between space-y-0 pb-6",
            headerClassName
          )}>
            {title && <div className="space-y-1 flex-1">
              <h1 className="text-xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>}
            
            {actions && (
              <div className="flex items-center gap-2 ml-6">
                {actions}
              </div>
            )}
          </CardHeader>
        {/* } */}

        <CardContent className={cn("pt-0", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentLayout;