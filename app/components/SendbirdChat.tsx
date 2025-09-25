"use client";

import '@sendbird/uikit-react/dist/index.css';

import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';

interface SendbirdChatProps {
  appId: string;
  userId: string;
}

const channelUrl = 'sendbird_group_channel_25534_3d779482024a78e1a18c6afb60a0dc227cdb78dc';

export default function SendbirdChat({ appId, userId }: SendbirdChatProps) {
  return (
    <div 
      className="sendbird-chat-container"
      style={{ 
        width: '100vw', 
        height: 'calc(var(--vh, 1vh) * 100)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        touchAction: 'manipulation',
        paddingBottom: 'var(--safe-area-inset-bottom, 0px)'
      }}
    >
      <SendbirdProvider
        appId={appId}
        userId={userId}
      >
        {/* GroupChannel should be always wrapped inside SendbirdProvider */}
        <GroupChannel channelUrl={channelUrl} />
      </SendbirdProvider>
    </div>
  );
}
