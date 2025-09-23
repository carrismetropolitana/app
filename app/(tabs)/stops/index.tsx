/* * */

import { StopsList } from '@/components/stops/list/StopsList';
import { StopsListContextProvider } from '@/contexts/OldStopsList.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.(tabs)/stops' });

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<StopsListContextProvider>
			<StopsList />
		</StopsListContextProvider>
	);

	//
};
