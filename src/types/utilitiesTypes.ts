export interface IRegion {
  region_code: string;
  region_name: string;
}

export interface IDepartement {
  department_code: string;
  region_code: string;
  department_name: string;
}

export interface IArrondissement {
  arrondissement_code: string;
  department_code: string;
  arrondissement_name: string;
}

export interface IEthnicity {
  ethnicity_code: string;
  ethnicity_name: string;
}

export interface IEducationLvl {
  level_code: string;
  title: string;
}

export interface IRelationShip {
  type_code: string;
  title: string;
  description: string | null;
}

export interface IConfig {
  arrondissements: IArrondissement[];
  departments: IDepartement[];
  educationLevels: IEducationLvl[];
  ethnicities: IEthnicity[];
  regions: IRegion[];
  relationships: IRelationShip[];
}



// ==== MAP ==== //

export interface IArrondissementMap {
  arrondissement_code: string;
  arrondissement_name: string;
}

export interface IDepartmentMap {
  department_code: string;
  department_name: string;
  arrondissements: IArrondissementMap[];
}

export interface IRegionMap {
  region_code: string;
  region_name: string;
  departments: IDepartmentMap[];
}

export interface ICountryMap {
  regions: IRegionMap[];
}