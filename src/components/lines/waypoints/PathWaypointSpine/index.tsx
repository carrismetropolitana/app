/* * */

import { useDebugContext } from '@/contexts/Debug.context';
import { useFavoritesContext } from '@/contexts/Favorites.context';
import { View } from 'react-native';

import { PathWaypointSpineMarker } from '../PathWaypointSpineMarker';
import { useStyles } from './styles';

/* * */

interface PathWaypointSpineProps {
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

export function PathWaypointSpine({ backgroundColor, foregroundColor, isFirstStop, isLastStop, stopId, stopSequence }: PathWaypointSpineProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const favoritesContext = useFavoritesContext();
	const debugContext = useDebugContext();

	//
	// B. Transform data

	const isFavoriteStop = favoritesContext.data.stop_ids.includes(stopId);

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
			<PathWaypointSpineMarker
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
