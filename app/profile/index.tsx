/* * */

import { ProfileView } from '@/components/profile/view/ProfileView';
import { useSystemVariables } from '@/theme/global';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const { t } = useTranslation('translation', { keyPrefix: 'profile.Page' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerStyle: {
				backgroundColor: useSystemVariables().background[100],
			},
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return <ProfileView />;

	//
}
