"use client";

import Typography from '@/components/ui/typography'
import { useRouter } from 'next/navigation';
import InteractiveHoverButton from '@/components/ui/interactive-hover-button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center px-4">
        <Typography.H1 className="font-bold mb-4">404</Typography.H1>
        <Typography.H3 className="mb-2">Oops! Page not found</Typography.H3>
        <div className="max-w-md mx-auto mb-4">
          <Typography.P>{"The page you're looking for doesn't exist or has been moved."}</Typography.P>
        </div>
        <div className="flex justify-center space-x-4">
          <InteractiveHoverButton text='Back' iconName='ArrowLeft' onClick={() => router.back()} />
          <InteractiveHoverButton text='Home' iconName='Home' onClick={() => router.push("/")} />
        </div>
      </div>
    </div>
  )
}

