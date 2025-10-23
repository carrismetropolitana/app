/* * */

import { NoDataLabel } from '@/components/common/NoDataLabel';
import { Waypoint } from '@/components/lines/waypoints/Waypoint';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { getServiceUrl } from '@/settings/service-urls';
import { NextArrival } from '@/types/timetables.types';
import { type PatternRealtime } from '@/types/types';
import { useMemo } from 'react';
import { View } from 'react-native';
import useSWR from 'swr';

import { useStyles } from './styles';

/* * */

export function LineDetailPath() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineDetailContext = useLineDetailContext();

	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(lineDetailContext.data.selected_pattern_id && `${getServiceUrl('api')}/arrivals/by_pattern/${lineDetailContext.data.selected_pattern_id}`, { refreshInterval: 30_000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Record<string, NextArrival[]>>(() => {
		// Return early if there is no patternRealtimeData
		if (!patternRealtimeData) return {};
		// Filter arrrivals for the current pattern
		const arrivalsForCurrentPattern = patternRealtimeData.filter(arrivalData => arrivalData.pattern_id === lineDetailContext.data.selected_pattern_id) || [];
		// Organize arrivals by Stop ID
		const result: Record<string, NextArrival[]> = {};
		arrivalsForCurrentPattern.forEach((arrivalData) => {
			const objectKey = `${arrivalData.stop_id}-${arrivalData.stop_sequence}`;
			if (!result[objectKey]) result[objectKey] = [];
			if (arrivalData.estimated_arrival_unix) {
				result[objectKey]?.push({ type: 'realtime', unixTs: arrivalData.estimated_arrival_unix * 1000 });
			}
			else {
				result[objectKey]?.push({ type: 'scheduled', unixTs: arrivalData.scheduled_arrival_unix * 1000 });
			}
		});
		for (const key of Object.keys(result)) {
			result[key]?.sort((a, b) => a.unixTs - b.unixTs);
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
		<View style={styles.container}>
			{sortedStops.map((waypoint, index) => (
				<Waypoint
					key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
					arrivals={preparedRealtimeData[`${waypoint.stop_id}-${waypoint.stop_sequence}`] || []}
					isFirstStop={index === 0}
					isLastStop={index === sortedStops.length - 1}
					isSelected={lineDetailContext.data.selected_waypoint?.stop_id === waypoint.stop_id && lineDetailContext.data.selected_waypoint?.stop_sequence === waypoint.stop_sequence}
					stopCount={sortedStops.length}
					waypointData={waypoint}
				/>
			))}
		</View>
	);

	//
}
