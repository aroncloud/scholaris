'use client'

import { v4 as uuidv4 } from 'uuid';

import {
  Users,
  Clock,
} from "lucide-react";
import StatCard from "@/components/cards/StatCard";


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
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight w-full">
            Gestion des Étudiants
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base w-full">
            Gestion des inscriptions, étudiants actuels et diplômés
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {StatsCardList.map((card) => (
          <StatCard
            key={uuidv4()}
            title={card.title}
            value={card.value}
            description={card.description}
            icon={card.icon}
          />
        ))}
      </div>
    </>
  );
};

export default Header;
