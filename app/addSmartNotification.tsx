/* * */

import AddSmartNotificationScreen from '@/components/screens/AddSmartNotification';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { LinesListContextProvider } from '@/contexts/LinesList.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function AddSmartNotification() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const params = useLocalSearchParams();
	const smartNotificationID = typeof params.smartNotificationId === 'string' ? params.smartNotificationId : undefined;

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: 'Voltar',
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<LinesListContextProvider>
			<LinesDetailContextProvider>
				<StopsDetailContextProvider>
					<AddSmartNotificationScreen Id={smartNotificationID || undefined} />
				</StopsDetailContextProvider>
			</LinesDetailContextProvider>
		</LinesListContextProvider>
	);

	//
}
