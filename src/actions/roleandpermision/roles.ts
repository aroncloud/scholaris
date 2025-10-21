/* eslint-disable @typescript-eslint/no-explicit-any */
// services/roleService.ts
import { assignRole, removeRole } from "./assignerRole";
import { showToast } from "@/components/ui/showToast";

/** ------------------- TRANSLATIONS ------------------- */
export const roleTranslations = {
  en: {
    ADMIN_SUPER: "Super Administrator",
    ADMIN_HR: "HR Administrator",
    ADMIN_ACADEMIC: "Academic Administrator",
    FINANCE: "Finance",
    DEPT_HEAD: "Department Head",
    TEACHER: "Teacher",
    STUDENT: "Student",
    STAFF: "Staff",
  },
  fr: {
    ADMIN_SUPER: "Super Administrateur",
    ADMIN_HR: "Administrateur RH",
    ADMIN_ACADEMIC: "Administrateur Académique",
    FINANCE: "Comptable / Service Financier",
    DEPT_HEAD: "Chef de Département",
    TEACHER: "Enseignant",
    STUDENT: "Étudiant",
    STAFF: "Personnel / Collaborateur",
  },
} as const;

export type Role = keyof typeof roleTranslations.en;
export type Action = "remove" | "assign";

export interface UserProfile {
  profile_code: string;
  role_code: Role;
}

export interface RoleItem {
  code: Role;
  name: string;
}

/** ------------------- CACHE ------------------- */
const roleCache: Record<string, RoleItem[]> = {}; // locale -> roles

/** Fetch roles from API with cache */
export async function fetchRoles(locale: keyof typeof roleTranslations): Promise<RoleItem[]> {
  if (roleCache[locale]) return roleCache[locale];

  try {
    const res = await fetch(`${process.env.AIM_WORKER_ENDPOINT}/api/roles`);
    const json = await res.json();

    if (Array.isArray(json.body)) {
      const roles = json.body.map((r: any) => ({
        code: r.role_code as Role,
        name: roleTranslations[locale]?.[r.role_code as Role] ?? r.title ?? r.role_code,
      }));
      roleCache[locale] = roles;
      return roles;
    }

    return [];
  } catch (err) {
    console.error("Error fetching roles:", err);
    showToast({
      variant: "error-solid",
      message: locale === "fr" ? "Erreur lors du chargement des rôles" : "Error loading roles",
    });
    return [];
  }
}

/** Prefetch roles to warm cache */
export function prefetchRoles(locale: keyof typeof roleTranslations) {
  fetchRoles(locale).catch(() => {});
}

/** Map user profiles to RoleItem with translated names in French always */
export function mapUserProfilesToRoles(userProfiles: UserProfile[]): RoleItem[] {
  return userProfiles.map((profile) => ({
    code: profile.role_code,
    name: roleTranslations.fr[profile.role_code] ?? profile.role_code, // always French
  }));
}

/** Assign or remove roles for a given user and return names in French always */
export async function processRoles(
  data: { userCode: string; action: Action; roles: Role[] },
  userProfiles: UserProfile[]
) {
  const results = await Promise.all(
    data.roles.map(async (role) => {
      const translatedName = roleTranslations.fr[role] ?? role; // always French

      if (data.action === "assign") {
        await assignRole(data.userCode, role);
        return {
          role,
          translatedRoleName: translatedName,
        };
      } else {
        const profile = userProfiles.find((p) => p.role_code === role);
        if (!profile) return null;

        await removeRole(data.userCode, role, profile.profile_code);
        return {
          role,
          profileCode: profile.profile_code,
          translatedRoleName: translatedName,
        };
      }
    })
  );

  const filteredResults = results.filter(Boolean) as {
    role: Role;
    profileCode?: string;
    translatedRoleName: string;
  }[];

  if (filteredResults.length > 0) {
    showToast({
      variant: "success-solid",
      message: `${
        filteredResults.length
      } rôle(s) ${data.action === "assign" ? "assigné(s)" : "supprimé(s)"} avec succès`,
    });
  }

  return filteredResults;
}
