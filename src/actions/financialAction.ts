'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { IAddInstallmentToExistingPlan, ICreateFeeTypes, IRecordDeposit, IUpdateInstallment, IUpdatePlan } from "@/types/financialTypes";



export async function  createPlanWithInstallments (payload: ICreateFeeTypes) {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/pricelists`,
            {...payload},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->createPlanWithInstallments.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}


export async function getPlanList () {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/pricelists`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: unknown) {
        console.error('-->getPlanList.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}





export async function updatePlan(fee_code: string, payload: IUpdatePlan) {
    console.log('-->updateAPlan.payload', payload);
    try {
        const session = await verifySession();
        const token = session.accessToken;
        const response = await axios.put(
        `${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/pricelists/${fee_code}`,
        {...payload, total_amount: parseInt(payload.total_amount ?? "0")},
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        

        return {
        code: 'success' as const,
        error: null,
        data: response.data
        };
    } catch (error: unknown) {
        console.error('-->updateAPlan.error', error);
        return actionErrorHandler(error);
    }
}

export async function deletePlan(fee_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.delete(
      `${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/pricelists/${fee_code}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->deletePlan.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function addInstallmentToExistingPlan(payload: IAddInstallmentToExistingPlan) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.post(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/installments`,
            {...payload},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
        code: "success",
        error: null,
        data: response.data,
        };
    } catch (error: unknown) {
        console.log("-->addInstallmentToExistingPlan.error");
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateInstallment(installment_code: string, payload: IUpdateInstallment) {
    console.log('-->updateInstallment.payload', payload);
    console.log('-->updateInstallment.installment_code', installment_code);
    try {
        const session = await verifySession();
        const token = session.accessToken;
        const response = await axios.put(
        `${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/installments/${installment_code}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        

        return {
        code: 'success' as const,
        error: null,
        data: response.data
        };
    } catch (error: unknown) {
        console.error('-->updateInstallment.error', error);
        return actionErrorHandler(error);
    }
}

export async function deleteInstallment(installment_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;

        const response = await axios.delete(
            `${process.env.FINANCIAL_WORKER_ENDPOINT}/api/setup/installments/${installment_code}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
        code: "success",
        error: null,
        data: response.data,
        };
    } catch (error: unknown) {
        console.log("-->deleteInstallment.error");
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}





export async function getCurriculumFinancialSummary (curriculum_code: string, academic_year_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/curriculums/${academic_year_code}/financial-summary`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                curriculum_code,
            },
        });
        console.log('-->getCurriculumFinancialSummary.result', response);
        
        
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: unknown) {
        console.error('-->getCurriculumFinancialSummary.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function getStudentFinancialSummary (student_user_code: string, academic_year_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/students/${student_user_code}/financial-summary`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: {
                academic_year_code,
            },
        });
        
        
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: unknown) {
        console.error('-->getStudentFinancialSummary.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function recordDeposite(payload: IRecordDeposit) {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        

        const response = await axios.post(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/payments/record-and-allocate`,
            {...payload},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        console.log('-->recordDeposit.error')
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}


export async function getFeesTypes () {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.CURRICULUM_WORKER_ENDPOINT}/api/utilities/fees-types`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        
        
        return {
            code: 'success',
            error: null,
            data: response.data
        };
    } catch (error: unknown) {
        console.error('-->getFeesTypes.error', error);
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}