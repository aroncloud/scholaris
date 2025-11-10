'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LucideIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface PageHeaderProps {
    title: string;
    description?: string;
    children?: React.ReactNode;
    backUrl?: string;
    backLabel?: string;
    loading?: boolean;
    status?: React.ReactNode;
    Icon?: LucideIcon
}

const PageHeader = ({ 
    description, 
    title, 
    children, 
    backUrl,
    backLabel = "Retour",
    loading = false,
    status,
    Icon = Users
}: PageHeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        }
    };

    if (loading) {
        return (
            <div className="bg-white border-b border-gray-200">
                <div className="mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {backUrl && (
                                <>
                                    <Skeleton className="h-8 w-24" />
                                    <Separator orientation="vertical" className="h-6" />
                                </>
                            )}
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                {description && <Skeleton className="h-4 w-64" />}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="mx-auto px-2 md:px-6 py-3.5">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    {/* Partie gauche avec bouton retour optionnel */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {backUrl && (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleBack} 
                                    className="bg-gray-100 hover:bg-gray-200 shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {backLabel}
                                </Button>
                                <Separator orientation="vertical" className="h-6 shrink-0" />
                            </>
                        )}
                        
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="hidden w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl md:flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <div className="flex flex-col min-w-0 flex-1">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight break-words">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-sm md:text-base text-gray-600 font-medium break-words">{description}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status et actions alignés */}
                    <div className="flex items-center gap-3 shrink-0">
                        {status && (
                            <div className="hidden md:block shrink-0">
                                {status}
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;