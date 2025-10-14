/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { IRecordDeposit } from "@/types/financialTypes";



export async function getCurriculumFinancialSummary (curriculum_code: string, academic_year_code: string) {
    try {
        const session = await verifySession();
        const token = session.accessToken;
        
        const response = await axios.get(`${process.env.FINANCIAL_WORKER_ENDPOINT}/api/curriculums/${curriculum_code}/financial-summary`, {
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
        console.error('-->getCurriculumFinancialSummary.error', error);
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