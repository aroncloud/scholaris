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

export const getStatutColor = (statut: string) => {
  switch (statut.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "REJECTED":
    case "SUSPENDED":
      return "bg-red-100 text-red-800";
    case "GRADUATED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
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
