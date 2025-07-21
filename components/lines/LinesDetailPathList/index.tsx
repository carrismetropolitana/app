/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { PathWaypoint } from '@/components/lines/PathWaypoint';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { NextArrival } from '@/types/timetables.types';
import { PatternRealtime } from '@/types/types';
import { Routes } from '@/utils/routes';
import { Text } from '@rn-vui/themed';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import useSWR from 'swr';

import { styles } from './styles';

/* * */

export function LinesDetailPathList() {
	//

	//
	// A. Setup variables

	const linesDetailContext = useLinesDetailContext();
	const sortedStops = useMemo(() => {
		return linesDetailContext.data.active_pattern?.path.sort((a, b) => a.stop_sequence - b.stop_sequence);
	}, [linesDetailContext.data.active_pattern?.path]);

	const scrollViewRef = useRef<ScrollView>(null);
	const [showAllPassed, setShowAllPassed] = useState(false);
	const currentVehicleStopSequence = linesDetailContext.data.active_waypoint?.stop_sequence;
	const passedStops = sortedStops?.filter(
		waypoint => currentVehicleStopSequence !== undefined && waypoint.stop_sequence < currentVehicleStopSequence,
	);
	const futureStops = sortedStops?.filter(
		waypoint => !(currentVehicleStopSequence !== undefined && waypoint.stop_sequence < currentVehicleStopSequence),
	);
	const topCount = 2;
	const hasMorePassed = (passedStops?.length || 0) > topCount;
	const visiblePassedStops = hasMorePassed && !showAllPassed ? passedStops?.slice(-topCount) : passedStops;

	const LinesDetailPathListStyles = styles();

	// const analyticsContext = useAnalyticsContext();

	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(linesDetailContext.data.active_pattern?.id && `${Routes.API}/arrivals/by_pattern/${linesDetailContext.data.active_pattern.id}`, { refreshInterval: 10000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Map<string, NextArrival[]> | undefined>(() => {
		if (!patternRealtimeData) return;
		const arrivalsForCurrentPattern = patternRealtimeData?.filter(arrivalData => arrivalData.pattern_id === linesDetailContext.data.active_pattern?.id) || [];
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
	}, [patternRealtimeData, linesDetailContext.data.active_pattern?.id]);

	//
	// D. Handle actions

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
		return <NoDataLabel fill />;
	}
	return (
		<View style={LinesDetailPathListStyles.container}>

			{hasMorePassed && !showAllPassed && (
				<View>
					{visiblePassedStops?.map(waypoint => (
						<PathWaypoint
							key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
							arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
							hasBeenPassed={true}
							id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
							isFirstStop={false}
							isLastStop={false}
							isSelected={linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
							selectionEnabled={true}
							trackProgress={false}
							waypointData={waypoint}
						/>
					))}
					<View style={{ alignItems: 'center', marginVertical: 8 }}>
						<Pressable onPress={() => setShowAllPassed(true)}>
							<Text style={{ color: '#007AFF' }}>
								Mostrar todas as passadas
							</Text>
						</Pressable>
					</View>
				</View>
			)}

			{hasMorePassed && showAllPassed && (
				<View>
					{passedStops?.map(waypoint => (
						<PathWaypoint
							key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
							arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
							hasBeenPassed={true}
							id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
							isFirstStop={false}
							isLastStop={false}
							isSelected={linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
							selectionEnabled={true}
							trackProgress={false}
							waypointData={waypoint}
						/>
					))}
					<View style={{ alignItems: 'center', marginVertical: 8 }}>
						<Pressable onPress={() => setShowAllPassed(false)}>
							<Text style={{ color: '#007AFF' }}>
								Mostrar menos
							</Text>
						</Pressable>
					</View>
				</View>
			)}

			{!hasMorePassed && passedStops?.map(waypoint => (
				<PathWaypoint
					key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
					arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
					hasBeenPassed={true}
					id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
					isFirstStop={false}
					isLastStop={false}
					isSelected={linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
					selectionEnabled={true}
					trackProgress={false}
					waypointData={waypoint}
				/>
			))}

			{futureStops?.map((waypoint, index) => {
				const isFirstStop = index === 0 && passedStops?.length === 0;
				const isLastStop = index === futureStops.length - 1;
				return (
					<PathWaypoint
						key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
						arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
						hasBeenPassed={false}
						id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
						isFirstStop={isFirstStop}
						isLastStop={isLastStop}
						isSelected={linesDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && linesDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence}
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
