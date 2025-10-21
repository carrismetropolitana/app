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

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/stops/[stop_id]' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerTitle: `${t('title')}`,
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<StopDetailContextProvider stopId={stop_id}>
			<StopDetail />
		</StopDetailContextProvider>
	);

	//
}
