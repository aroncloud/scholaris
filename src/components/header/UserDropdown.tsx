/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "@bprogress/next/app";
import { useUserStore } from "@/store/useAuthStore";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const isHydrated = useUserStore((state) => state.isHydrated);

  const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => setIsOpen(false);

  const handleLogout = () => {
    clearUser();
    closeDropdown();
    router.push("/signin"); // adjust to your SignIn page route
  };

  if (!isHydrated || !user) return null; // hide dropdown until hydrated

  // ✅ Build fullname safely
  const firstName = (user as any)?.firstname || "";
  const lastName = (user as any)?.lastname || "";
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.roles[0] || "Utilisateur";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-white"
      >
        <div className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-white/30 bg-white/20 text-white font-medium text-lg">
          {fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col justify-center text-left leading-tight">
          <p className="text-sm font-semibold text-white">{fullName}</p>
          <p className="text-xs text-white/70">{user.email}</p>
        </div>
      </button>

      {isOpen && (
        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-3"
        >
          <div className="mb-3">
            <p className="font-medium">{fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/edit-profile">
                <DropdownItem onItemClick={closeDropdown}>
                  Edit Profile
                </DropdownItem>
              </Link>
            </li>
            <li>
              <Link href="/profile">
                <DropdownItem onItemClick={closeDropdown}>
                  Account Profile
                </DropdownItem>
              </Link>
            </li>
            <li>
              <Link href="/support">
                <DropdownItem onItemClick={closeDropdown}>
                  Support
                </DropdownItem>
              </Link>
            </li>
            <li>
              <DropdownItem
                onItemClick={handleLogout}
                className="text-red-500 hover:bg-red-50"
              >
                Sign Out
              </DropdownItem>
            </li>
          </ul>
        </Dropdown>
      )}
    </div>
  );
}
