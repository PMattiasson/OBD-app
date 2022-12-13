import { createContext } from 'react';

const ThemeContext = createContext({
    toggleTheme: () => {},
    isThemeDark: false,
});

export default ThemeContext;
