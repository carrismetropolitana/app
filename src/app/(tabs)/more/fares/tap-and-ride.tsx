/* * */

import { AppWebView } from '@/components/layout/AppWebView';
import { getServiceUrl } from '@/settings/service-urls';
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
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['(tabs)/more/fares/tap-and-ride'].title),
		});
	}, [navigation, t]);

	//
	// C. Render components

	return <AppWebView url={getServiceUrl('tap_and_ride')} />;

	//
}
