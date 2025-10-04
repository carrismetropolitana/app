/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { PathWaypoint } from '@/components/lines/PathWaypoint';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
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

export function LineDetailPathList() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const LineDetailPathListStyles = styles();
	const scrollViewRef = useRef<ScrollView>(null);
	// const analyticsContext = useAnalyticsContext();

	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(lineDetailContext.data.active_pattern?.id && `${Routes.API}/arrivals/by_pattern/${lineDetailContext.data.active_pattern.id}`, { refreshInterval: 30_000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Map<string, NextArrival[]> | undefined>(() => {
		// Return early if there is no patternRealtimeData
		if (!patternRealtimeData) return;
		// Filter arrrivals for the current pattern
		const arrivalsForCurrentPattern = patternRealtimeData?.filter(arrivalData => arrivalData.pattern_id === lineDetailContext.data.active_pattern?.id) || [];
		// Organize arrivals by Stop ID
		const result = new Map<string, NextArrival[]>();
		arrivalsForCurrentPattern.forEach((arrivalData) => {
			const objectKey = `${arrivalData.stop_id}-${arrivalData.stop_sequence}`;
			if (!result.get(objectKey)) result.set(objectKey, []);
			if (arrivalData.estimated_arrival_unix) {
				result.get(objectKey)?.push({ type: 'realtime', unixTs: arrivalData.estimated_arrival_unix * 1000 });
			}
			else {
				result.get(objectKey)?.push({ type: 'scheduled', unixTs: arrivalData.scheduled_arrival_unix * 1000 });
			}
		});
		for (const key of Object.keys(result)) {
			result.get(key)?.sort((a, b) => a.unixTs - b.unixTs);
		}
		return result;
	}, [patternRealtimeData, lineDetailContext.data.active_pattern?.id]);

	const sortedStops = useMemo(() => {
		return lineDetailContext.data.active_pattern?.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
	}, [lineDetailContext.data.active_pattern?.path]);

	//
	// D. Handle actions

	const selectedIndex = sortedStops?.findIndex(
		waypoint =>
			lineDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id
			&& lineDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence,
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
	}, [selectedIndex, lineDetailContext.data.active_waypoint]);

	//
	// E. Render components

	if (!sortedStops?.length || !lineDetailContext.data.active_pattern) {
		return <NoDataLabel fill />;
	}

	return (
		<View style={LineDetailPathListStyles.container}>
			{sortedStops.map((waypoint, index) => {
				const currentVehicleStopSequence = lineDetailContext.data.active_waypoint?.stop_sequence;
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
						isSelected={lineDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && lineDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
						selectionEnabled={true}
						trackProgress={false}
						waypointData={waypoint}
					/>
				);
			})}
		</View>
	);

	//
}
