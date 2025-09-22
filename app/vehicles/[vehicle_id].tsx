/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { VehiclesDetail } from '@/components/vehicles/VehiclesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';
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

	return (
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<VehiclesContextProvider>
					<VehiclesDetail id={vehicle_id} />
				</VehiclesContextProvider>
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
