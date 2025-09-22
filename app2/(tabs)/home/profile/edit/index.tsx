/* * */

import { ProfileEdit } from '@/components/profile/edit/ProfileEdit';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Screen() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: 'Edit Profile',
		});
	}, [navigation]);

	//
	// C. Render components

	return <ProfileEdit />;

	//
}
