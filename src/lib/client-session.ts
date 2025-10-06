/**
 * Client-side session utilities
 * These functions should only be used in client components
 */

export interface Session {
  accessToken: string;
}

/**
 * Verifies the user's session by making an API call to the server
 * @returns Promise with the session data
 * @throws Error if the session is invalid
 */
export const verifyClientSession = async (): Promise<Session> => {
  try {
    const response = await fetch('/api/auth/verify-session');
    if (!response.ok) {
      throw new Error('Failed to verify session');
    }
    const data = await response.json();
    if (!data.success || !data.data?.accessToken) {
      throw new Error('Invalid session data');
    }
    return { accessToken: data.data.accessToken };
  } catch (error) {
    console.error('Session verification failed:', error);
    throw new Error('Session verification failed');
  }
};
