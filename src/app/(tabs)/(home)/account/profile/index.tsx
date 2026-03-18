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

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({ headerTitle: t($ => $._app.sitemap['(tabs)/home/account/profile'].title) });
	}, [navigation, t]);

	//
	// C. Render components

	return <AccountEdit />;

	//
}
