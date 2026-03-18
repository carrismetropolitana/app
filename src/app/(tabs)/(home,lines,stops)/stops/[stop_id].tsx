/* * */

import { StopDetail } from '@/components/stops/detail/StopDetail';
import { StopDetailContextProvider } from '@/contexts/StopDetail.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { stop_id } = useLocalSearchParams<{ stop_id: string }>();

	const { t } = useTranslation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerTitle: t($ => $._app.sitemap['(tabs)/stops/[stop_id]'].title),
		});
	}, [navigation, t]);

	//
	// C. Render components

	return (
		<StopDetailContextProvider stopId={stop_id}>
			<StopDetail />
		</StopDetailContextProvider>
	);

	//
}
