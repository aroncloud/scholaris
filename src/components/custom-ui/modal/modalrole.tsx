'use client';

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assignRole, removeRole } from "@/actions/roleandpermision/assignerRole";
import { showToast } from "@/components/ui/showToast";

type Action = "assign" | "remove";

type FormValues = {
  userCode: string;
  action: Action;
  roles: string[];
};

type RoleActionFormProps = {
  userCode: string;
  locale?: "fr" | "en";
  userProfiles?: { role_code: string; profile_code: string; role_title: string }[];
  availableRoles: { value: string; label: string }[];
  onClose?: (result?: {
    userCode: string;
    roles?: string[];
    action: Action;
    profileCodes?: string[];
    translatedRoleNames?: string[];
  }) => void;
};

export default function RoleActionForm({
  userCode,
  locale = "fr",
  userProfiles = [],
  availableRoles,
  onClose,
}: RoleActionFormProps) {
  const form = useForm<FormValues>({
    defaultValues: { userCode, action: "assign", roles: [] },
  });

  const selectedAction = form.watch("action");
  const selectedRoles = form.watch("roles");

  // Dynamically filter roles based on action
  const roleOptions = React.useMemo(() => {
    const assignedRoleCodes = userProfiles.map(p => p.role_code);
    if (selectedAction === "assign") {
      return availableRoles.filter(r => !assignedRoleCodes.includes(r.value));
    } else {
      return userProfiles.map(p => ({
        value: p.role_code,
        label: p.role_title,
        profile_code: p.profile_code,
      }));
    }
  }, [selectedAction, availableRoles, userProfiles]);

  const toggleRole = (roleValue: string) => {
    const currentRoles = form.getValues("roles");
    form.setValue(
      "roles",
      currentRoles.includes(roleValue)
        ? currentRoles.filter(r => r !== roleValue)
        : [...currentRoles, roleValue]
    );
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!data.roles.length) {
      showToast({
        variant: "error-solid",
        message: locale === "fr" ? "Veuillez sélectionner au moins un rôle" : "Please select at least one role",
      });
      return;
    }

    try {
      if (data.action === "assign") {
        const results = await Promise.all(data.roles.map(role => assignRole(data.userCode, role)));
        const errors = results.filter(r => r.code === "error");
        if (errors.length) throw new Error(errors.map(e => e.error).join(", "));
      } else {
        const results = await Promise.all(
          data.roles.map(role => {
            const profile = userProfiles.find(p => p.role_code === role);
            return removeRole(data.userCode, role, profile?.profile_code ?? "");
          })
        );
        const errors = results.filter(r => r.code === "error");
        if (errors.length) throw new Error(errors.map(e => e.error).join(", "));
      }

      showToast({
        variant: "success-solid",
        message: locale === "fr" ? "Opération réussie" : "Operation successful",
      });

      onClose?.({
        userCode: data.userCode,
        roles: data.roles,
        action: data.action,
        profileCodes:
          data.action === "remove"
            ? data.roles.map(r => userProfiles.find(p => p.role_code === r)?.profile_code ?? "")
            : undefined,
        translatedRoleNames: data.roles.map(r => availableRoles.find(ar => ar.value === r)?.label ?? r),
      });

      form.reset({ userCode: data.userCode, action: "assign", roles: [] });
    } catch (err: any) {
      showToast({
        variant: "error-solid",
        message: err.message ?? "Role operation failed",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Action Tabs */}
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tabs value={field.value} onValueChange={field.onChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="assign">{locale === "fr" ? "Assigner" : "Assign"}</TabsTrigger>
                      <TabsTrigger value="remove">{locale === "fr" ? "Retirer" : "Remove"}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Roles Grid */}
          <FormField
            control={form.control}
            name="roles"
            render={() => (
              <FormItem>
                <div className="flex justify-between items-center mb-4">
                  {selectedRoles.length > 0 && (
                    <Badge variant="secondary">
                      {selectedRoles.length} {locale === "fr" ? "sélectionné(s)" : "selected"}
                    </Badge>
                  )}
                </div>
                <FormControl>
                  <div className="space-y-3 min-h-[200px]">
                    {roleOptions.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {roleOptions.map(role => (
                          <Button
                            key={role.value}
                            type="button"
                            variant={selectedRoles.includes(role.value) ? "default" : "outline"}
                            className={`justify-start h-auto py-2 px-3 text-left transition-all duration-200 ${
                              selectedRoles.includes(role.value)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => toggleRole(role.value)}
                          >
                            <span className="flex-1 text-sm font-medium truncate">{role.label}</span>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {selectedAction === "assign"
                          ? locale === "fr"
                            ? "Aucun rôle disponible"
                            : "No roles available"
                          : locale === "fr"
                          ? "Aucun rôle à retirer"
                          : "No roles to remove"}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Form Buttons */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="outline" className="w-auto px-4 py-2" onClick={() => onClose?.()}>
              {locale === "fr" ? "Annuler" : "Cancel"}
            </Button>
            <Button
              type="submit"
              className="w-auto px-4 py-2"
              disabled={selectedRoles.length === 0 || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? locale === "fr"
                  ? "Traitement..."
                  : "Processing..."
                : locale === "fr"
                ? "Valider"
                : "Validate"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
