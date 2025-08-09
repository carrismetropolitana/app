/* * */

import type { Waypoint } from '@carrismetropolitana/api-types/network';

import { PathWaypointHeader } from '@/components/lines/PathWaypointHeader';
import { PathWaypointNextArrivals } from '@/components/lines/PathWaypointNextArrivals';
import { PathWaypointSpine } from '@/components/lines/PathWaypointSpine';
import { PathWaypointTimetable } from '@/components/lines/PathWaypointTimetable';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { theming } from '@/theme/Variables';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	arrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	hasBeenPassed?: boolean
	id?: string
	isFirstStop?: boolean
	isInfoSelected?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected?: boolean
	isVehiclePage?: boolean
	onInfoSelect?: () => void
	selectionEnabled?: boolean
	trackProgress?: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypoint({ arrivals, hasBeenPassed, isFirstStop, isInfoSelected, isLastStop, isNextStop, isSelected, isVehiclePage, onInfoSelect, selectionEnabled, trackProgress, waypointData }: Props) {
	//

	//
	// A. Setup variables

	const now = Date.now();

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();

	const pathWaypointStyles = styles();

	const backgroundColor = hasBeenPassed && trackProgress && !selectionEnabled ? theming.colorSystemText400 : linesDetailContext.data.active_pattern?.color;
	const foregroundColor = hasBeenPassed && trackProgress && !selectionEnabled ? theming.colorSystemText300 : linesDetailContext.data.active_pattern?.text_color;

	//
	// B. Transform data

	const nextArrivals = arrivals?.filter(arrival => arrival.unixTs > now) || [];
	const realtimeArrivals = nextArrivals.filter(arrival => arrival.type === 'realtime');
	const scheduledArrivals = nextArrivals.filter(arrival => arrival.type === 'scheduled');

	//
	// C. Handle actions

	const handleToggleStop = () => {
		linesDetailContext.actions.setActiveWaypoint(waypointData.stop_id, waypointData.stop_sequence);
	};

	//
	// D. Render components

	// Only allow info selection for future stops, keep vehicle selection logic for vehicle
	const handlePress = () => {
		if (selectionEnabled && onInfoSelect) {
			onInfoSelect();
		}

		if (!onInfoSelect && selectionEnabled) {
			handleToggleStop();
		}
	};

	return (
		<TouchableOpacity onPress={handlePress}>
			<View
				style={[
					pathWaypointStyles.container,
					isFirstStop && pathWaypointStyles.isFirstStop,
					isLastStop && pathWaypointStyles.isLastStop,
					isSelected && pathWaypointStyles.isSelected,
				]}
			>
				<PathWaypointSpine
					backgroundColor={backgroundColor}
					foregroundColor={foregroundColor}
					isDisabled={hasBeenPassed && !trackProgress}
					isFirstStop={isFirstStop}
					isLastStop={isLastStop}
					isNextStop={isNextStop}
					isSelected={isSelected || false}
					stopId={waypointData.stop_id}
					stopSequence={waypointData.stop_sequence}
				/>
				<View style={pathWaypointStyles.detailsWrapper}>
					<PathWaypointHeader
						isFirstStop={isFirstStop}
						isLastStop={isLastStop}
						isSelected={isSelected || false}
						waypointData={waypointData}
					/>

					{isSelected && operationalDayContext.flags.is_today_selected && (
						<PathWaypointNextArrivals
							realtimeArrivals={realtimeArrivals}
							scheduledArrivals={scheduledArrivals}
						/>
					)}

					{(isSelected || isInfoSelected) && (
						<PathWaypointTimetable />
					)}
				</View>
			</View>
		</TouchableOpacity>
	);

	//
}
