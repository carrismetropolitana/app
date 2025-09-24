/* * */

import { LinesDetail } from '@/components/lines/LinesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
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

	const { t } = useTranslation('translation', { keyPrefix: 'layout' });

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerTitle: `${t('linePageHeaderTitle')} ${line_id}`,
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<StopsDetailContextProvider>
			<LinesDetailContextProvider lineIdParams={line_id}>
				<LinesDetail />
			</LinesDetailContextProvider>
		</StopsDetailContextProvider>
	);

	//
}
