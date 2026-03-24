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

	const { t } = useTranslation();

	//
	// B. Transform data

	useEffect(() => {
		navigation.setOptions({
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['alerts/[alert_id]'].title),
		});
	}, [navigation, t]);

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
