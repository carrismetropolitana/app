import { useThemeContext } from '@/contexts/Theme.context';

// This is a shim for web and Android where the tab bar is generally opaque.
export default undefined;

export function useBottomTabOverflow() {
	const themeContext = useThemeContext();
	return themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background;
}
