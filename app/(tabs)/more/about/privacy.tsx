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

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/more/about/privacy' });

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return <AppWebView url={`${getServiceUrl('website')}/privacy`} />;

	//
}
