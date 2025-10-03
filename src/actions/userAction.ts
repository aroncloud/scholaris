/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { verifySession } from "@/lib/session";
import axios from "axios";
import { actionErrorHandler } from "./errorManagement";
import { ICreateUser, IUpdateUserForm } from "@/types/staffType";




export async function createUser(user: ICreateUser) {
  console.log('-->createUser input:', JSON.stringify(user, null, 2));
  
  try {
    // Input validation
    if (!user) {
      throw new Error('User data is required');
    }

    const requiredFields = ['email', 'first_name', 'last_name'];
    const missingFields = requiredFields.filter(field => !user[field as keyof ICreateUser]);
    
    if (missingFields.length > 0) {
      return {
        code: 'error',
        error: `Missing required fields: ${missingFields.join(', ')}`,
        data: null
      };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return {
        code: 'error',
        error: 'Invalid email format',
        data: null
      };
    }

    const session = await verifySession();
    if (!session?.accessToken) {
      throw new Error('Authentication required');
    }
    const token = session.accessToken;

    if (!process.env.AIM_WORKER_ENDPOINT) {
      throw new Error('Server configuration error: AIM_WORKER_ENDPOINT is not defined');
    }

    try {
      // Check if user with same email or staff number exists
      const checkParams = {
        email: user.email.trim(),
        staff_number: user.staff_number?.trim()
      };
      
      console.log('Checking for existing user with params:', JSON.stringify(checkParams, null, 2));
      
      const checkExistingResponse = await axios.get(
        `${process.env.AIM_WORKER_ENDPOINT}/api/users/check-existing`,
        {
          params: checkParams,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      console.log('Check existing response:', JSON.stringify(checkExistingResponse.data, null, 2));

      if (checkExistingResponse.data?.exists) {
        const errorMsg = checkExistingResponse.data.message || 'A user with this email or staff number already exists';
        console.error('User creation failed - user exists:', errorMsg);
        return {
          code: 'error',
          error: errorMsg,
          data: checkExistingResponse.data.details || null
        };
      }
    } catch (error: any) {
      console.error('Error checking existing user:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Continue with creation if we can't verify existing users (fail open)
      console.warn('Proceeding with user creation despite check failure');
    }

    try {
      // Prepare the payload with all required fields and sanitize inputs
      // Match the exact structure expected by the backend
      const sanitizedUser = {
        email: user.email.trim().toLowerCase(),
        first_name: user.first_name.trim(),
        last_name: user.last_name.trim(),
        gender: (user.gender || 'MALE').trim().toUpperCase(),
        phone_number: (user.phone_number || '').trim(),
        staff_number: (user.staff_number || `STAFF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`).trim(),
        job_title: (user.job_title || 'Staff').trim(),
        department: (user.department || 'General').trim(),
        hiring_date: user.hiring_date || new Date().toISOString().split('T')[0],
        // Ensure salary is a number and greater than 0
        salary: (() => {
          const salary = Number(user.salary);
          return isNaN(salary) || salary <= 0 ? 1 : salary; // Default to 1 if invalid
        })(),
        password_plaintext: user.password_plaintext || `TempPass${Math.floor(1000 + Math.random() * 9000)}!`
      };

      // Log the sanitized payload (without sensitive data)
      const logPayload = { ...sanitizedUser, password_plaintext: '***' };
      console.log('Sending sanitized payload to backend:', JSON.stringify(logPayload, null, 2));
      
      const url = `${process.env.AIM_WORKER_ENDPOINT}/api/staff/hire`;
      
      const response = await axios.post(
        url,
        sanitizedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          validateStatus: () => true, // Handle all status codes
          timeout: 15000 // 15 seconds timeout
        }
      );

      console.log('Backend response status:', response.status);
      console.log('Backend response data:', JSON.stringify(response.data, null, 2));

      if (response.status >= 200 && response.status < 300) {
        // Success case
        return {
          code: 'success',
          data: response.data,
          error: null
        };
      } else if (response.status === 409) {
        const errorMessage = response.data?.message || 'Un utilisateur avec cet email ou ce numéro de staff existe déjà.';
        console.error('User creation failed - conflict:', errorMessage);
        return { 
          code: 'error', 
          message: errorMessage,
          status: 409,
          data: response.data 
        };
      } else {
        // Other error cases
        console.error('Error creating user:', {
          status: response.status,
          data: response.data
        });
        
        let errorMessage = 'Failed to create user';
        const responseData = response.data || {};
        
        // Handle 409 Conflict specifically
        if (response.status === 409) {
          return {
            code: 'error',
            error: responseData.message || 'A user with this username, email, or staff number already exists',
            data: responseData,
            status: 409
          };
        }
        
        // Handle different error response formats
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.errors) {
          // Handle validation errors
          errorMessage = Object.entries(responseData.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
        }

        return {
          code: 'error',
          error: errorMessage,
          data: responseData
        };
      }

      // Success case
      console.log('User created successfully');
      return {
        code: 'success',
        error: null,
        data: response.data
      };
    } catch (error: any) {
      console.error('-->createUser.error:', {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        response: error.response?.data,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });

      let errorMessage = 'An unexpected error occurred while creating the user';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (error.response) {
        // Server responded with an error status code
        const { data, status } = error.response;
        
        if (status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        } else if (status === 409) {
          errorMessage = 'A user with this email or staff number already exists.';
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.detail) {
          errorMessage = data.detail;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response received from the server. Please try again later.';
      }

      return {
        code: 'error',
        error: errorMessage,
        data: error.response?.data || null,
        status: error.response?.status
      };
    }
  } catch (error: any) {
    console.error('-->createUser.error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      response: error.response?.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    let errorMessage = 'An unexpected error occurred while creating the user';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error.response) {
      // Server responded with an error status code
      const { data, status } = error.response;
      
      if (status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (status === 403) {
        errorMessage = 'You do not have permission to perform this action.';
      } else if (status === 409) {
        errorMessage = 'A user with this email or staff number already exists.';
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.detail) {
        errorMessage = data.detail;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = 'No response received from the server. Please try again later.';
    }

    return {
      code: 'error',
      error: errorMessage,
      data: error.response?.data || null,
      status: error.response?.status
    };
  }
}


export async function getUserList(limit = 1000, offset = 0) {
  try {
    console.log('Fetching user list with limit:', limit, 'offset:', offset);
    const session = await verifySession();
    const token = session.accessToken;
    
    if (!process.env.AIM_WORKER_ENDPOINT) {
      console.error('AIM_WORKER_ENDPOINT is not defined');
      throw new Error('Server configuration error: Missing API endpoint');
    }

    const url = `${process.env.AIM_WORKER_ENDPOINT}/api/users/profiles?limit=${limit}&offset=${offset}`;
    console.log('API URL:', url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status < 500, // Don't throw for 4xx errors
    });

    console.log('User list API response status:', response.status);
    
    if (response.status >= 400) {
      console.error('Error response from API:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });
      return {
        code: 'error',
        error: response.data?.message || `Failed to fetch users: ${response.statusText}`,
        data: null
      };
    }
    console.log('Successfully fetched user list:', response.data.body[0]);
    return {
      code: 'success',
      error: null,
      data: response.data,
    };
    
  } catch (error: any) {
    console.error('Error in getUserList:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });
    
    const errResult = actionErrorHandler(error);
    return {
      ...errResult,
      data: null
    };
  }
}


export async function getUserDetail(user_code: string) {
  try {
    const session = await verifySession();
    const token = session.accessToken;
    
    if (!process.env.AIM_WORKER_ENDPOINT) {
      console.error('AIM_WORKER_ENDPOINT is not defined');
      throw new Error('Server configuration error: Missing API endpoint');
    }

    const url = `${process.env.AIM_WORKER_ENDPOINT}/api/users/${user_code}`;
    console.log('API URL:', url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return {
      code: 'success',
      error: null,
      data: response.data,
    };
    
  } catch (error: any) {
    
    console.log('-->getUserDetail.error')
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function deactivateUser (userCode: string) {
    try {
        const session = await verifySession();
        
        const token = session.accessToken;
        
        const response = await axios.patch(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${userCode}/deactivate`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
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


export async function updateUser(user: IUpdateUserForm, user_code: string) {
  
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const response = await axios.put(
      `${process.env.AIM_WORKER_ENDPOINT}/api/users/${user_code}`,
      { ...user },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("-->updateClassroom.result", response.data);

    return {
      code: "success",
      error: null,
      data: response.data,
    };
  } catch (error: unknown) {
    console.log("-->updateClassroom.error");
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function getFullRoles() {
  try {
    const session = await verifySession();
    const token = session.accessToken;

    const url = `${process.env.AIM_WORKER_ENDPOINT}/api/roles/full`;
    console.log('API URL:', url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status < 500,
    });

    // console.log('-->getFullRoles:', response.data);
    
    return {
      code: 'success',
      error: null,
      data: response.data,
    };
    
  } catch (error: any) {
    console.log('-->getFullRoles.error')
    const errResult = actionErrorHandler(error);
    return errResult;
  }
}

export async function assignRolesToUser(user_code: string, roleList: string[]) {
  try {
    const session = await verifySession();
    
    const token = session.accessToken;
    
    const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${user_code}/role`, roleList, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });
    
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

export async function removeUserRoles (user_code: string, roleList: string[]) {
  try {
    const session = await verifySession();
    
    const token = session.accessToken;
    
    const response = await axios.post(`${process.env.AIM_WORKER_ENDPOINT}/api/users/${user_code}/role`, roleList, {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });
    
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