"use client";

import dynamic from 'next/dynamic';

const SendbirdChat = dynamic(() => import('./components/SendbirdChat'), {
  ssr: false,
});

export default function Page() {
  return (
    <SendbirdChat
      appId={'95E3C4EA-EA93-4A5A-8C1A-C3F9A7123B83'}
      userId={'2'}
    />
  );
}