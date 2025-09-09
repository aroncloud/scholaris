export interface ICreateResource{
    name: string;
    capacity: number;
    location: string;
    type?: "AMPHI" | "TD" | "LAB";
    description?: string;
}
