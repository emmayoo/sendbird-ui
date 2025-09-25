"use client";

import { useEffect } from 'react';

export default function KeyboardHandler() {
  useEffect(() => {
    // iOS에서 키보드가 올라올 때 뷰포트 높이 조정
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 초기 설정
    handleResize();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // iOS Safari에서 키보드 관련 이벤트 처리
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // 키보드가 올라올 때 스크롤 방지
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.height = '100%';
      }
    };

    const handleFocusOut = () => {
      // 키보드가 내려갈 때 원래 상태로 복원
      setTimeout(() => {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      }, 100);
    };

    // 이벤트 리스너 등록
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return null;
}
