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

	const { t } = useTranslation('translation', { keyPrefix: 'home.Page' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: 'djoisdj',
		});
	}, [navigation]);

	//
	// C. Render components

	return <HomeScreen />;

	//
}
