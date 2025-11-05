/* eslint-disable @typescript-eslint/no-explicit-any */
export function actionErrorHandler(error: unknown) {
  const _error = error as any;
  console.log("-->actionErrorHandler.error", _error.response?.data?.body?.fieldErrors);
    let isRedirect = false;
    interface AxiosError {
      code?: string;
      response?: {
        data?: {
          message?: string;
        };
      };
    }
    if (typeof error === 'object' && error !== null && 'digest' in error) {
      const digest = (error as { digest?: string }).digest;
      isRedirect = typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
    }
    if (isRedirect) {
      return {
        data: null,
        error: 'Session expired',
        code: 'SESSION_EXPIRED',
      };
    }
    const err = error as AxiosError;
    console.log(err.response?.data)
    return {
      code: typeof error === 'object' && error !== null && 'code' in error ? err.code ?? "unknown" : "unknown",
      error: typeof error === 'object' && error !== null && 'response' in error && err.response?.data?.message
        ? err.response!.data!.message!
        : "An unexpected error occurred",
      data: null
    }
}