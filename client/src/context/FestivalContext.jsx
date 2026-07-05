import React, { createContext, useContext, useState, useEffect } from 'react';
import { FESTIVALS } from '../utils/festivals';

const FestivalContext = createContext();

export const useFestival = () => useContext(FestivalContext);

export const FestivalProvider = ({ children }) => {
  const [activeFestival, setActiveFestival] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Get current date in MM-DD format
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${month}-${day}`;

    // Uncomment this line to test a specific festival, e.g. Republic Day
    // const dateString = "01-26"; 

    if (FESTIVALS[dateString]) {
      const festival = FESTIVALS[dateString];
      setActiveFestival(festival);
      
      // Override CSS Variables
      const root = document.documentElement;
      Object.entries(festival.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Show popup on every refresh (app mount)
      setShowPopup(true);
    } else {
      // Reset colors if no festival
      const root = document.documentElement;
      root.style.removeProperty('--app-brand-blue');
      root.style.removeProperty('--app-brand-blue-dark');
      root.style.removeProperty('--app-brand-blue-light');
      root.style.removeProperty('--app-brand-orange');
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  return (
    <FestivalContext.Provider value={{ activeFestival, showPopup, closePopup }}>
      {children}
    </FestivalContext.Provider>
  );
};
