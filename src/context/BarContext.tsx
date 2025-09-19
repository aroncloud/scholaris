'use client';
 
import { ProgressProvider } from '@bprogress/next/app';
 
const BarProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider 
      height="3px"
      color="#ffd230"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
 
export default BarProvider;