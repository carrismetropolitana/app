/* * */

import { LineDetail } from '@/components/lines/detail/LineDetail';
import { LineDetailContextProvider } from '@/contexts/LineDetail.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { line_id } = useLocalSearchParams<{ line_id: string }>();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/lines/[line_id]' });

	//
	// B. Fetch data

	useEffect(() => {
		navigation.setOptions({
			headerTitle: `${t('title')}`,
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<LineDetailContextProvider lineId={line_id}>
			<LineDetail />
		</LineDetailContextProvider>
	);

	//
}
