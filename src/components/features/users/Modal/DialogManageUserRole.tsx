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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {  Shield, Plus, Minus, Save, X } from 'lucide-react';
import {  Role } from '@/types/userType';
import { getRoleColor } from '@/lib/utils';
import { IUserList } from '@/types/staffType';

interface DialogManageUserRoleProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUserList | null;
  availableRoles: Role[];
  onSave: (userId: string, selectedRoles: string[]) => void;
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

  // Initialize selected roles when user changes
  useEffect(() => {
    if (user) {
      const currentRoles = user.profiles.map(profile => profile.role_code);
      setSelectedRoles(currentRoles);
      setInitialRoles(currentRoles);
    }
  }, [user]);

  // Handle role selection/deselection
  const handleRoleToggle = (roleCode: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleCode)
        ? prev.filter(code => code !== roleCode)
        : [...prev, roleCode]
    );
  };

  // Handle save action
  const handleSave = () => {
    if (user) {
      onSave(user.userId, selectedRoles);
    }
  };

  // Check if there are changes
  const hasChanges = () => {
    if (selectedRoles.length !== initialRoles.length) return true;
    return selectedRoles.some(role => !initialRoles.includes(role));
  };

  // Get role counts for display
  const getAddedRoles = () => selectedRoles.filter(role => !initialRoles.includes(role));
  const getRemovedRoles = () => initialRoles.filter(role => !selectedRoles.includes(role));

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles
          </DialogTitle>
          <DialogDescription>
            Gérer les rôles pour l&apos;utilisateur sélectionné
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-hidden">
          {/* User Info */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {(user.first_name + " " + user.last_name)
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Current Roles Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Rôles actuels ({user.profiles.length})</h4>
            <div className="flex flex-wrap gap-2">
              {user.profiles.length > 0 ? (
                user.profiles.map(profile => (
                  <Badge 
                    key={profile.profile_code} 
                    variant="secondary" 
                    className={getRoleColor(profile.role_title)}
                  >
                    {profile.role_title}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aucun rôle assigné</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Role Selection */}
          <div className="space-y-3 flex-1 min-h-0">
            <h4 className="text-sm font-medium">
              Sélectionner les rôles ({selectedRoles.length}/{availableRoles.length})
            </h4>
            
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-2">
                {availableRoles.map(role => {
                  const isSelected = selectedRoles.includes(role.name);
                  const wasInitiallySelected = initialRoles.includes(role.name);
                  
                  return (
                    <div
                      key={role.name}
                      className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-background border-border hover:bg-muted/50'
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRoleToggle(role.name)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{role.name}</span>
                          {!wasInitiallySelected && isSelected && (
                            <Plus className="h-4 w-4 text-green-600" />
                          )}
                          {wasInitiallySelected && !isSelected && (
                            <Minus className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{role.users} utilisateur(s)</span>
                          <span>{role.permissions.length} permission(s)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Changes Summary */}
          {hasChanges() && (
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
              <h5 className="text-sm font-medium">Résumé des modifications</h5>
              
              {getAddedRoles().length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Plus className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">
                    {getAddedRoles().length} rôle(s) ajouté(s)
                  </span>
                </div>
              )}
              
              {getRemovedRoles().length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Minus className="h-4 w-4 text-red-600" />
                  <span className="text-red-700">
                    {getRemovedRoles().length} rôle(s) supprimé(s)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || loading}
            className="min-w-[100px]"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}