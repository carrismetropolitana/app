/* * */

import { PathWaypointNextArrivals } from '@/components/lines/waypoints/PathWaypointNextArrivals';
import { WaypointFacilities } from '@/components/lines/waypoints/WaypointFacilities';
import { WaypointHeader } from '@/components/lines/waypoints/WaypointHeader';
import { WaypointSpine } from '@/components/lines/waypoints/WaypointSpine';
import { WaypointTimetable } from '@/components/lines/waypoints/WaypointTimetable';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { Dates } from '@/core-replica';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointProps {
	arrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	isFirstStop?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected?: boolean
	stopCount?: number
	waypointData: Waypoint
}

/* * */

export function Waypoint({ arrivals, isFirstStop, isLastStop, isSelected, stopCount, waypointData }: WaypointProps) {
	//

	//
	// A. Setup variables

	const now = Dates.now('Europe/Lisbon').unix_timestamp;

	const styles = useStyles();

	const stopsContext = useStopsContext();
	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const stopData = useMemo(() => {
		return stopsContext.actions.getStopById(waypointData.stop_id);
	}, [stopsContext.actions, waypointData.stop_id]);

	const stopLocation = useMemo(() => {
		return stopsContext.actions.getStopLocationById(waypointData.stop_id);
	}, [stopsContext.actions, waypointData.stop_id]);

	const accessibilityLabel = useMemo(() => {
		if (isFirstStop) return t($ => $.lines.Waypoint.idle.accessibility_label.first_stop, {
			stopCount,
			stopName: stopData?.tts_name || stopData?.long_name,
			stopSequence: waypointData.stop_sequence,
		});
		if (isLastStop) return t($ => $.lines.Waypoint.idle.accessibility_label.last_stop, {
			stopCount,
			stopName: stopData?.tts_name || stopData?.long_name,
			stopSequence: waypointData.stop_sequence,
		});
		return t($ => $.lines.Waypoint.idle.accessibility_label.other, {
			stopCount,
			stopName: stopData?.tts_name || stopData?.long_name,
			stopSequence: waypointData.stop_sequence,
		});
	}, [isFirstStop, isLastStop, stopCount, stopData?.long_name, stopData?.tts_name, t, waypointData.stop_sequence]);

	const nextArrivals = arrivals?.filter(arrival => arrival.unixTs > now) || [];
	const realtimeArrivals = nextArrivals.filter(arrival => arrival.type === 'realtime');
	const scheduledArrivals = nextArrivals.filter(arrival => arrival.type === 'scheduled');

	//
	// C. Handle actions

	const handleToggleWaypoint = () => {
		lineDetailContext.actions.selectWaypointId(waypointData.stop_id, waypointData.stop_sequence);
	};

	//
	// D. Render components

	if (!stopData) {
		return null;
	}

	if (!isSelected) {
		return (
			<TouchableOpacity
				accessibilityHint={t($ => $.lines.Waypoint.idle.accessibility_hint)}
				accessibilityLabel={accessibilityLabel}
				activeOpacity={0.6}
				onPress={handleToggleWaypoint}
			>
				<View
					style={[
						styles.container,
						isFirstStop && styles.containerIsFirstStop,
						isLastStop && styles.containerIsLastStop,
					]}
				>
					<WaypointSpine
						backgroundColor={lineDetailContext.data.selected_pattern?.color}
						foregroundColor={lineDetailContext.data.selected_pattern?.text_color}
						isFirstStop={isFirstStop}
						isLastStop={isLastStop}
						stopId={waypointData.stop_id}
						stopSequence={waypointData.stop_sequence}
					/>
					<View style={[
						styles.details,
						isFirstStop && styles.detailsIsFirstStop,
						isLastStop && styles.detailsIsLastStop,
					]}
					>
						<WaypointHeader
							id={waypointData.stop_id}
							location={stopLocation}
							name={stopData.long_name || '-'}
						/>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<View
			style={[
				styles.container,
				isFirstStop && styles.containerIsFirstStop,
				isLastStop && styles.containerIsLastStop,
				isSelected && styles.containerIsSelected,
			]}
		>
			<WaypointSpine
				backgroundColor={lineDetailContext.data.selected_pattern?.color}
				foregroundColor={lineDetailContext.data.selected_pattern?.text_color}
				isFirstStop={isFirstStop}
				isLastStop={isLastStop}
				stopId={waypointData.stop_id}
				stopSequence={waypointData.stop_sequence}
			/>
			<View style={[
				styles.details,
				isFirstStop && styles.detailsIsFirstStop,
				isLastStop && styles.detailsIsLastStop,
			]}
			>
				<TouchableOpacity
					accessibilityHint={t($ => $.lines.Waypoint.active.accessibility_hint)}
					activeOpacity={0.6}
					onPress={handleToggleWaypoint}
					accessibilityLabel={t($ => $.lines.Waypoint.active.accessibility_label, {
						stopName: stopData?.tts_name || stopData?.long_name,
					})}
				>
					<WaypointHeader
						id={waypointData.stop_id}
						location={stopLocation}
						name={stopData.long_name || '-'}
						ttsName={stopData.tts_name || '-'}
					/>
				</TouchableOpacity>
				<WaypointFacilities stopId={waypointData.stop_id} />
				{operationalDateContext.flags.today && (
					<PathWaypointNextArrivals
						realtimeArrivals={realtimeArrivals}
						scheduledArrivals={scheduledArrivals}
					/>
				)}
				<WaypointTimetable />
			</View>
		</View>
	);

	//
}
