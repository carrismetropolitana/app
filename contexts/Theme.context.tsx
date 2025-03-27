import { darkTheme, lightTheme } from '@/theme/Themes';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

// Create the ThemeContext with default values
export const ThemeContext = createContext({
	theme: lightTheme,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(
		Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
	);

	const toggleTheme = useCallback(() => {
		setTheme(prevTheme => (prevTheme.mode === 'light' ? darkTheme : lightTheme));
	}, []);

	useEffect(() => {
		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
		});
		return () => subscription.remove();
	}, []);

	const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

	return (
		<ThemeContext.Provider value={value}>
			<RNEThemeProvider theme={theme}>
				{children}
			</RNEThemeProvider>
		</ThemeContext.Provider>
	);
};

export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};
