/* * */

import { IconHeartFilled } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface PathWaypointSpineMarkerProps {
	foregroundColor?: string
	isDebug?: boolean
	isFavorite?: boolean
	isFirstStop?: boolean
	isLastStop?: boolean
	stopId: string
	stopSequence: number
}

/* * */

export function PathWaypointSpineMarker({ foregroundColor, isDebug, isFavorite, isFirstStop, stopSequence }: PathWaypointSpineMarkerProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	if (isFavorite) {
		return (
			<IconHeartFilled
				color={foregroundColor}
				style={[
					styles.marker,
					styles.markerFavorite,
					isFirstStop && styles.markerFirstStop,
				]}
			/>
		);
	}

	if (isDebug) {
		return (
			<Text
				style={[
					styles.marker,
					styles.stopSequence,
					isFirstStop && styles.stopSequenceFirstStop,
					{ color: foregroundColor },
				]}
			>
				{stopSequence}
			</Text>
		);
	}

	return (
		<View
			style={[
				styles.marker,
				isFirstStop && styles.markerFirstStop,
				{ backgroundColor: foregroundColor },
			]}
		/>
	);

	//
}
