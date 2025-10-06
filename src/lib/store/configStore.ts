/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  IConfig,
  IRegion,
  IDepartement,
  IArrondissement,
  IEthnicity,
  IEducationLvl,
  IRelationShip,
  ICountryMap,
  IRegionMap,
  IDepartmentMap,
} from '@/types/utilitiesTypes';

interface ConfigState {
  // État
  configs: IConfig | null;
  isLoaded: boolean;
  lastUpdated: number | null;


  setConfigs: (configs: IConfig) => void;
  clearConfigs: () => void;
  

  getRegions: () => IRegion[];
  getDepartments: () => IDepartement[];
  getArrondissements: () => IArrondissement[];
  getEthnicities: () => IEthnicity[];
  getEducationLevels: () => IEducationLvl[];
  getRelationships: () => IRelationShip[];
  

  getDepartmentsByRegion: (regionCode: string) => IDepartement[];
  getArrondissementsByDepartment: (departmentCode: string) => IArrondissement[];
  

  getCountryMap: () => ICountryMap;
  

  getRegionByCode: (regionCode: string) => IRegion | undefined;
  getDepartmentByCode: (departmentCode: string) => IDepartement | undefined;
  getArrondissementByCode: (arrondissementCode: string) => IArrondissement | undefined;
  getEthnicityByCode: (ethnicityCode: string) => IEthnicity | undefined;
  getEducationLevelByCode: (levelCode: string) => IEducationLvl | undefined;
  getRelationshipByCode: (typeCode: string) => IRelationShip | undefined;
}

const initialState = {
  configs: null,
  isLoaded: false,
  lastUpdated: null,
};

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setConfigs: (configs: IConfig) =>
        set({
          configs,
          isLoaded: true,
          lastUpdated: Date.now(),
        }),

      clearConfigs: () => set(initialState),

      getRegions: () => get().configs?.regions || [],
      
      getDepartments: () => get().configs?.departments || [],
      
      getArrondissements: () => get().configs?.arrondissements || [],
      
      getEthnicities: () => get().configs?.ethnicities || [],
      
      getEducationLevels: () => get().configs?.educationLevels || [],
      
      getRelationships: () => get().configs?.relationships || [],

      getDepartmentsByRegion: (regionCode: string) => {
        const departments = get().configs?.departments || [];
        return departments.filter(dept => dept.region_code === regionCode);
      },

      getArrondissementsByDepartment: (departmentCode: string) => {
        const arrondissements = get().configs?.arrondissements || [];
        return arrondissements.filter(arr => arr.department_code === departmentCode);
      },

      getCountryMap: (): ICountryMap => {
        const state = get();
        const regions = state.getRegions();
        const departments = state.getDepartments();
        const arrondissements = state.getArrondissements();

        const regionMap: IRegionMap[] = regions.map(region => {
          const regionDepartments = departments.filter(
            dept => dept.region_code === region.region_code
          );

          const departmentMap: IDepartmentMap[] = regionDepartments.map(dept => {
            const deptArrondissements = arrondissements.filter(
              arr => arr.department_code === dept.department_code
            );

            return {
              department_code: dept.department_code,
              department_name: dept.department_name,
              arrondissements: deptArrondissements.map(arr => ({
                arrondissement_code: arr.arrondissement_code,
                arrondissement_name: arr.arrondissement_name,
              })),
            };
          });

          return {
            region_code: region.region_code,
            region_name: region.region_name,
            departments: departmentMap,
          };
        });

        return { regions: regionMap };
      },

      getRegionByCode: (regionCode: string) => {
        const regions = get().getRegions();
        return regions.find(r => r.region_code === regionCode);
      },

      getDepartmentByCode: (departmentCode: string) => {
        const departments = get().getDepartments();
        return departments.find(d => d.department_code === departmentCode);
      },

      getArrondissementByCode: (arrondissementCode: string) => {
        const arrondissements = get().getArrondissements();
        return arrondissements.find(a => a.arrondissement_code === arrondissementCode);
      },

      getEthnicityByCode: (ethnicityCode: string) => {
        const ethnicities = get().getEthnicities();
        return ethnicities.find(e => e.ethnicity_code === ethnicityCode);
      },

      getEducationLevelByCode: (levelCode: string) => {
        const levels = get().getEducationLevels();
        return levels.find(l => l.level_code === levelCode);
      },

      getRelationshipByCode: (typeCode: string) => {
        const relationships = get().getRelationships();
        return relationships.find(r => r.type_code === typeCode);
      },
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => 
        typeof window !== 'undefined' ? localStorage : null as any
      ),
      // Ne persister que les données nécessaires
      partialize: (state) => ({
        configs: state.configs,
        isLoaded: state.isLoaded,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);