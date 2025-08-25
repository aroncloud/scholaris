import { defaultToastOptions, ToastType } from "@/types/uiTypes";
import { clsx, type ClassValue } from "clsx"
import { Id, toast, ToastContent, ToastOptions } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts.pop()! : '';
}

export function formatDateToText(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function capitalize(str: string): string {
  if(!str) return str
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function capitalizeEachWord(str: string): string {
  if(!str) return str
  return str
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function toUpperCase(str: string): string {
  if(!str) return str
  return str.trim().toUpperCase();
}


export function formatNumberWithSpaces(num: number | undefined | null): string {
  if(!num) return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const showToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {},
): Id => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  switch (type) {
    case "success":
      return toast.success(content, optionsToApply);
    case "error":
      return toast.error(content, optionsToApply);
    case "info":
      return toast.info(content, optionsToApply);
    case "warning":
      return toast.warn(content, optionsToApply);
    case "default":
      return toast(content, optionsToApply);
    default:
      return toast(content, optionsToApply);
  }
};

export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    // Brouillon
    case "DRAFT":
    case "DRAFTING":
      return "bg-gray-100 text-gray-600 dark:bg-gray-700/20 dark:text-gray-400";

    // En attente
    case "PENDING":
    case "PENDING_APPROVAL":
    case "EN ATTENTE":
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-600 dark:bg-gray-700/20 dark:text-yellow-400";

    // Actif ou approuvé
    case "APPROVED":
    case "APPROUVE":
    case "RENTED":
    case "ACTIVE":
    case "PAID":
    case "ACTIF":
      return "bg-green-100 text-green-600 dark:bg-gray-700/20 dark:text-green-400";

    // Disponible
    case "AVAILABLE":
      return "bg-blue-100 text-blue-600 dark:bg-gray-700/20 dark:text-blue-400";

    // Converti
    case "CONVERTI":
    case "CONVERTED":
      return "bg-blue-100 text-blue-600 dark:bg-gray-700/20 dark:text-blue-400";

    // Annulé, rejeté, inactif
    case "CANCELED":
    case "CANCEL":
    case "REJECTED":
    case "REJETE":
    case "UNPAID":
    case "INACTIVE":
    case "INACTIF":
    case "SUSPENDED":
      return "bg-red-100 text-red-600 dark:bg-gray-700/20 dark:text-red-400";

    // Fallback
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-700/20 dark:text-gray-400";
  }
};

export const getRoleColor = (role: string): string => {
  switch (role.toUpperCase()) {
    case "ADMINISTRATOR": // Administrateur
      return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";

    case "REGISTRAR": // Scolarité
      return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";

    case "HR": // RH
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100";

    case "TEACHER": // Enseignant
      return "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100";

    case "STUDENT": // Étudiant
      return "bg-pink-100 text-pink-800 dark:bg-pink-700 dark:text-pink-100";

    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700/20 dark:text-gray-100";
  }
};




export const getMentionColor = (mention: string) => {
  switch (mention.toUpperCase()) {
    case "EXCELLENT":
      return "bg-green-100 text-green-800";
    case "GOOD":
      return "bg-blue-100 text-blue-800";
    case "FAIR":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
