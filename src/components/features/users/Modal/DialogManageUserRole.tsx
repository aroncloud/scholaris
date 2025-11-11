import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Badge from '@/components/custom-ui/Badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/custom-ui/Avatar';
import { Shield, Plus, Minus, Save } from 'lucide-react';
import { IGetRole, IGetUser } from '@/types/staffType';

interface DialogManageUserRoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IGetUser | null;
  availableRoles: IGetRole[];
  onSave: (userId: string, rolesToRemove: string[], rolesToAdd: string[]) => void;
  loading?: boolean;
}

export default function DialogManageUserRole({
  open,
  onOpenChange,
  user,
  availableRoles,
  onSave,
  loading = false
}: DialogManageUserRoleProps) {

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [initialRoles, setInitialRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const currentRoles = user.profiles.map(profile => profile.role_code);
      setSelectedRoles(currentRoles);
      setInitialRoles(currentRoles);
    }
  }, [user, availableRoles]);

  const handleRoleToggle = (roleCode: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleCode)
        ? prev.filter(code => code !== roleCode)
        : [...prev, roleCode]
    );
  };

  const getAddedRoles = () =>
    selectedRoles.filter(role => !initialRoles.includes(role));

  const getRemovedRoles = () =>
    initialRoles.filter(role => !selectedRoles.includes(role));

  const hasChanges = () => {
    if (selectedRoles.length !== initialRoles.length) return true;
    return selectedRoles.some(role => !initialRoles.includes(role));
  };

  const handleSave = () => {
    if (user) {
      onSave(user.user_code, getRemovedRoles(), getAddedRoles());
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">

        {/*  HEADER — sticky + border + padding */}
        <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-500 mt-1">
            Gérer les rôles associés à l&apos;utilisateur
          </DialogDescription>
        </DialogHeader>

        {/*  MAIN CONTENT — padded + scrollable */}
        <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">

          {/* User Info Panel */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <Avatar
              fallback={`${user.first_name} ${user.last_name}`}
              variant="info"
              size="lg"
            />
            <div>
              <h3 className="font-semibold text-slate-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-slate-600">{user.email}</p>
            </div>
          </div>

          {/* Current roles */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-800">
              Rôles actuels ({user.profiles.length})
            </h4>

            <div className="flex flex-wrap gap-2">
              {user.profiles.length > 0 ? (
                user.profiles.map(profile => (
                  <Badge
                    key={profile.profile_code}
                    variant="info"
                    size="sm"
                    label={profile.role_title}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">Aucun rôle assigné</p>
              )}
            </div>
          </div>


          {/* Role Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-800">
              Sélectionner les rôles ({selectedRoles.length}/{availableRoles.length})
            </h4>

            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {availableRoles.map(role => {
                  const isSelected = selectedRoles.includes(role.role_code);
                  const wasInitiallySelected = initialRoles.includes(role.role_code);

                  return (
                    <div
                      key={role.role_code}
                      className={`flex items-start space-x-3 p-3 rounded-xl border transition-all duration-200 ${isSelected
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRoleToggle(role.role_code)}
                        className="mt-1"
                      />

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">
                            {role.role_code}
                          </span>

                          {!wasInitiallySelected && isSelected && (
                            <Plus className="h-4 w-4 text-green-600" />
                          )}
                          {wasInitiallySelected && !isSelected && (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                        </div>

                        <p className="text-sm text-slate-600">
                          {role.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>{role.user_count} utilisateur(s)</span>
                          <span>{role.permissions.length} permission(s)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Modification Summary */}
          {hasChanges() && (
            <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <h5 className="text-sm font-medium text-slate-800">
                Résumé des modifications
              </h5>

              {getAddedRoles().length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Plus className="h-4 w-4" />
                  {getAddedRoles().length} rôle(s) ajouté(s)
                </div>
              )}

              {getRemovedRoles().length > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <Minus className="h-4 w-4" />
                  {getRemovedRoles().length} rôle(s) supprimé(s)
                </div>
              )}
            </div>
          )}
        </div>

        {/*  FOOTER — matches Feedback & CreateUser */}
        <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-end w-full gap-3">

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex items-center"
            >
              Annuler
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasChanges() || loading}
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>

          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}


