/* * */

import { WaypointSpineMarker } from '@/components/lines/waypoints/WaypointSpineMarker';
import { useAccountContext } from '@/contexts/Account.context';
import { useDebugContext } from '@/contexts/Debug.context';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointSpineProps {
	backgroundColor?: string
	foregroundColor?: string
	isDisabled?: boolean
	isFirstStop?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	stopId: string
	stopSequence: number
}

/* * */

export function WaypointSpine({ backgroundColor, foregroundColor, isFirstStop, isLastStop, stopId, stopSequence }: WaypointSpineProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();
	const debugContext = useDebugContext();

	//
	// B. Transform data

	const isFavoriteStop = accountContext.data.account?.favorites.stop_ids.includes(stopId);

	//
	// C. Render components

	return (
		<View
			style={[
				styles.track,
				isFirstStop && styles.trackFirstStop,
				isLastStop && styles.trackLastStop,
				backgroundColor && { backgroundColor },
			]}
		>
			<WaypointSpineMarker
				foregroundColor={foregroundColor}
				isDebug={debugContext.flags.is_debug_mode}
				isFavorite={isFavoriteStop}
				isFirstStop={isFirstStop}
				stopId={stopId}
				stopSequence={stopSequence}
			/>
		</View>
	);

	//
}
