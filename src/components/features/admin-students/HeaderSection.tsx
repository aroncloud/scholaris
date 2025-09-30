/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { v4 as uuidv4 } from 'uuid';

import {
  Users,
  Clock,
} from "lucide-react";
import StatCard from "@/components/cards/StatCard";
import PageHeader from '@/layout/PageHeader';


const Header = () => {
  const StatsCardList = [
    {
      title: 'Demandes en attente',
      value: 1,
      description: 'Inscriptions à traiter',
      icon: <Clock className="h-6 w-6 text-muted-foreground" />,
    },
    {
      title: 'Étudiants actifs',
      value: 2,
      description: 'Actuellement inscrits',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
    },
  ];

  return (
    <>
      {/* Header */}
      <PageHeader
        title='Gestion des Étudiants'
        description='Gestion des inscriptions, étudiants actuels et diplômés'
      >

      </PageHeader>

      {/* Stats Cards */}
      {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {StatsCardList.map((card) => (
          <StatCard
            key={uuidv4()}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div> */}
    </>
  );
};

export default Header;
