export interface ILoginForm {
  username: string,
  password: string,
}

export interface IEnrollmentRequest {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  filiere: string;
  niveau: string;
  datedemande: string;
  statut: "en_attente" | "approuve" | "rejete";
  documents: string[];
  commentaire?: string;
}

export interface IStudent {
  id: string;
  numeroEtudiant: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  filiere: string;
  niveau: string;
  statut: "actif" | "suspendu" | "diplome" | "abandonne" | "transfere";
  moyenne?: number;
  absences?: number;
  retards?: number;
  promotion?: string;
  dateInscription: string;
  dateObtention?: string;
  mention?: string;
  moyenneFinale?: number;
  statutFinancier?: "a_jour" | "en_retard" | "bourseuse" | "exoneree";
  montantDu?: number;
}

export interface ICreateStudent {
  "password_plaintext": string,
  "email": string,
  "first_name": string,
  "last_name": string,
  "gender": gender,
  "phone_number": string,
  "curriculum_code": string,
  "student_number": string,
  "education_level_code": string
}

export interface IInitiateStudentApplication {
  curriculum_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  student_number: string;
  gender: gender;
}

export type gender = 'FEMALE' | 'MALE';

export interface ICurriculum {
  curriculum_code: string;
  curriculum_name: string;
  study_level: string;
  program_code: string;
  program_name: string;
}

export interface IListStudent {
  user_code: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: number; // timestamp
  updated_at: number; // timestamp
  last_login_at: number | null; // peut être null
  phone_number: string;
  student_number: string;
  curriculum_code: string;
  status_code: string;
  financial_status?: 'PAID' | 'PENDING' | 'PARTIALLY_PAID' | 'OVERDUE' | 'EXEMPTED' | 'UNPAID' | 'REFUNDED';
  cirriculum: ICurriculum;
}

export interface IUserProfile {
  profile_code: string;
  role_code: string;
  role_title: string;
}

export interface IUserList {           // added id property for user identifier
  user_code: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: number;
  updated_at: number;
  last_login_at: number | null;
  status_code: string;
  profiles: {
      "profile_code": string,
      "role_code": string,
      "role_title": string
  }[];
}

export interface ICreateUser {
  user_code?: string; 
  password_plaintext?: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: gender;
  phone_number: string;

  staff_number?: string;
  job_title?: string;
  department?: string;
  hiring_date?: string;
  salary?: number;

  profiles?: string[]; 
}



// export interface ICreateUser {
//   user_code?: string;
//   password_plaintext: string,
//   email: string,
//   first_name: string,
//   last_name: string,
//   gender: gender,
//   phone_number: string

// }

































export type CreateUserType = {
    "firstname": string;
    "lastname": string;
    "gender": string;
    "email": string;
    "userId": string;
    "phone": string;
    "password": string;
    "addressData": AddressDataType;
};


export interface ICreateUserParam {
    "email":string,
    "phone":string,
    "gender":string,
    "lastname":string,
    "firstname":string,
    "password": string,
    "role":string,
    "addressData": AddressDataType
}

export interface IUpdateUser {
  "userId": string,
  "lastname": string,
  "firstname": string,
  "phone": string,
  "avatarUrl": string,
}

export type AddressDataType = {
    "street": string;
    "city": string;
    "country": string;
}

// types/user.ts

export type UserAuthorisation = {
    resource: string;
    permissions: string[];
};
  
export type UserProfile = {
    id: string;
    name: string;
    role: string;
};
  
export interface UserState {
    // État utilisateur
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    profiles: UserProfile[];
    authorisations: UserAuthorisation[];
    isAuthenticated: boolean;
    
    // Actions
    setUser: (userData: {
      email: string;
      firstName: string;
      lastName: string;
      profiles: UserProfile[];
      authorisations: UserAuthorisation[];
    }) => void;
    clearUser: () => void;
    updateUserProfile: (profile: UserProfile) => void;
    updateAuthorisations: (authorisations: UserAuthorisation[]) => void;
}

export interface SeachUserParams {
  orderBy?: string;
  term?: string;
  orderMode?: 'asc' | 'desc';
  offset?: number;
  limit?: number;
  page?: number;
  role?: string;
}

