/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { PathWaypoint } from '@/components/lines/PathWaypoint';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { NextArrival } from '@/types/timetables.types';
import { PatternRealtime } from '@/types/types';
import { Routes } from '@/utils/routes';
import { useMemo } from 'react';
import { View } from 'react-native';
import useSWR from 'swr';

import { styles } from './styles';

/* * */

export function LineDetailPathList() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const LineDetailPathListStyles = styles();

	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(lineDetailContext.data.selected_pattern_id && `${Routes.API}/arrivals/by_pattern/${lineDetailContext.data.selected_pattern_id}`, { refreshInterval: 30_000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Map<string, NextArrival[]> | undefined>(() => {
		// Return early if there is no patternRealtimeData
		if (!patternRealtimeData) return;
		// Filter arrrivals for the current pattern
		const arrivalsForCurrentPattern = patternRealtimeData?.filter(arrivalData => arrivalData.pattern_id === lineDetailContext.data.selected_pattern_id) || [];
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
	}, [patternRealtimeData, lineDetailContext.data.selected_pattern_id]);

	const sortedStops = useMemo(() => {
		return lineDetailContext.data.selected_pattern?.path.sort((a, b) => a.stop_sequence - b.stop_sequence) ?? [];
	}, [lineDetailContext.data.selected_pattern?.path]);

	//
	// D. Render components

	if (!sortedStops.length) {
		return <NoDataLabel />;
	}

	return (
		<View style={LineDetailPathListStyles.container}>
			{sortedStops.map((waypoint, index) => (
				<PathWaypoint
					key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
					arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
					id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
					isFirstStop={index === 0}
					isLastStop={index === sortedStops.length - 1}
					isSelected={lineDetailContext.data.selected_waypoint?.stop_id === waypoint.stop_id && lineDetailContext.data.selected_waypoint?.stop_sequence === waypoint.stop_sequence}
					selectionEnabled={true}
					trackProgress={false}
					waypointData={waypoint}
				/>
			))}
		</View>
	);

	//
}
