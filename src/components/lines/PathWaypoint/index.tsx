/* * */

import { PathWaypointHeader } from '@/components/lines/PathWaypointHeader';
import { PathWaypointNextArrivals } from '@/components/lines/PathWaypointNextArrivals';
import { PathWaypointSpine } from '@/components/lines/PathWaypointSpine';
import { PathWaypointTimetable } from '@/components/lines/PathWaypointTimetable';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface PathWaypointProps {
	arrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	isFirstStop?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected?: boolean
	waypointData: Waypoint
}

/* * */

export function PathWaypoint({ arrivals, isFirstStop, isLastStop, isNextStop, isSelected, waypointData }: PathWaypointProps) {
	//

	//
	// A. Setup variables

	const now = Date.now();

	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();

	const styles = useStyles();

	//
	// B. Transform data

	const nextArrivals = arrivals?.filter(arrival => arrival.unixTs > now) || [];
	const realtimeArrivals = nextArrivals.filter(arrival => arrival.type === 'realtime');
	const scheduledArrivals = nextArrivals.filter(arrival => arrival.type === 'scheduled');

	//
	// C. Handle actions

	const handleToggleStop = () => {
		lineDetailContext.actions.selectWaypointId(waypointData.stop_id, waypointData.stop_sequence);
	};

	//
	// D. Render components

	return (
		<TouchableOpacity activeOpacity={0.6} disabled={isSelected} onPress={handleToggleStop}>
			<View
				style={[
					styles.container,
					isFirstStop && styles.isFirstStop,
					isLastStop && styles.isLastStop,
					isSelected && styles.isSelected,
				]}
			>
				<PathWaypointSpine
					backgroundColor={lineDetailContext.data.selected_pattern?.color}
					foregroundColor={lineDetailContext.data.selected_pattern?.text_color}
					isFirstStop={isFirstStop}
					isLastStop={isLastStop}
					isNextStop={isNextStop}
					isSelected={isSelected || false}
					stopId={waypointData.stop_id}
					stopSequence={waypointData.stop_sequence}
				/>
				<View style={styles.detailsWrapper}>

					<PathWaypointHeader
						isFirstStop={isFirstStop}
						isLastStop={isLastStop}
						isSelected={isSelected || false}
						waypointData={waypointData}
					/>

					{isSelected && operationalDateContext.flags.today && (
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
