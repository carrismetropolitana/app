/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Profile() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'profile' });

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: t('headerTitle'),
			headerShown: true,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// B. Render components

	return (

		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<ProfileScreen />
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
