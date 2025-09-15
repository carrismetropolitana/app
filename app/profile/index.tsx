/* * */

import { ProfileView } from '@/components/profile/view/ProfileView';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'profile' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: 'Profile',
		});
	}, [navigation]);

	//
	// C. Render components

	return <ProfileView />;

	//
}
