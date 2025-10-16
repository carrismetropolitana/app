/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { PathWaypoint } from '@/components/lines/PathWaypoint';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { NextArrival } from '@/types/timetables.types';
import { PatternRealtime } from '@/types/types';
import { Routes } from '@/utils/routes';
import { Text } from '@rn-vui/themed';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import useSWR from 'swr';

import { styles } from './styles';

/* * */

export function VehiclesDetailPathList() {
	//

	//
	// A. Setup variables

	const lineDetailContext = useLineDetailContext();
	const [showAllPassed, setShowAllPassed] = useState(false);
	// Info selection state for future stops
	const [infoSelectedStopId, setInfoSelectedStopId] = useState<null | string>(null);
	const [infoSelectedStopSequence, setInfoSelectedStopSequence] = useState<null | number>(null);
	const sortedStops = useMemo(() => {
		return lineDetailContext.data.active_pattern?.path?.slice().sort((a, b) => a.stop_sequence - b.stop_sequence) || [];
	}, [lineDetailContext.data.active_pattern?.path]);
	const currentVehicleStopSequence = lineDetailContext.data.active_waypoint?.stop_sequence;
	const passedStops = sortedStops.filter(
		waypoint => currentVehicleStopSequence !== undefined && waypoint.stop_sequence < currentVehicleStopSequence,
	);
	const futureStops = sortedStops.filter(
		waypoint => !(currentVehicleStopSequence !== undefined && waypoint.stop_sequence < currentVehicleStopSequence),
	);
	const topCount = 3;
	const bottomCount = 3;
	const totalPassed = passedStops.length;
	const showCollapseButton = totalPassed > (topCount + bottomCount);
	const topPassedStops = passedStops.slice(0, topCount);
	const bottomPassedStops = passedStops.slice(totalPassed - bottomCount, totalPassed);
	const LineDetailPathStyles = styles();
	const scrollViewRef = useRef<ScrollView>(null);
	//
	// B. Fetch data

	const { data: patternRealtimeData } = useSWR<PatternRealtime[]>(lineDetailContext.data.active_pattern?.id && `${Routes.API}/arrivals/by_pattern/${lineDetailContext.data.active_pattern.id}`, { refreshInterval: 30_000 });

	//
	// C. Transform data

	const preparedRealtimeData = useMemo<Map<string, NextArrival[]> | undefined>(() => {
		if (!patternRealtimeData) return;
		const arrivalsForCurrentPattern = patternRealtimeData?.filter(arrivalData => arrivalData.pattern_id === lineDetailContext.data.active_pattern?.id) || [];
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

	//
	// D. Handle actions

	const selectedIndex = sortedStops?.findIndex(
		waypoint => lineDetailContext.data.active_waypoint?.stop_id === waypoint.stop_id && lineDetailContext.data.active_waypoint?.stop_sequence === waypoint.stop_sequence);

	useEffect(() => {
		if (selectedIndex !== undefined && selectedIndex !== -1 && scrollViewRef.current) {
			scrollViewRef.current.scrollTo({ animated: true, y: selectedIndex * 80 });
		}
	}, [selectedIndex, lineDetailContext.data.active_waypoint]);

	//
	// E. Render components

	if (!sortedStops?.length || !lineDetailContext.data.active_pattern) {
		return <NoDataLabel />;
	}

	return (
		<View style={LineDetailPathStyles.container}>
			{!showAllPassed && showCollapseButton && (
				<>
					{topPassedStops.map((waypoint, idx) => {
						const thisStopSequence = waypoint.stop_sequence;
						const hasBeenPassed = currentVehicleStopSequence !== undefined && thisStopSequence < currentVehicleStopSequence;
						const isNextStop = currentVehicleStopSequence !== undefined && thisStopSequence === currentVehicleStopSequence;
						const isFirstStop = idx === 0;
						return (
							<PathWaypoint
								key={`top-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
								hasBeenPassed={hasBeenPassed}
								id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								isFirstStop={isFirstStop}
								isLastStop={false}
								isNextStop={isNextStop}
								selectionEnabled={false}
								trackProgress={true}
								waypointData={waypoint}
							/>
						);
					})}
					<View style={{ alignItems: 'center', marginVertical: 8 }}>
						<TouchableOpacity onPress={() => setShowAllPassed(true)} style={{ padding: 8 }}>
							<Text style={{ color: '#007AFF' }}>Mostrar mais passadas</Text>
						</TouchableOpacity>
					</View>
					{bottomPassedStops.map((waypoint, idx) => {
						if (waypoint === topPassedStops[topPassedStops.length - (bottomPassedStops.length - idx)]) return null;
						const thisStopSequence = waypoint.stop_sequence;
						const hasBeenPassed = currentVehicleStopSequence !== undefined && thisStopSequence < currentVehicleStopSequence;
						const isNextStop = currentVehicleStopSequence !== undefined && thisStopSequence === currentVehicleStopSequence;
						const isFirstStop = idx === 0 && topPassedStops.length === 0;
						return (
							<PathWaypoint
								key={`bottom-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
								hasBeenPassed={hasBeenPassed}
								id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								isFirstStop={isFirstStop}
								isLastStop={false}
								isNextStop={isNextStop}
								selectionEnabled={false}
								trackProgress={true}
								waypointData={waypoint}
							/>
						);
					})}
				</>
			)}
			{showAllPassed && showCollapseButton && (
				<>
					{passedStops.map((waypoint, idx) => {
						const thisStopSequence = waypoint.stop_sequence;
						const hasBeenPassed = currentVehicleStopSequence !== undefined && thisStopSequence < currentVehicleStopSequence;
						const isNextStop = currentVehicleStopSequence !== undefined && thisStopSequence === currentVehicleStopSequence;
						const isFirstStop = idx === 0;
						return (
							<PathWaypoint
								key={`all-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
								hasBeenPassed={hasBeenPassed}
								id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
								isFirstStop={isFirstStop}
								isLastStop={false}
								isNextStop={isNextStop}
								selectionEnabled={false}
								trackProgress={true}
								waypointData={waypoint}
							/>
						);
					})}
					<View style={{ alignItems: 'center', marginVertical: 8 }}>
						<TouchableOpacity onPress={() => setShowAllPassed(false)} style={{ padding: 8 }}>
							<Text style={{ color: '#8e9399ff' }}>Mostrar menos</Text>
						</TouchableOpacity>
					</View>
				</>
			)}
			{!showCollapseButton && passedStops.map((waypoint, idx) => {
				const thisStopSequence = waypoint.stop_sequence;
				const hasBeenPassed = currentVehicleStopSequence !== undefined && thisStopSequence < currentVehicleStopSequence;
				const isNextStop = currentVehicleStopSequence !== undefined && thisStopSequence === currentVehicleStopSequence;
				const isFirstStop = idx === 0;
				return (
					<PathWaypoint
						key={`all-${waypoint.stop_id}-${waypoint.stop_sequence}`}
						arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
						hasBeenPassed={hasBeenPassed}
						id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
						isFirstStop={isFirstStop}
						isLastStop={false}
						isNextStop={isNextStop}
						selectionEnabled={false}
						trackProgress={true}
						waypointData={waypoint}
					/>
				);
			})}
			{futureStops.map((waypoint, index) => {
				const isFirstStop = index === 0 && passedStops.length === 0;
				const isLastStop = index === futureStops.length - 1;
				const isNextStop = currentVehicleStopSequence !== undefined && waypoint.stop_sequence === currentVehicleStopSequence;
				const isInfoSelected = waypoint.stop_id === infoSelectedStopId && waypoint.stop_sequence === infoSelectedStopSequence;
				return (
					<PathWaypoint
						key={`${waypoint.stop_id}-${waypoint.stop_sequence}`}
						arrivals={preparedRealtimeData?.get(`${waypoint.stop_id}-${waypoint.stop_sequence}`) || []}
						hasBeenPassed={false}
						id={`waypoint-${waypoint.stop_id}-${waypoint.stop_sequence}`}
						isFirstStop={isFirstStop}
						isInfoSelected={isInfoSelected}
						isLastStop={isLastStop}
						isNextStop={isNextStop}
						selectionEnabled={true}
						trackProgress={true}
						waypointData={waypoint}
						onInfoSelect={() => {
							setInfoSelectedStopId(waypoint.stop_id);
							setInfoSelectedStopSequence(waypoint.stop_sequence);
						}}
					/>
				);
			})}
		</View>
	);

	//
}
