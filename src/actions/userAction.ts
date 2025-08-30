'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateUser } from "@/types/userTypes";




export async function createUser(user: ICreateUser) {
  console.log('-->createUser', user)
  try {
    const session = await verifySession();
    const token = session.accessToken;

    // Backend expects snake_case keys and only staff info
    const payload = {
      password_plaintext: user.password_plaintext || "Default123!",
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      gender: user.gender,
      phone_number: user.phone_number,
      staff_number: user.staff_number || "STAFF-" + Date.now(),
      job_title: user.job_title || "Staff",
      department: user.department || "General",
      hiring_date: user.hiring_date || new Date().toISOString().split("T")[0],
      salary: user.salary || 0
    };

    const response = await axios.post(
      `${process.env.AIM_WORKER_ENDPOINT}/api/staff/hire`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log('-->result', response.data);

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log('-->createUser.error')
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


// export async function getUserList(){
//     try {
//         const session = await verifySession();
        
//         const token = session.accessToken;
        

//         const response = await axios.get(`${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles?limit=10&offset=0`,{
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//         });
//         console.log('-->result', response);
        
//         return {
//             code: 'success',
//             error: null,
//             data: response.data
//         }
//     } catch (error: unknown) {
//         console.log('-->userAction.getUserList.error')
//         const errResult = actionErrorHandler(error);
//         return errResult;
//     }
// }
export async function getUserList(limit = 100, offset = 0) {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.get(
      `${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles?limit=${limit}&offset=${offset}`,
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
    console.log("-->userAction.getUserList.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}


export async function deactivateUser (userCode: string) {
    console.log('-->deactivateUser', userCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.patch(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${userCode}/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function deleteUser (userCode: string) {
    console.log('-->deleteUser', userCode)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.delete(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${userCode}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('-->result', response);
        
        return {
            code: 'success',
            error: null,
            data: response.data
        }
    } catch (error: unknown) {
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}

export async function updateUser (user: ICreateUser) {
    console.log('-->updateUser', user)
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        

        const response = await axios.put(`${process.env.AIM_WORKER_ENDPOINT}/api/users/enroll-existing`, {
        ...user
        },{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        });
        console.log('-->result', response);
        
        return {
        code: 'success',
        error: null,
        data: response.data
        }
    } catch (error: unknown) {
        const errResult = actionErrorHandler(error);
        return errResult;
    }
}