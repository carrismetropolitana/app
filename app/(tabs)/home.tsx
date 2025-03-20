/* * */

import HomeScreen from '@/components/screens/HomeScreen';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Home() {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'layout.TabStack' });

	//
	// B. Render components

	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({ headerShown: false, name: `${t('Home')}` });
	}, [navigation]);

	return (
		<HomeScreen />
	);

	//
}
