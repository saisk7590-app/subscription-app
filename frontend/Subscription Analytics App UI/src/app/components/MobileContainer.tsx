import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
        {children}
      </div>
    </div>
  );
}
