/* * */

import { HomeScreen } from '@/components/home/HomeScreen';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/home' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			title: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return <HomeScreen />;

	//
}
