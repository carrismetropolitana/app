/* * */

import { WidgetLineConfig } from '@/components/widgets/lines/WidgetLineConfig';
import { useThemeContext } from '@/contexts/Theme.context';
import { WidgetLineConfigContextProvider } from '@/contexts/WidgetLineConfig.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<WidgetLineConfigContextProvider>
			<WidgetLineConfig />
		</WidgetLineConfigContextProvider>
	);

	//
}
