import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

// Tùy chỉnh CSS cho NProgress để đẹp hơn
const nprogressCustomStyles = `
  #nprogress .bar {
    background: #2563eb !important; /* Blue-600 */
    height: 3px !important;
  }
  #nprogress .spinner-icon {
    border-top-color: #2563eb !important;
    border-left-color: #2563eb !important;
  }
  #nprogress .peg {
    box-shadow: 0 0 10px #2563eb, 0 0 5px #2563eb !important;
  }
`;

export default function ProgressBar() {
  const location = useLocation();

  useEffect(() => {
    // Add custom styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = nprogressCustomStyles;
    document.head.appendChild(styleElement);

    nProgress.configure({ 
      showSpinner: false,
      speed: 500,
      minimum: 0.1
    });

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    nProgress.start();
    
    // Giả lập kết thúc loading sau khi chuyển trang
    // Vì đây là SPA, việc render component mới diễn ra rất nhanh
    const timer = setTimeout(() => {
      nProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      nProgress.done();
    };
  }, [location.pathname]);

  return null;
}
