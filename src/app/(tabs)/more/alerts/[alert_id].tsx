/* * */

import { AppWebView } from '@/components/layout/AppWebView';
import { getServiceUrl } from '@/settings/service-urls';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const searchParams = useLocalSearchParams();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/more/alerts/[alert_id]' });

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: t('title'),
		});
	}, [navigation]);

	const preparedAlertId = useMemo(() => {
		if (!searchParams.alert_id) return;
		if (Array.isArray(searchParams.alert_id)) return searchParams.alert_id[0];
		return searchParams.alert_id;
	}, [searchParams.alert_id]);

	//
	// C. Render components

	return <AppWebView url={`${getServiceUrl('app_view')}/alerts/${preparedAlertId}`} />;

	//
}
