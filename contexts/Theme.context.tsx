import { darkTheme, lightTheme } from '@/theme/Themes';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import {
	setAlternateAppIcon,
	supportsAlternateIcons,
} from 'expo-alternate-app-icons';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export const ThemeContext = createContext({
	theme: lightTheme,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
	const [theme, setTheme] = useState(
		Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
	);

	const toggleTheme = useCallback(() => {
		setTheme(prevTheme => (prevTheme.mode === 'light' ? darkTheme : lightTheme));
	}, []);

	// Sincroniza tema de UI
	useEffect(() => {
		const subscription = Appearance.addChangeListener(({ colorScheme }) => {
			setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
		});
		return () => subscription.remove();
	}, []);

	// Troca dinâmica de ícone conforme tema do sistema
	useEffect(() => {
		const applyIcon = async (scheme: ColorSchemeName) => {
			if (!(await supportsAlternateIcons)) return;
			// Normaliza valores: dark => dark, qualquer outro => default
			const iconName = scheme === 'dark' ? 'dark' : 'default';
			await setAlternateAppIcon(iconName);
		};

		// Aplica na inicialização
		applyIcon(Appearance.getColorScheme());

		// Atualiza em mudanças de tema
		const sub = Appearance.addChangeListener(({ colorScheme }) => {
			applyIcon(colorScheme);
		});
		return () => sub.remove();
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
