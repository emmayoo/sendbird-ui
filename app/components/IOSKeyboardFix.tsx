"use client";

import { useEffect } from 'react';

export default function IOSKeyboardFix() {
  useEffect(() => {
    // iOS 앱 내 웹뷰에서의 키보드 처리
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInApp = (window.navigator as any).standalone || 
                   (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

    if (isIOS && isInApp) {
      // iOS 앱 내 웹뷰에서 키보드가 올라올 때 화면이 함께 올라가지 않도록 처리
      const preventKeyboardScroll = () => {
        // 스크롤 방지
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        
        // 키보드 높이에 따른 뷰포트 조정
        const handleViewportChange = () => {
          const currentHeight = window.innerHeight;
          const initialHeight = window.screen.height;
          const keyboardHeight = initialHeight - currentHeight;
          
          if (keyboardHeight > 100) {
            // 키보드가 열린 상태
            document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
            document.documentElement.style.setProperty('--safe-area-inset-bottom', `${keyboardHeight}px`);
            
            // 화면을 키보드 높이만큼 위로 이동
            document.body.style.transform = `translateY(-${keyboardHeight}px)`;
          } else {
            // 키보드가 닫힌 상태
            document.documentElement.style.setProperty('--keyboard-height', '0px');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
            document.body.style.transform = 'translateY(0)';
          }
        };

        // 이벤트 리스너 등록
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        
        // 초기 실행
        handleViewportChange();

        // 클린업
        return () => {
          window.removeEventListener('resize', handleViewportChange);
          window.removeEventListener('orientationchange', handleViewportChange);
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.height = '';
          document.body.style.overflow = '';
          document.body.style.transform = '';
        };
      };

      const cleanup = preventKeyboardScroll();
      return cleanup;
    }
  }, []);

  return null;
}
