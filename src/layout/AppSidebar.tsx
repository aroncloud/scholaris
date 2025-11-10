"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  Award,
  DollarSign,
  MessageSquare,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  UserCircle,
  ClipboardX,
  UserCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { useMemo } from "react";
import { useUserStore } from "@/store/useAuthStore";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  authorizedRoles: string[],
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean, authorizedRoles: string[], }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard//admin",
    authorizedRoles: [
      "ADMIN_SUPER",
      "ADMIN_ACADEMIC",
    ],
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard/student",
    authorizedRoles: [
      "STUDENT",
    ],
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    name: "Dashboard",
    path: "/dashboard/teacher",
    authorizedRoles: [
      "TEACHER",
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Utilisateurs",
    path: "/dashboard/admin/users",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_HR"],
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    name: "Programmes",
    path: "/dashboard/admin/programs",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    name: "Etudiants",
    path: "/dashboard/admin/students",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
  },
  {
    icon: <UserCheck className="w-5 h-5" />,
    name: "Enseignants",
    path: "/dashboard/admin/teachers",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC", "DEPT_HEAD"],
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    name: "Feedback System",
    path: "/dashboard/admin/feedback-system",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC", "DEPT_HEAD"],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    name: "Feedback",
    path: "/dashboard/student/feedback",
    authorizedRoles: ["STUDENT"],
  },
  {
    icon: <ClipboardX className="w-5 h-5" />,
    name: "Absences",
    path: "/dashboard/admin/absences",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    name: "Planing & Ressources",
    authorizedRoles: ["ADMIN_SUPER", "FINANCE"],
    subItems: [
      {
        name: "Planification des Cours",
        path: "/dashboard/admin/planification",
        authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
      },
      {
        name: "Planification des Évaluations",
        path: "/dashboard/admin/exam-planning",
        authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
      },
      {
        name: "Ressources matérielles",
        path: "/dashboard/admin/classroom",
        authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
      },
    ],
  },
  {
    icon: <ClipboardCheck className="w-5 h-5" />,
    name: "Gestion des notes",
    path: "/dashboard/teacher/grade-management",
    authorizedRoles: ["TEACHER"],
  },
  {
    icon: <Award className="w-5 h-5" />,
    name: "Gestion des notes",
    path: "/dashboard/admin/grade-management",
    authorizedRoles: ["ADMIN_SUPER", "ADMIN_ACADEMIC"],
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    name: "Gestion Financière",
    authorizedRoles: ["ADMIN_SUPER", "FINANCE"],
    subItems: [
      {
        name: "Gestion des Paiements",
        path: "/dashboard/admin/payment-management",
        authorizedRoles: ["ADMIN_SUPER", "FINANCE"],
      },
      {
        name: "Frais universitaires",
        path: "/dashboard/admin/payment-setup",
        authorizedRoles: ["ADMIN_SUPER", "ADMIN_HR", "ADMIN_ACADEMIC", "TEACHER", "FINANCE"],
      },
    ],
  },
  {
    icon: <FileSpreadsheet className="w-5 h-5" />,
    name: "Notes",
    path: "/dashboard/student/grades",
    authorizedRoles: ["STUDENT"],
  },
  {
    icon: <CalendarCheck className="w-5 h-5" />,
    name: "Mes Absences",
    path: "/dashboard/student/my-absences",
    authorizedRoles: ["STUDENT"],
  },
  {
    icon: <UserCircle className="w-5 h-5" />,
    name: "Profile",
    path: "/dashboard/student/profile",
    authorizedRoles: ["STUDENT"],
  }
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user } = useUserStore();
  const userRoles = useMemo(() => user?.roles || [], [user?.roles]);

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allNavPaths = useMemo(() => {
    const paths: string[] = [];
    navItems.forEach((nav) => {
      if (nav.path) paths.push(nav.path);
      if (nav.subItems) {
        nav.subItems.forEach((s) => {
          if (s.path) paths.push(s.path);
        });
      }
    });
    return Array.from(new Set(paths)); // garantir unicité
  }, []);

  const normalizePath = (p: string) => (p === "/" ? "/" : p.replace(/\/+$/, ""));
  const currentPath = normalizePath(pathname ?? "/");

  const matchLength = useCallback(
    (p: string) => {
      if (!p) return 0;
      const t = normalizePath(p);
      if (t === "/") return currentPath === "/" ? 1 : 0;
      if (currentPath === t) return t.length; // exact match
      if (currentPath.startsWith(`${t}/`)) return t.length; // sous-chemin
      return 0;
    },
    [currentPath] // dépend seulement du path courant
  );

  const bestMatchLength = useMemo(() => {
    if (!currentPath) return 0;
    let best = 0;
    for (const p of allNavPaths) {
      const len = matchLength(p);
      if (len > best) best = len;
    }
    return best;
  }, [allNavPaths, currentPath, matchLength]);

  const isActive = useCallback(
    (path: string) => matchLength(path) === bestMatchLength && bestMatchLength > 0,
    [bestMatchLength, matchLength]
  );

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  

   

  const filteredNavItems = useMemo(() => {
    return navItems
      .map((nav) => {
        // Vérifie si l'utilisateur peut voir le nav principal
        const canSeeNav = nav.authorizedRoles.some((r) =>
          userRoles.includes(r)
        );

        if (!canSeeNav) return null;

        // Si le nav a des subItems, on filtre aussi
        let subItems = nav.subItems;
        if (subItems) {
          subItems = subItems.filter((sub) =>
            sub.authorizedRoles.some((r) => userRoles.includes(r))
          );
          if (subItems.length === 0) {
            // si plus aucun subItem autorisé → pas d'affichage du parent
            return null;
          }
        }

        return { ...nav, subItems };
      })
      .filter(Boolean) as NavItem[];
  }, [userRoles]);

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`${
                  openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed pt-28 top-0 left-0 flex flex-col px-5 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-40 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(filteredNavItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
