// navigationButtons.jsx
import { useNavigate, useLocation } from "react-router-dom";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pages in the order you want to navigate through
  const pages = ['/', '/features', '/installation', '/quickstart', '/helloworld'];
  
  // Find the current page index
  const currentIndex = pages.indexOf(location.pathname);

  // Handlers for navigating forward and backward
  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(pages[currentIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentIndex < pages.length - 1) {
      navigate(pages[currentIndex + 1]);
    }
  };

  return (
    <div className="navigation-buttons">
      <button onClick={handleBack} disabled={currentIndex === 0}>
        Back
      </button>
      <button onClick={handleForward} disabled={currentIndex === pages.length - 1}>
        Forward
      </button>
    </div>
  );
};

export default NavigationButtons;
