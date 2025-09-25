// Navigator 인터페이스 확장
interface Navigator {
  standalone?: boolean;
}

// Window 인터페이스 확장
interface Window {
  navigator: Navigator;
}
