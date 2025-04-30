/* * */

import type { Waypoint } from '@carrismetropolitana/api-types/network';

import { PathWaypointHeader } from '@/components/lines/PathWaypointHeader';
import { PathWaypointNextArrivals } from '@/components/lines/PathWaypointNextArrivals';
import { PathWaypointSpine } from '@/components/lines/PathWaypointSpine';
import { PathWaypointTimetable } from '@/components/lines/PathWaypointTimetable';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { TouchableOpacity, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	arrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	id?: string
	isFirstStop?: boolean
	isLastStop?: boolean
	isSelected: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypoint({ arrivals, id, isFirstStop, isLastStop, isSelected, waypointData }: Props) {
	//

	//
	// A. Setup variables

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();

	const now = Date.now();
	const pathWaypointpathWaypointStyles = styles();

	//
	// B. Transform data

	const nextArrivals = arrivals?.filter(arrival => arrival.unixTs > now) || [];
	const realtimeArrivals = nextArrivals.filter(arrival => arrival.type === 'realtime');
	const scheduledArrivals = nextArrivals.filter(arrival => arrival.type === 'scheduled');

	//
	// C. Handle actions

	interface HandleToggleStopEvent {
		stopPropagation: () => void
	}

	const handleToggleStop = (event: HandleToggleStopEvent) => {
		linesDetailContext.actions.setActiveWaypoint(waypointData.stop_id, waypointData.stop_sequence);
		event.stopPropagation();
	};

	//
	// D. Render components

	return (
		<TouchableOpacity onPress={handleToggleStop}>
			<View className={`${pathWaypointpathWaypointStyles.container} ${isFirstStop && pathWaypointpathWaypointStyles.isFirstStop} ${isLastStop && pathWaypointpathWaypointStyles.isLastStop} ${isSelected && pathWaypointpathWaypointStyles.isSelected}`} id={id}>
				<PathWaypointSpine
					backgroundColor={linesDetailContext.data.active_pattern?.color}
					foregroundColor={linesDetailContext.data.active_pattern?.text_color}
					isFirstStop={isFirstStop}
					isLastStop={isLastStop}
					isSelected={isSelected}
					stopId={waypointData.stop_id}
					stopSequence={waypointData.stop_sequence}
				/>
				<View style={pathWaypointpathWaypointStyles.detailsWrapper}>
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

					{isSelected && (
						<PathWaypointTimetable />
					)}
				</View>
			</View>
		</TouchableOpacity>
	);

	//
}