export type ManagerRole = "ADMIN" | "SUPPORT";
export type AllRole = "ALL" | "ADMIN" | "SUPPORT" | "LANDLORD" | "MANAGER" | "RENTER"

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  city: string;
  street: string;
  country: string;
  password: string;
  role: string;
};

export interface IUser {
  id: string;
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: string[];
  gender: string;
  city: string;
  street: string;
  name?: string;
  country: string;
  avatarUrl: string;
  status: string;
  NIU: string;
  permissions?: string []
  createdAt?: string;
}

export interface IGetUserDetail {
    // Informations d'identification
    user_code: string;
    user_name: string;
    email: string;
    
    // Informations personnelles de base
    first_name: string;
    last_name: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | string; // Utilisation d'une union pour le genre
    phone_number: string | null;
    other_email: string | null;
    other_phone: string | null;
    
    // Informations de localisation (peuvent être null)
    country: string | null;
    city: string | null;
    street: string | null;
    address_details: string | null;
    
    // État et vérification
    status_code: 'ACTIVE' | 'INACTIVE' | string; // Utilisation d'une union pour le statut
    is_verified: 0 | 1; // 0 pour non vérifié, 1 pour vérifié
    avatar_url: string | null;
    
    // Informations biographiques étendues
    place_of_birth: string | null;
    date_of_birth: number | null; // Assumant que c'est un timestamp ou un format de date
    ethnicity_code: string | null;
    marital_status_code: string | null;
    
    // Informations d'identité (CNI - Carte Nationale d'Identité)
    cni_number: string | null;
    cni_issue_date: number | null; // Assumant un timestamp
    cni_issue_location: string | null;
    
    // Horodatages (timestamps en secondes)
    created_at: number;
    updated_at: number;
    last_login_at: number | null;
}

export interface IUpdateUserForm {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  other_email?: string;
  other_phone?: string;
  country?: string;
  city?: string;
  address_details?: string;
  avatar_url?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  ethnicity_code?: string;
  marital_status_code?: string;
  cni_number?: string;
  cni_issue_date?: string;
  cni_issue_location?: string;
}

export interface IUserPermission {
  "Code": string,
  "Title": string,
  "Description": string,
  "IsActive": number
}

export interface IInviteManagerRequest {
  "profilCode": string,
  "managerCode": string,
  "assetCode": string,
  "title":string,
  "body": {
    [key: string]: boolean;
  },
  "notes": string
}

export interface IProfileDetails {
  Code: string,
  Status: string,
  RoleCode: string,
  CreatedAt: string,
  IsActive: number,
  UserCode: string
}
export type UserStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'ALL'




export interface IUserData {
  Code: string;
  AddressCode: string;
  Email: string;
  Firstname: string;
  Gender: "MALE" | "FEMALE" | string;
  Lastname: string;
  NIU: string;
  OtherEmail: string | null;
  OtherPhone: string | null;
  Phone: string;
  Status: string;
  AvatarUrl: string;
  Profiles: IUserProfile[];
  Address: IUserAddress;
  Subscriptions: ISubscription[];
}

export interface IUserProfile {
  Code: string;
  Status: string;
  RoleCode: "RENTER" | "LANDLORD" | string;
  CreatedAt: string; // format: "YYYY-MM-DD"
  IsActive: number;
  UserCode: string;
}

export interface IUserAddress {
  Code: string;
  City: string;
  Country: string;
  Street: string;
  Details: string | null;
}

export interface ISubscription {
  Code: string;
  Quantity: string;
  StartDate: string; // ISO date string
  EndDate: string; // ISO date string
  StatusCode: string;
  Notes: string;
  IsActive: number;
  UserCode: string;
  PlanCode: string;
  Consumptions: IConsumption[];
  Plan: IPlan;
}

export interface IConsumption {
  Code: string;
  Quantity: number;
  CreatedAt: string; // "YYYY-MM-DD HH:mm:ss"
  CompoCode: string;
  IsActive: number;
  Remaining: number;
  SubCode: string;
}

export interface IPlan {
  Code: string;
  Title: string;
  Price: number;
  Currency: string;
  CreatedAt: string; // "YYYY-MM-DD HH:mm:ss"
  Description: string;
  IsActive: number;
}