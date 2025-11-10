"use client";

import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { IGetUserDetail, IUpdateUserForm } from "@/types/staffType";
import { Combobox } from "@/components/ui/Combobox";
import { useConfigStore } from "@/lib/store/configStore";
import { DatePicker } from "@/components/DatePicker";
import { MARITAl_STATUS } from "@/constant";
import { Save } from "lucide-react";


interface DialogUpdateUserProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: IUpdateUserForm) => Promise<boolean>;
    userData: IGetUserDetail | null;
    loading?: boolean;
}


export function DialogUpdateUser({
    open,
    onOpenChange,
    onSave,
    userData,
    loading = false,
}: DialogUpdateUserProps) {

    const { getEthnicities } = useConfigStore();
    const ethnies = getEthnicities();
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<IUpdateUserForm>({
        defaultValues: {
            email: "",
            first_name: "",
            last_name: "",
            phone_number: "",
            other_email: "",
            other_phone: "",
            country: "Cameroon",
            city: "",
            address_details: "",
            avatar_url: "",
            place_of_birth: "",
            date_of_birth: "",
            ethnicity_code: "",
            marital_status_code: "",
            cni_number: "",
            cni_issue_date: "",
            cni_issue_location: "",
        },
    });

    useEffect(() => {
        console.log("userData changed:", userData);
        if (open && userData) {
            setValue("email", userData.email || "");
            setValue("first_name", userData.first_name || "");
            setValue("last_name", userData.last_name || "");
            setValue("phone_number", userData.phone_number || "");
            setValue("other_email", userData.other_email || "");
            setValue("other_phone", userData.other_phone || "");
            setValue("country", userData.country || "");
            setValue("city", userData.city || "");
            setValue("address_details", userData.address_details || "");
            setValue("avatar_url", userData.avatar_url || "");
            setValue("place_of_birth", userData.place_of_birth || "");

            // Convertir date_of_birth (timestamp ou string) en format ISO date
            if (userData.date_of_birth) {
                const dateOfBirth = typeof userData.date_of_birth === 'number'
                    ? new Date(userData.date_of_birth * 1000).toISOString().split('T')[0]
                    : userData.date_of_birth;
                setValue("date_of_birth", dateOfBirth);
            } else {
                setValue("date_of_birth", "");
            }

            setValue("ethnicity_code", userData.ethnicity_code || "");
            setValue("marital_status_code", userData.marital_status_code || "");
            setValue("cni_number", userData.cni_number || "");

            // Convertir cni_issue_date (timestamp ou string) en format ISO date
            if (userData.cni_issue_date) {
                const cniIssueDate = typeof userData.cni_issue_date === 'number'
                    ? new Date(userData.cni_issue_date * 1000).toISOString().split('T')[0]
                    : userData.cni_issue_date;
                setValue("cni_issue_date", cniIssueDate);
            } else {
                setValue("cni_issue_date", "");
            }

            setValue("cni_issue_location", userData.cni_issue_location || "");
        }
    }, [open, userData, setValue]);

    const handleCancel = () => {
        if (isSubmitting) return;
        reset();
        onOpenChange(false);
    };

    const handleSubmitForm = async (data: IUpdateUserForm) => {
        const result = await onSave(data);
        if (result) {
            reset();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="md:min-w-3xl max-h-[95vh] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
                    <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">Mettre à jour l&apos;utilisateur</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500 mt-1">
                        Modifiez les informations personnelles de {userData?.first_name} {userData?.last_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-6 max-h-[calc(95vh-180px)] overflow-y-auto">

                    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
                        {/* Informations personnelles */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Informations personnelles</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email principal */}
                                <div className="space-y-1 md:col-span-2">
                                    <Label htmlFor="email">Email principal</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email", {
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Format d'email invalide"
                                            }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.email ? "border-red-500" : ""}
                                        placeholder="email@exemple.com"
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Prénom */}
                                <div className="space-y-1">
                                    <Label htmlFor="first_name">Prénom</Label>
                                    <Input
                                        id="first_name"
                                        {...register("first_name", {
                                            minLength: { value: 2, message: "Le prénom doit contenir au moins 2 caractères" }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.first_name ? "border-red-500" : ""}
                                        placeholder="Entrez le prénom"
                                    />
                                    {errors.first_name && (
                                        <p className="text-red-600 text-sm">{errors.first_name.message}</p>
                                    )}
                                </div>

                                {/* Nom de famille */}
                                <div className="space-y-1">
                                    <Label htmlFor="last_name">Nom de famille</Label>
                                    <Input
                                        id="last_name"
                                        {...register("last_name", {
                                            minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.last_name ? "border-red-500" : ""}
                                        placeholder="Entrez le nom de famille"
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-600 text-sm">{errors.last_name.message}</p>
                                    )}
                                </div>

                                {/* Lieu de naissance */}
                                <div className="space-y-1">
                                    <Label htmlFor="place_of_birth">Lieu de naissance</Label>
                                    <Input
                                        id="place_of_birth"
                                        {...register("place_of_birth")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: Douala"
                                    />
                                </div>

                                {/* Date de naissance */}
                                <div className="space-y-1">
                                    <Label htmlFor="date_of_birth">Date de naissance</Label>
                                    <Controller
                                        name="date_of_birth"
                                        control={control}
                                        render={({ field }) => {
                                            const valueAsDate = field.value ? new Date(field.value) : undefined

                                            return (
                                                <DatePicker
                                                    label=""
                                                    defaultDate={valueAsDate}
                                                    minDate={new Date(1900, 0, 1)}
                                                    maxDate={new Date()}
                                                    onChange={(date) => {
                                                        field.onChange(date ? date.toISOString().split("T")[0] : "")
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                    {errors.date_of_birth && (
                                        <p className="text-red-600 text-sm">{errors.date_of_birth.message}</p>
                                    )}
                                </div>

                                {/* Ethnie */}
                                <div className="space-y-1">
                                    <Label htmlFor="ethnicity_code">Ethnie</Label>
                                    <Controller
                                        name="ethnicity_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Combobox
                                                options={ethnies.map(eth => ({
                                                    value: eth.ethnicity_code,
                                                    label: eth.ethnicity_name
                                                }))}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Sélectionner une ethnie"
                                                className='py-5'
                                            />
                                        )}
                                    />
                                </div>

                                {/* Statut marital */}
                                <div className="space-y-1">
                                    <Label htmlFor="marital_status_code">Statut marital</Label>
                                    <Controller
                                        name="marital_status_code"
                                        control={control}
                                        render={({ field }) => (
                                            <Combobox
                                                options={MARITAl_STATUS}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Sélectionner le statut"
                                                className='py-5'
                                            />
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pièce d'identité (CNI) */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Carte Nationale d&apos;Identité</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Numéro CNI */}
                                <div className="space-y-1">
                                    <Label htmlFor="cni_number">Numéro CNI</Label>
                                    <Input
                                        id="cni_number"
                                        {...register("cni_number")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: 123456789"
                                    />
                                </div>

                                {/* Lieu de délivrance */}
                                <div className="space-y-1">
                                    <Label htmlFor="cni_issue_location">Lieu de délivrance</Label>
                                    <Input
                                        id="cni_issue_location"
                                        {...register("cni_issue_location")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: Yaoundé"
                                    />
                                </div>

                                {/* Date de délivrance */}
                                <div className="space-y-1 md:col-span-2">
                                    <Label htmlFor="cni_issue_date">Date de délivrance</Label>
                                    <Controller
                                        name="cni_issue_date"
                                        control={control}
                                        render={({ field }) => {
                                            const valueAsDate = field.value ? new Date(field.value) : undefined

                                            return (
                                                <DatePicker
                                                    label=""
                                                    defaultDate={valueAsDate}
                                                    minDate={new Date(1900, 0, 1)}
                                                    maxDate={new Date()}
                                                    onChange={(date) => {
                                                        field.onChange(date ? date.toISOString().split("T")[0] : "")
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Coordonnées */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Coordonnées</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Téléphone principal */}
                                <div className="space-y-1">
                                    <Label htmlFor="phone_number">Téléphone principal</Label>
                                    <Input
                                        id="phone_number"
                                        {...register("phone_number", {
                                            pattern: {
                                                value: /^[+]?[\d\s\-()]+$/,
                                                message: "Format de téléphone invalide"
                                            }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.phone_number ? "border-red-500" : ""}
                                        placeholder="Ex: +237 6XX XX XX XX"
                                    />
                                    {errors.phone_number && (
                                        <p className="text-red-600 text-sm">{errors.phone_number.message}</p>
                                    )}
                                </div>

                                {/* Téléphone secondaire */}
                                <div className="space-y-1">
                                    <Label htmlFor="other_phone">Téléphone secondaire</Label>
                                    <Input
                                        id="other_phone"
                                        {...register("other_phone", {
                                            pattern: {
                                                value: /^[+]?[\d\s\-()]+$/,
                                                message: "Format de téléphone invalide"
                                            }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.other_phone ? "border-red-500" : ""}
                                        placeholder="Ex: +237 6XX XX XX XX"
                                    />
                                    {errors.other_phone && (
                                        <p className="text-red-600 text-sm">{errors.other_phone.message}</p>
                                    )}
                                </div>

                                {/* Email secondaire */}
                                <div className="space-y-1 md:col-span-2">
                                    <Label htmlFor="other_email">Email secondaire</Label>
                                    <Input
                                        id="other_email"
                                        type="email"
                                        {...register("other_email", {
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Format d'email invalide"
                                            }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.other_email ? "border-red-500" : ""}
                                        placeholder="email.secondaire@exemple.com"
                                    />
                                    {errors.other_email && (
                                        <p className="text-red-600 text-sm">{errors.other_email.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Adresse */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Adresse</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Pays */}
                                <div className="space-y-1">
                                    <Label htmlFor="country">Pays</Label>
                                    <Input
                                        id="country"
                                        {...register("country")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: Cameroun"
                                    />
                                </div>

                                {/* Ville */}
                                <div className="space-y-1">
                                    <Label htmlFor="city">Ville</Label>
                                    <Input
                                        id="city"
                                        {...register("city")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: Yaoundé"
                                    />
                                </div>

                                {/* Détails de l'adresse */}
                                <div className="space-y-1 md:col-span-2">
                                    <Label htmlFor="address_details">Détails de l&apos;adresse</Label>
                                    <Textarea
                                        id="address_details"
                                        {...register("address_details")}
                                        disabled={isSubmitting || loading}
                                        placeholder="Ex: 1234 Nom de la rue, Quartier"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Autres informations */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Autres informations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* URL Avatar */}
                                <div className="space-y-1">
                                    <Label htmlFor="avatar_url">URL de l&apos;avatar</Label>
                                    <Input
                                        id="avatar_url"
                                        type="url"
                                        {...register("avatar_url", {
                                            pattern: {
                                                value: /^https?:\/\/.+\..+/,
                                                message: "URL invalide"
                                            }
                                        })}
                                        disabled={isSubmitting || loading}
                                        className={errors.avatar_url ? "border-red-500" : ""}
                                        placeholder="https://exemple.com/chemin/vers/avatar.jpg"
                                    />
                                    {errors.avatar_url && (
                                        <p className="text-red-600 text-sm">{errors.avatar_url.message}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>

                <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting || loading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        // variant={'info'}
                        disabled={isSubmitting || loading}
                        className="min-w-[120px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}