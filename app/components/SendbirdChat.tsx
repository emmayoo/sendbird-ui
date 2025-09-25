"use client";

import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';

interface SendbirdChatProps {
  appId: string;
  userId: string;
}

export default function SendbirdChat({ appId, userId }: SendbirdChatProps) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SendbirdApp
        appId={appId}
        userId={userId}
      />
    </div>
  );
}
