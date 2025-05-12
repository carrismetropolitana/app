/* * */

import StopDetailNextArrivals from '@/components/stops/StopDetailNextArrivals';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

/* * */

interface Props {
	stopId: string
}

/* * */

export function StopWidgetCardBody({ stopId }: Props) {
	//

	//
	// A. Setup Variables

	const stopDetailContext = useStopsDetailContext();

	//
	// B. Fetch Data
	useEffect(() => {
		if (!stopId) return;
		stopDetailContext.actions.setActiveStopId(stopId);
	}, [stopId]);
	//
	// B. Render Components

	if (!stopId) {
		return (
			<View>
				<Text>There has been an error. Try again later.</Text>
			</View>
		);
	}

	return (
		<ScrollView>
			{ stopId && (
				<StopDetailNextArrivals key={stopId} />
			)}
		</ScrollView>
	);

	//
}
