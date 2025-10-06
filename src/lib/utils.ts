import { defaultToastOptions, ToastType } from "@/types/uiTypes";
import { IArrondissement, IArrondissementMap, ICountryMap, IDepartement, IDepartmentMap, IRegion, IRegionMap } from "@/types/utilitiesTypes";
import { clsx, type ClassValue } from "clsx"
import { Id, toast, ToastContent, ToastOptions } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

    
export const getMonthRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  .toISOString()
  .split("T")[0];
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  .toISOString()
  .split("T")[0];
  return { start, end };
};

export const getWeekRange = () => {
  const today = new Date();
  const day = today.getDay();
  
  // Calcul du décalage pour obtenir le lundi de la semaine courante
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  
  // On crée une copie de 'today' pour éviter de modifier l'original
  const startOfWeek = new Date(today);
  startOfWeek.setDate(diff);
  
  // On crée également une copie pour la fin de la semaine (dimanche)
  const endOfWeek = new Date(today);
  endOfWeek.setDate(diff + 6);

  // On formate les dates en YYYY-MM-DD
  const start = startOfWeek.toISOString().split("T")[0];
  const end = endOfWeek.toISOString().split("T")[0];

  return { start, end };
};



export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? '.' + parts.pop()! : '';
}

export function formatDateToText(dateString: string | null): string {
  if(!dateString) {
    return "-"
  }
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
    case "EN_ATTENTE":
      return "bg-yellow-100 text-yellow-600 dark:bg-gray-700/20 dark:text-yellow-400";

    // Actif ou approuvé (succès, payé, inscrit)
    case "APPROVED":
    case "ACTIVE":
    case "ENROLLED":
    case "TERMINATED":
    case "PAID":
    case "ACTIF":
    case "IN_PROGRESS":
      return "bg-green-100 text-green-600 dark:bg-gray-700/20 dark:text-green-400";

    // Progression / partiellement atteint
    case "CONVERTED":
    case "COMPLETED":
    case "GRADUATED":
    case "AVAILABLE":
    case "PROMOTED":
    case "TRANSFERRED":
    case "PARTIALLY_PAID":
    case "CLOSED":
      return "bg-blue-100 text-blue-600 dark:bg-gray-700/20 dark:text-blue-400";

    // Statut spécial / exception
    case "EXEMPTED":
    case "PLANNED":
      return "bg-purple-100 text-purple-800 dark:bg-gray-700/20 dark:text-purple-400";

    // Annulé, rejeté, inactif, en échec
    case "CANCELED":
    case "CANCEL":
    case "REJECTED":
    case "REJETE":
    case "UNPAID":
    case "INACTIVE":
    case "INACTIF":
    case "WITHDRAWN":
    case "SUSPENDED":
    case "REPEATER":
    case "DROPPED_OUT":
    case "OVERDUE":
      return "bg-red-100 text-red-600 dark:bg-gray-700/20 dark:text-red-400";

    // Remboursé / neutre
    case "REFUNDED":
      return "bg-gray-200 text-gray-800 dark:bg-gray-700/20 dark:text-gray-300";

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

export function regroupLocation(params: {
  arrondissements: IArrondissement[];
  departments: IDepartement[];
  regions: IRegion[];
}): ICountryMap {
  const { arrondissements, departments, regions } = params;

  const regionNameByCode = new Map<string, string>(
    regions.map(r => [r.region_code, r.region_name])
  );

  const arrByDept = new Map<string, IArrondissementMap[]>();
  for (const arr of arrondissements) {
    const list = arrByDept.get(arr.department_code) ?? [];
    list.push({
      arrondissement_code: arr.arrondissement_code,
      arrondissement_name: arr.arrondissement_name,
    });
    arrByDept.set(arr.department_code, list);
  }

  const deptByRegion = new Map<string, IDepartmentMap[]>();
  for (const dept of departments) {
    const deptEntry: IDepartmentMap = {
      department_code: dept.department_code,
      department_name: dept.department_name,
      arrondissements: arrByDept.get(dept.department_code) ?? [],
    };
    const list = deptByRegion.get(dept.region_code) ?? [];
    list.push(deptEntry);
    deptByRegion.set(dept.region_code, list);
  }

  const regionsOut: IRegionMap[] = [];
  for (const [region_code, deptList] of deptByRegion.entries()) {
    regionsOut.push({
      region_code,
      region_name: regionNameByCode.get(region_code) ?? region_code,
      departments: deptList,
    });
  }

  return { regions: regionsOut };
}

export const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return 'Non disponible';
    return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };