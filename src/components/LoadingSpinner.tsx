// components/ui/loading-spinner.tsx

import { Loader2 } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  /**
   * Taille du spinner en pixels.
   * @default 24
   */
  size?: number;
  /**
   * Couleur du spinner (par ex. "text-blue-500", "text-gray-400").
   * @default "text-primary"
   */
  color?: string;
  /**
   * Classes CSS additionnelles pour le conteneur du spinner.
   */
  containerClassName?: string;
  /**
   * Classes CSS additionnelles pour l'icône du spinner.
   */
  iconClassName?: string;
  /**
   * Message de chargement optionnel.
   */
  message?: string;
}

const LoadingSpinner = ({
  size = 24,
  color = "text-primary",
  containerClassName,
  iconClassName,
  message,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        containerClassName
      )}
    >
      <Loader2
        size={size}
        className={cn("animate-spin", color, iconClassName)}
      />
      {message && (
        <span className="text-sm font-medium text-muted-foreground animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;