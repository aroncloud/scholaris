import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ContentLayoutProps {
  /** Titre principal du layout */
  title?: string;
  /** AJOUT: Icône optionnelle à afficher à gauche du titre */
  icon?: ReactNode;
  /** Description optionnelle sous le titre */
  description?: string | ReactNode;
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
  icon, // AJOUT: Récupération de la nouvelle prop
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
      <Card className={cn("w-full pb-4 pt-0 overflow-hidden", cardClassName)}>
        {/* Afficher le header seulement si un titre, une icône, une description ou des actions sont présents */}
        {(title || icon || description || actions) && (
          <CardHeader className={cn(
            "flex flex-row items-center justify-between space-y-0 pt-4 border-b bg-gray-50",
            headerClassName
          )}>
            {/* MODIFICATION: Conteneur flex pour l'icône et le titre/description */}
            <div className="flex flex-1 items-start gap-3">
              {/* Affichage conditionnel de l'icône */}
              {icon}
              
              {/* Le titre et la description ne prennent plus toute la largeur (flex-1) car c'est le rôle du conteneur parent */}
              <div className="space-y-1">
                {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
                {description && (
                  <div className="text-sm text-muted-foreground">{description}</div>
                )}
              </div>
            </div>
            
            {actions && (
              <div className="flex items-center gap-2 ml-4"> {/* ml-4 pour l'espacement */}
                {actions}
              </div>
            )}
          </CardHeader>
        )}

        <CardContent className={cn("pt-0", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentLayout;