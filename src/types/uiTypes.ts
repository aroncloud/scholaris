import { ToastOptions, Slide } from "react-toastify";


export const defaultToastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Slide,
};

export const statusColors: Record<string, { 
  bg: string; 
  text: string; 
  darkBg: string; 
  darkText: string;
}> = {
  DRAFT:      { bg: "bg-gray-100",   text: "text-gray-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-gray-400" },
  DRAFTING:   { bg: "bg-gray-100",   text: "text-gray-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-gray-400" },

  PENDING:            { bg: "bg-yellow-100", text: "text-yellow-600", darkBg: "dark:bg-gray-700/20", darkText: "dark:text-yellow-400" },
  PENDING_APPROVAL:   { bg: "bg-yellow-100", text: "text-yellow-600", darkBg: "dark:bg-gray-700/20", darkText: "dark:text-yellow-400" },

  APPROVED:  { bg: "bg-green-100",   text: "text-green-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-green-400" },
  RENTED:    { bg: "bg-green-100",   text: "text-green-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-green-400" },
  ACTIVE:    { bg: "bg-green-100",   text: "text-green-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-green-400" },
  PAID:      { bg: "bg-green-100",   text: "text-green-600",   darkBg: "dark:bg-gray-700/20", darkText: "dark:text-green-400" },

  AVAILABLE: { bg: "bg-blue-100",    text: "text-blue-600",    darkBg: "dark:bg-gray-700/20", darkText: "dark:text-blue-400" },

  CANCELED:  { bg: "bg-red-100",     text: "text-red-600",     darkBg: "dark:bg-gray-700/20", darkText: "dark:text-red-400" },
  CANCEL:    { bg: "bg-red-100",     text: "text-red-600",     darkBg: "dark:bg-gray-700/20", darkText: "dark:text-red-400" },
  REJECTED:  { bg: "bg-red-100",     text: "text-red-600",     darkBg: "dark:bg-gray-700/20", darkText: "dark:text-red-400" },
  UNPAID:    { bg: "bg-red-100",     text: "text-red-600",     darkBg: "dark:bg-gray-700/20", darkText: "dark:text-red-400" },
  INACTIVE:  { bg: "bg-red-100",     text: "text-red-600",     darkBg: "dark:bg-gray-700/20", darkText: "dark:text-red-400" },
};


export type ToastType = "success" | "error" | "info" | "warning" | "default";