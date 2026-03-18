/* * */

import { AccountView } from '@/components/account/view/AccountView';
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
		navigation.setOptions({ headerShown: true, headerTitle: t($ => $._app.sitemap['(tabs)/home/account'].title) });
	}, [navigation, t]);

	//
	// C. Render components

	return <AccountView />;

	//
}
