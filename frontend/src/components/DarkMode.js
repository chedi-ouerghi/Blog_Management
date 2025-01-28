import React, { useState,  createContext, useContext } from 'react';
import Cookies from 'js-cookie';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = Cookies.get('darkMode');
    return savedMode === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      Cookies.set('darkMode', newMode.toString(), { expires: 365 });
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
