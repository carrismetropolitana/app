/* * */

import { PathWaypointNextArrivals } from '@/components/lines/waypoints/PathWaypointNextArrivals';
import { WaypointFacilities } from '@/components/lines/waypoints/WaypointFacilities';
import { WaypointHeader } from '@/components/lines/waypoints/WaypointHeader';
import { WaypointSpine } from '@/components/lines/waypoints/WaypointSpine';
import { WaypointTimetable } from '@/components/lines/waypoints/WaypointTimetable';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { type Waypoint } from '@carrismetropolitana/api-types/network';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointProps {
	arrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	isFirstStop?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected?: boolean
	waypointData: Waypoint
}

/* * */

export function Waypoint({ arrivals, isFirstStop, isLastStop, isSelected, waypointData }: WaypointProps) {
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
					<WaypointHeader stopId={waypointData.stop_id} />
					{isSelected && <WaypointFacilities stopId={waypointData.stop_id} />}
					{isSelected && operationalDateContext.flags.today && (
						<PathWaypointNextArrivals
							realtimeArrivals={realtimeArrivals}
							scheduledArrivals={scheduledArrivals}
						/>
					)}
					{isSelected && <WaypointTimetable />}
				</View>
			</View>
		</TouchableOpacity>
	);

	//
}
