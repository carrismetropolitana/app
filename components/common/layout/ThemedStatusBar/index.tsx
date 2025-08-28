/* * */
import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { StatusBar } from 'expo-status-bar';
/* * */

/* * */
export default function ThemedStatusBar() {
	//

	//
	// A. Setup Variables

	const themeContext = useThemeContext();
	const backgroundColor = themeContext.theme.mode === 'light' ? theming.colorSystemBackgroundLight100 : theming.colorSystemBackgroundDark100;

	//
	// B. Render components
	return <StatusBar backgroundColor={backgroundColor} style={themeContext.theme.mode === 'light' ? 'dark' : 'light'} translucent={false} />;

	//
}
