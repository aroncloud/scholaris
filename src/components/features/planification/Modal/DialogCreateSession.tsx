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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Save } from 'lucide-react';
import { IUserList } from '@/types/staffType';
import { Role } from '@/types/userType';

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

  // Initialize selected roles when user changes
  useEffect(() => {
    if (user) {
      const currentRoles = user.profiles.map(profile => profile.role_code);
      setSelectedRoles(currentRoles);
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

  const handleCancel = () => {
    if (loading) return;
    onOpenChange(false);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion des rôles
          </DialogTitle>
          <DialogDescription>
            Gérer les rôles de l&apos;utilisateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar>
              <AvatarFallback>
                {(user.first_name + " " + user.last_name)
                  .split(" ")
                  .map(n => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Rôles disponibles</h4>
              <Badge variant="outline">{selectedRoles.length} sélectionné(s)</Badge>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {availableRoles.map(role => {
                  const isSelected = selectedRoles.includes(role.name);
                  
                  return (
                    <div
                      key={role.name}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleRoleToggle(role.name)}
                      />
                      
                      <div className="flex-1">
                        <div className="font-medium">{role.name}</div>
                        <p className="text-sm text-muted-foreground">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}