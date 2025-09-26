'use client'

import React from "react";

type Permission = {
  permission_code: string;
  permission_title: string;
};

type Role = {
  role_code: string;
  title: string;
  description: string;
  user_count: number;
  permissions: Permission[];
};

type RoleCardProps = {
  role: Role;
  onManagePermissions?: () => void;
};

const RoleCard = ({ role, onManagePermissions }: RoleCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">{role.title}</h3>
        <span className="text-sm text-muted-foreground">{role.user_count} utilisateurs</span>
      </div>
      <p className="px-4 py-2 text-sm text-muted-foreground">{role.description}</p>
      <div className="px-4 py-2">
        <h4 className="text-sm font-medium mb-1">Permissions :</h4>
        <ul className="text-sm text-muted-foreground space-y-1 max-h-48 overflow-y-auto">
          {role.permissions.map((perm) => (
            <li key={perm.permission_code} className="flex items-center">
              <div className="h-1.5 w-1.5 bg-primary rounded-full mr-2" />
              {perm.permission_title}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onManagePermissions}
        className="w-full px-4 py-2 border-t border-primary text-primary text-sm flex items-center justify-center gap-2 hover:bg-primary/10"
      >
        {/* Example icon, replace as needed */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Gérer les permissions
      </button>
    </div>
  );
};

export default RoleCard;
