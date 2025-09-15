/* * */

import { WidgetSmartNotificationConfig } from '@/components/widgets/smart-notifications/WidgetSmartNotificationConfig';
import { useThemeContext } from '@/contexts/Theme.context';
import { WidgetSmartNotificationConfigContextProvider } from '@/contexts/WidgetSmartNotificationConfig.context';
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
		<WidgetSmartNotificationConfigContextProvider>
			<WidgetSmartNotificationConfig />
		</WidgetSmartNotificationConfigContextProvider>
	);

	//
}
