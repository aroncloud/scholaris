export interface ICreateResource{
    name: string;
    capacity: number;
    location: string;
    type?: "AMPHI" | "TD" | "LAB";
    description?: string;
}

export interface ICreateClassroom {
  resource_name: string;
  capacity: number;
  location: string;
  is_available: 1 | 0;
}


export interface IGetClassroom {
  resource_code: string;
  type_code: string;
  resource_name: string;
  capacity: number;
  location: string;
  is_available: 1 | 0;
}