/* * */

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

/* * */

export function ThemedStatusBar() {
	//

	//
	// A. Setup variables

	const colorScheme = useColorScheme();

	//
	// B. Render components

	return (
		<StatusBar
			style={colorScheme === 'light' ? 'dark' : 'light'}
			translucent
		/>
	);

	//
}
