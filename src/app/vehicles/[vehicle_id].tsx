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

	const { t } = useTranslation();

	const { vehicle_id } = useLocalSearchParams<{ vehicle_id: string }>();

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: t($ => $._app.sitemap['vehicles/[vehicle_id]'].title),
			presentation: 'modal',
		});
	}, [navigation, t]);

	//
	// C. Render components

	return <VehicleDetail id={vehicle_id} />;

	//
}
