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
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected: boolean
	isVehiclePage?: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypoint({ arrivals, hasBeenPassed, isFirstStop, isLastStop, isNextStop, isSelected, isVehiclePage, waypointData }: Props) {
	//

	//
	// A. Setup variables

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();
	const now = Date.now();
	const pathWaypointStyles = styles();
	const defaultBackgroundColor = linesDetailContext.data.active_pattern?.color;
	const defaultForegroundColor = linesDetailContext.data.active_pattern?.text_color;
	const backgroundColor = hasBeenPassed ? theming.colorSystemText400 : defaultBackgroundColor;
	const foregroundColor = hasBeenPassed ? theming.colorSystemText300 : defaultForegroundColor;

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

	return (
		<TouchableOpacity onPress={handleToggleStop}>
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
					isDisabled={hasBeenPassed}
					isFirstStop={isFirstStop}
					isLastStop={isLastStop}
					isNextStop={isNextStop}
					isSelected={isSelected}
					stopId={waypointData.stop_id}
					stopSequence={waypointData.stop_sequence}

				/>
				<View style={pathWaypointStyles.detailsWrapper}>
					<PathWaypointHeader
						isFirstStop={isFirstStop}
						isLastStop={isLastStop}
						isSelected={isSelected}
						waypointData={waypointData}
					/>

					{isSelected && operationalDayContext.flags.is_today_selected && (
						<PathWaypointNextArrivals
							realtimeArrivals={realtimeArrivals}
							scheduledArrivals={scheduledArrivals}
						/>
					)}

					{isSelected && !isVehiclePage && (
						<PathWaypointTimetable />
					)}
				</View>
			</View>
		</TouchableOpacity>
	);

	//
}
