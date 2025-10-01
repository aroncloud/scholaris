'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
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
}

const PageHeader = ({ 
    description, 
    title, 
    children, 
    backUrl,
    backLabel = "Retour",
    loading = false,
    status
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
            <div className="mx-auto px-6 py-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Partie gauche avec bouton retour optionnel */}
                    <div className="flex items-center flex-wrap gap-3 min-w-0 flex-1">
                        {backUrl && (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={handleBack} 
                                    className="bg-gray-100 hover:bg-gray-200"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {backLabel}
                                </Button>
                                <Separator orientation="vertical" className="h-6 shrink-0" />
                            </>
                        )}
                        
                        <div className="min-w-0 flex gap-4 flex-nowrap items-center">
                            <div className='flex flex-col'>
                                <h1 className="text-xl font-semibold text-gray-900 truncate">
                                    {title}
                                </h1>
                                {description && (
                                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                                )}
                            </div>
                            {status && <div className="shrink-0">{status}</div>}
                        </div>
                    </div>

                    {/* Partie droite avec actions */}
                    {children && (
                        <div className="flex items-center space-x-3 shrink-0">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PageHeader;