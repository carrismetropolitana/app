/* * */

import { StopDetail } from '@/components/stops/StopDetail';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Page() {
	//

	// A. Setup variables

	const { stop_id } = useLocalSearchParams<{ stop_id: string }>();

	const navigation = useNavigation();

	//
	// B. Fetch Data

	useEffect(() => {
		navigation.setOptions({
			headerTitle: stop_id,
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<StopsDetailContextProvider stopId={stop_id}>
			<StopDetail />
		</StopsDetailContextProvider>
	);

	//
}
