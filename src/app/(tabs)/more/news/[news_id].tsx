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
			headerTitle: t($ => $._app.sitemap['(tabs)/more/news/[news_id]'].title),
		});
	}, [navigation, t]);

	const preparedNewsId = useMemo(() => {
		if (!searchParams.news_id) return;
		if (Array.isArray(searchParams.news_id)) return searchParams.news_id[0];
		return searchParams.news_id;
	}, [searchParams.news_id]);

	//
	// C. Render components

	return <AppWebView url={`${getServiceUrl('app_view')}/news/${preparedNewsId}`} />;

	//
}
