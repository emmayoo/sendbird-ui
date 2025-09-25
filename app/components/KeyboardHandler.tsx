"use client";

import { useEffect, useState } from 'react';

export default function KeyboardHandler() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialViewportHeight, setInitialViewportHeight] = useState(0);

  useEffect(() => {
    // 초기 뷰포트 높이 저장
    const initialHeight = window.innerHeight;
    setInitialViewportHeight(initialHeight);

    // 뷰포트 높이 계산 함수
    const updateViewportHeight = () => {
      const currentHeight = window.innerHeight;
      const vh = currentHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // 키보드 상태 감지 (뷰포트 높이가 150px 이상 줄어들면 키보드가 열린 것으로 판단)
      const keyboardThreshold = 150;
      const isKeyboardCurrentlyOpen = currentHeight < initialHeight - keyboardThreshold;
      
      if (isKeyboardCurrentlyOpen !== isKeyboardOpen) {
        setIsKeyboardOpen(isKeyboardCurrentlyOpen);
        
        if (isKeyboardCurrentlyOpen) {
          // 키보드가 열렸을 때 - 입력창만 위로 이동
          document.body.classList.add('keyboard-open');
          const keyboardHeight = initialHeight - currentHeight;
          document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
          
          // Sendbird 입력창의 위치 조정
          const messageInput = document.querySelector('.sendbird-message-input') as HTMLElement;
          if (messageInput) {
            messageInput.style.transform = `translateY(-${keyboardHeight}px)`;
          }

          // Sendbird 메시지 영역의 bottom 조정
          const messageList = document.querySelector('.sendbird-channel-list') as HTMLElement;
          if (messageList) {
            messageList.style.bottom = `calc(60px + ${keyboardHeight}px)`;
          }
        } else {
          // 키보드가 닫혔을 때 - 입력창을 원래 위치로 복원
          document.body.classList.remove('keyboard-open');
          document.documentElement.style.setProperty('--keyboard-height', '0px');
          
          // Sendbird 입력창을 원래 위치로 복원
          const messageInput = document.querySelector('.sendbird-message-input') as HTMLElement;
          if (messageInput) {
            messageInput.style.transform = 'translateY(0)';
          }

          // Sendbird 메시지 영역을 원래 위치로 복원
          const messageList = document.querySelector('.sendbird-channel-list') as HTMLElement;
          if (messageList) {
            messageList.style.bottom = '60px';
          }
        }
      }
    };

    // 초기 설정
    updateViewportHeight();

    // 이벤트 리스너 등록
    const events = ['resize', 'orientationchange', 'focusin', 'focusout'];
    
    events.forEach(event => {
      window.addEventListener(event, updateViewportHeight);
    });

    // iOS Safari 전용 처리
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInApp = window.navigator.standalone || 
                   (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

    if (isIOS) {
      // iOS에서 키보드 관련 추가 처리
      const handleIOSKeyboard = () => {
        // iOS에서 키보드가 올라올 때 스크롤 방지
        if (isKeyboardOpen) {
          document.body.style.position = 'fixed';
          document.body.style.top = '0';
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.bottom = '0';
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.bottom = '';
          document.body.style.overflow = '';
        }
      };

      // iOS 앱 내 웹뷰에서의 추가 처리
      if (isInApp) {
        // 앱 내 웹뷰에서는 더 강력한 키보드 처리
        const handleAppKeyboard = () => {
          const currentHeight = window.innerHeight;
          const heightDiff = initialHeight - currentHeight;
          
          if (heightDiff > 100) {
            // 키보드가 열린 상태
            document.documentElement.style.setProperty('--safe-area-inset-bottom', `${heightDiff}px`);
          } else {
            // 키보드가 닫힌 상태
            document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
          }
        };

        window.addEventListener('resize', handleAppKeyboard);
        
        return () => {
          events.forEach(event => {
            window.removeEventListener(event, updateViewportHeight);
          });
          window.removeEventListener('resize', handleAppKeyboard);
        };
      }

      handleIOSKeyboard();
    }

    // 클린업
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateViewportHeight);
      });
    };
  }, [isKeyboardOpen, initialViewportHeight]);

  return null;
}
