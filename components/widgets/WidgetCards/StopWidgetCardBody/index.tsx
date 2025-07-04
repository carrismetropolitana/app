/* * */

import StopDetailNextArrivalsByPatternID from '@/components/stops/StopDetailNextArrivalsByPatternID';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

/* * */

interface Props {
	patternIds?: string[]
	stopId: string
}

/* * */

export function StopWidgetCardBody({ patternIds, stopId }: Props) {
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
		<View>
			{ stopId && (
				<StopDetailNextArrivalsByPatternID key={stopId} href={`/stop/${stopId}`} patternIds={patternIds} />
			)}
		</View>
	);

	//
}
