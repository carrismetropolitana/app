/* * */

import { ProfileEditForm } from '@/components/profile/edit/ProfileEditForm';
import { ProfileEditPersona } from '@/components/profile/edit/ProfileEditPersona';
import { useThemeContext } from '@/contexts/Theme.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

/* * */

export function ProfileEdit() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const themeContext = useThemeContext();
	const { t } = useTranslation('translation', { keyPrefix: 'profile.ProfileEdit' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerBackTitle: t('title'),
			headerStyle: {
				backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background,
			},
			headerTitle: '',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<SafeAreaView>
			<ScrollView>
				<ProfileEditPersona />
				<ProfileEditForm />
			</ScrollView>
		</SafeAreaView>
	);

	//
}
