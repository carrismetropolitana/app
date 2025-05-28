'use client';

/* * */

import { useDebugContext } from '@/contexts/Debug.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { IconArrowBadgeDown, IconArrowDown, IconChevronDown, IconHeartFilled } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	backgroundColor?: string
	foregroundColor?: string
	isFirstStop?: boolean
	isLastStop?: boolean
	isDisabled?: boolean
	isNextStop?: boolean
	isSelected: boolean
	stopId: string
	stopSequence: number
}

/* * */

export function PathWaypointSpine({ backgroundColor, foregroundColor, isFirstStop, isLastStop, isSelected, stopId, stopSequence, isDisabled, isNextStop }: Props) {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const debugContext = useDebugContext();
	//
	// B. Transform data

	const isFavoriteStop = !!profileContext.data.favorite_stops?.includes(stopId);

	//
	// C. Render components

	return (
		<View
			style={[
				styles.container,
				isFirstStop && styles.containerFirstStop,
				isLastStop && styles.containerLastStop,
				isSelected && styles.containerSelected,
				isFirstStop && isSelected && styles.containerFirstStopSelected,
				isLastStop && isSelected && styles.containerLastStopSelected,
				backgroundColor && { backgroundColor },
			]}
		>

			{debugContext.flags.is_debug_mode && (
				<Text
					style={[
						styles.marker,
						styles.stopSequence,
						isFirstStop && styles.stopSequenceFirstStop,
						isLastStop && styles.stopSequenceLastStop,
						{ color: foregroundColor },
						isDisabled && styles.markerDisabled,
						isNextStop && styles.markerFirstStopNext,

					]}
				>
					{stopSequence}
				</Text>
			)}

			{!debugContext.flags.is_debug_mode && isLastStop && isFirstStop && (
				<IconChevronDown
					color={foregroundColor}
					size={16}
					style={[
						styles.marker,
						isFirstStop && styles.markerFirstStop,
						isDisabled && styles.markerDisabled,
					]}
				/>
			)}

			{!debugContext.flags.is_debug_mode && isFavoriteStop && (
				<IconHeartFilled
					color={foregroundColor}
					style={[
						styles.marker,
						styles.markerFavorite,
						isFirstStop && styles.markerFirstStop,
						isFirstStop && styles.markerFirstStopFavorite,
						isDisabled && styles.markerDisabled,
						isNextStop && styles.markerNext,
					]}
				/>
			)}
			{!debugContext.flags.is_debug_mode && !isFavoriteStop && (
				<View
					style={[
						styles.marker,
						isFirstStop && styles.markerFirstStop,
						isSelected && styles.markerSelected,
						isDisabled && styles.markerDisabled,
						isNextStop && styles.markerLastStopNext,
						{ backgroundColor: foregroundColor },
					]}
				/>
			)}
		</View>
	);

	//
}
