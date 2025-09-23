/* * */

import { AccountEdit } from '@/components/account/edit/AccountEdit';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Screen() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/home/account/profile' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({ headerTitle: t('title') });
	}, [navigation]);

	//
	// C. Render components

	return <AccountEdit />;

	//
}
