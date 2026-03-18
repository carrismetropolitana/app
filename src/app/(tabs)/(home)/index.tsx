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

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			title: t($ => $._app.sitemap['(tabs)/home'].title),
		});
	}, [navigation, t]);

	//
	// C. Render components

	return <HomeScreen />;

	//
}
