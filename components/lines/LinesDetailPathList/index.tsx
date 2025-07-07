/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { PathWaypoint } from '@/components/lines/PathWaypoint';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { NextArrival } from '@/types/timetables.types';
import { PatternRealtime } from '@/types/types';
import { Routes } from '@/utils/routes';
import { useMemo } from 'react';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useSWR from 'swr';

import { styles } from './styles';

/* * */

export function LinesDetailPathList() {
	//

	//
	// A. Setup variables

	const linesDetailContext = useLinesDetailContext();
	const LinesDetailPathListStyles = styles();
	// const analyticsContext = useAnalyticsContext();

	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(linesDetailContext.data.active_pattern?.id && `${Routes.API}/arrivals/by_pattern/${linesDetailContext.data.active_pattern.id}`, { refreshInterval: 10000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Map<string, NextArrival[]> | undefined>(() => {
		// Return early if there is no patternRealtimeData
		if (!patternRealtimeData) return;
		// Filter arrrivals for the current pattern
		const arrivalsForCurrentPattern = patternRealtimeData?.filter(arrivalData => arrivalData.pattern_id === linesDetailContext.data.active_pattern?.id) || [];
		// Organize arrivals by Stop ID
		const result = new Map<string, NextArrival[]>();
		arrivalsForCurrentPattern.forEach((arrivalData) => {
			// Setup the object key
			const objectKey = `${arrivalData.stop_id}-${arrivalData.stop_sequence}`;
			// Initialize the array if it doesn't exist
			if (!result.get(objectKey)) result.set(objectKey, []);
			// Push the arrival data
			if (arrivalData.estimated_arrival_unix) {
				result
					.get(objectKey)
					?.push({ type: 'realtime', unixTs: arrivalData.estimated_arrival_unix * 1000 });
			}
			else {
				result
					.get(objectKey)
					?.push({ type: 'scheduled', unixTs: arrivalData.scheduled_arrival_unix * 1000 });
			}
		});
		for (const key of Object.keys(result)) {
			result.get(key)?.sort((a, b) => a.unixTs - b.unixTs);
		}
		return result;
	}, [patternRealtimeData, linesDetailContext.data.active_pattern?.id]);

	const sortedStops = useMemo(() => {
		return linesDetailContext.data.active_pattern?.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
	}, [linesDetailContext.data.active_pattern?.path]);

	//
	// D. Handle actions
	const scrollViewRef = useRef<ScrollView>(null);

	const selectedIndex = sortedStops?.findIndex(
		waypoint =>
			linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id
			&& linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence,
	);

	useEffect(() => {
		if (
			selectedIndex !== undefined
			&& selectedIndex !== -1
			&& scrollViewRef.current
		) {
			scrollViewRef.current.scrollTo({
				animated: true,
				y: selectedIndex * 80,
			});
		}
	}, [selectedIndex, linesDetailContext.data.active_waypoint]);

	//
	// E. Render components

	if (!sortedStops?.length || !linesDetailContext.data.active_pattern) {
		return <NoDataLabel />;
	}

	return (
		<View style={LinesDetailPathListStyles.container}>
			{sortedStops.map((waypoint, index) => {
				const currentVehicleStopSequence = linesDetailContext.data.active_waypoint?.stop_sequence;
				const thisStopSequence = waypoint.stop_sequence;
				const hasBeenPassed = currentVehicleStopSequence !== undefined && thisStopSequence < currentVehicleStopSequence;

				return (
					<PathWaypoint
						key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
						arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
						hasBeenPassed={hasBeenPassed}
						id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
						isFirstStop={index === 0}
						isLastStop={index === sortedStops.length - 1}
						isSelected={linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
						waypointData={waypoint}
					/>
				);
			})}
		</View>
	);

	//
}
