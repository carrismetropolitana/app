/* * */

import { MoreScreen } from '@/components/more/MoreScreen';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: 'more.Page' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return <MoreScreen />;

	//
}
