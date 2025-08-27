import React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SkeletonFilieresTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filières d&apos;études</CardTitle>
        <CardDescription>Gestion des programmes de formation</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche et filtre */}
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-64 rounded-md" />
          <Skeleton className="h-10 w-48 rounded-md" />
        </div>

        {/* Table structure */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filière</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Maquettes</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-60" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SkeletonFilieresTab