/**
 * MobileContainer Component
 * 
 * This component creates a mobile-first layout that:
 * - Constrains the app width to mobile size (max 428px)
 * - Centers the app on larger screens (desktop/tablet)
 * - Provides full width on mobile devices
 * - Adds a subtle shadow on desktop for a "phone frame" effect
 */

import React from 'react';
import clsx from 'clsx';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function MobileContainer({ 
  children, 
  className = '' 
}: MobileContainerProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      {/* Mobile-constrained container */}
      <div 
        className={clsx(
          'w-full max-w-[375px] min-h-screen shadow-lg mx-auto',
          className.includes('overflow-hidden') ? 'bg-transparent' : 'bg-white',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

