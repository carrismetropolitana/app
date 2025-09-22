/* * */

import { ProfileView } from '@/components/profile/view/ProfileView';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.home/account' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({ headerShown: true, headerTitle: t('title') });
	}, [navigation]);

	//
	// C. Render components

	return <ProfileView />;

	//
}
