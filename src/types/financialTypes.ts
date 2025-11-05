export interface IStudentGetFinancialInfo {
  enrollment: {
    enrollment_code: string;
    curriculum_code: string;
    user_code: string;
    first_name: string;
    last_name: string;
    place_of_birth: string | null;
    date_of_birth: string | null;
    gender: "MALE" | "FEMALE" | string; // tu peux restreindre si tu connais toutes les valeurs possibles
    student_number: string;
  };
  enrollment_code: string;
  total_due: number;
  total_paid: number;
  remaining_balance: number;
  debts: IDebt[];
}

export interface IGetStudentSummary {
  total_due: number;
  total_paid: number;
  remaining_balance: number;
  available_credit: number;
  debts: IDebt[];
}

export interface IDebt {
  debt_code: string;
  enrollment_code: string;
  installment_code: string;
  amount_due: number;
  amount_paid: number;
  due_date: string; // ISO date (YYYY-MM-DD)
  paid_date: string | null;
  status_code: string;
  fee_code: string;
  type_code: string;
  title: string;
  amount: number;
  currency: string;
}




export interface IGetStudentDepositHistory {
  total_due: number;
  total_paid: number;
  remaining_balance: number;
  available_credit: number;
  debts: IDebt[];
}




export interface IRecordDeposit {
    "student_user_code": string,
    "amount": number,
    "payment_date": string,
    "reference": string,
    "payment_method": string
}


export interface IGetPlan {
  fee_code: string;
  curriculum_code: string;
  total_amount: number;
  currency: string;
  is_active: number; // 1 ou 0
  installments: IInstallment[];
}

export interface IInstallment {
  installment_code: string;
  fee_code: string;
  type_code: string;
  title: string;
  amount: number;
  due_date: string; // format ISO string : "YYYY-MM-DD"
  currency: string;
}


export interface IGetPlan {
  fee_code: string;
  curriculum_code: string;
  total_amount: number;
  currency: string;
  is_active: number; // 1 ou 0
  installments: IInstallment[];
}

export interface IInstallment {
  installment_code: string;
  fee_code: string;
  type_code: string;
  title: string;
  amount: number;
  due_date: string; // format ISO string : "YYYY-MM-DD"
  currency: string;
}

export interface IGetFeeType {
  type_code: string;
  title: string;
  description: string;
  is_mandatory: number; // 1 ou 0
}


export interface ICreateFeeTypes {
  curriculum_code: string;
  total_amount: number;
  installments: IInstallment[];
}

export interface IInstallment {
  type_code: string;
  title: string;
  amount: number;
  due_date: string; // format ISO string : "YYYY-MM-DD"
}

export interface IUpdatePlan {
  "total_amount"?: string,
  "is_active"?: number
}

export interface IAddInstallmentToExistingPlan {
  "fee_code": string,
  "type_code": string,
  "title": string,
  "amount": number,
  "due_date": string
}

export interface IUpdateInstallment {
  "title"?: string,
  "amount"?: number,
  "due_date"?: string
}