/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { VehicleDetail } from '@/components/vehicles/detail/VehicleDetail';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: '_app.sitemap.vehicles/[vehicle_id]' });

	const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerTitle: t('title'),
		});
	}, [navigation]);

	//
	// C. Render components

	return <VehicleDetail id={vehicle_id} />;

	//
}
