"use client";

import { useEffect, useState, useCallback } from 'react';

export default function MobileKeyboardHandler() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Sendbird 컴포넌트 조정 함수
  const adjustSendbirdComponents = useCallback((height: number) => {
    // 메시지 영역 높이만 조정 (헤더와 입력창은 고정)
    const messageList = document.querySelector('.sendbird-channel-list') as HTMLElement;
    if (messageList) {
      messageList.style.height = `calc(100% - 120px - ${height}px)`;
      messageList.style.transition = 'height 0.3s ease-in-out';
    }

    // 스크롤 컨테이너 조정
    const scrollContainer = document.querySelector('.sendbird-conversation__scroll-container') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.height = `calc(100% - 30px - ${height}px)`;
      scrollContainer.style.transition = 'height 0.3s ease-in-out';
    }
  }, []);

  // Sendbird 컴포넌트 복원 함수
  const restoreSendbirdComponents = useCallback(() => {
    // 메시지 영역 복원
    const messageList = document.querySelector('.sendbird-channel-list') as HTMLElement;
    if (messageList) {
      messageList.style.height = 'calc(100% - 120px)';
      messageList.style.transition = 'height 0.3s ease-in-out';
    }

    // 스크롤 컨테이너 복원
    const scrollContainer = document.querySelector('.sendbird-conversation__scroll-container') as HTMLElement;
    if (scrollContainer) {
      scrollContainer.style.height = 'calc(100% - 30px)';
      scrollContainer.style.transition = 'height 0.3s ease-in-out';
    }
  }, []);

  useEffect(() => {
    // 초기 뷰포트 높이 저장
    const initialViewportHeight = window.innerHeight;

    // Visual Viewport API 지원 여부 확인
    const hasVisualViewport = 'visualViewport' in window;
    
    // 키보드 감지 함수
    const detectKeyboard = () => {
      const currentViewportHeight = window.innerHeight;
      
      // 키보드 높이 계산 (여러 방법 시도)
      let calculatedKeyboardHeight = 0;
      
      if (hasVisualViewport && window.visualViewport) {
        // Visual Viewport API 사용
        calculatedKeyboardHeight = initialViewportHeight - window.visualViewport.height;
      } else {
        // 전통적인 방법
        calculatedKeyboardHeight = initialViewportHeight - currentViewportHeight;
      }
      
      // 키보드가 열린 것으로 판단하는 임계값
      const keyboardThreshold = 150;
      const isCurrentlyOpen = calculatedKeyboardHeight > keyboardThreshold;
      
      if (isCurrentlyOpen !== isKeyboardOpen || calculatedKeyboardHeight !== keyboardHeight) {
        setIsKeyboardOpen(isCurrentlyOpen);
        setKeyboardHeight(Math.max(0, calculatedKeyboardHeight));
        
        // CSS 변수 업데이트
        document.documentElement.style.setProperty('--keyboard-height', `${Math.max(0, calculatedKeyboardHeight)}px`);
        
        if (isCurrentlyOpen) {
          document.body.classList.add('keyboard-open');
          adjustSendbirdComponents(calculatedKeyboardHeight);
        } else {
          document.body.classList.remove('keyboard-open');
          restoreSendbirdComponents();
        }
      }
    };

    // 이벤트 리스너 등록
    const events = ['resize', 'orientationchange', 'focusin', 'focusout'];
    
    events.forEach(event => {
      window.addEventListener(event, detectKeyboard);
    });

    // Visual Viewport API 이벤트 리스너
    if (hasVisualViewport && window.visualViewport) {
      window.visualViewport.addEventListener('resize', detectKeyboard);
      window.visualViewport.addEventListener('scroll', detectKeyboard);
    }

    // 초기 실행
    detectKeyboard();

    // 클린업
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, detectKeyboard);
      });
      
      if (hasVisualViewport && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', detectKeyboard);
        window.visualViewport.removeEventListener('scroll', detectKeyboard);
      }
    };
  }, [isKeyboardOpen, keyboardHeight, adjustSendbirdComponents, restoreSendbirdComponents]);

  return null;
}
