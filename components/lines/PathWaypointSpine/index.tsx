/* * */

import { useDebugContext } from '@/contexts/Debug.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { IconChevronDown, IconHeartFilled } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	backgroundColor?: string
	foregroundColor?: string
	isDisabled?: boolean
	isFirstStop?: boolean
	isLastStop?: boolean
	isNextStop?: boolean
	isSelected: boolean
	stopId: string
	stopSequence: number
}

/* * */

export function PathWaypointSpine({ backgroundColor, foregroundColor, isDisabled, isFirstStop, isLastStop, isNextStop, isSelected, stopId, stopSequence }: Props) {
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

			{!debugContext.flags.is_debug_mode && isNextStop && (
				<>
					{!isFirstStop && (
						<View style={{
							alignSelf: 'center',
							backgroundColor: 'rgb(202, 202, 202)',
							elevation: 1,
							height: 20,
							position: 'absolute',
							top: -10,
							width: 16,
						}}
						/>
					)}
					<View style={[
						styles.topChevron,
						!isFirstStop && { transform: [{ translateY: -18 }] },
					]}
					>

						<IconChevronDown
							color="#FFFFFF"
							size={18}
							style={{ alignSelf: 'center', elevation: 4 }}
						/>
					</View>
				</>
			)}

			{!debugContext.flags.is_debug_mode && isFavoriteStop && (!isFirstStop || !isNextStop) && (
				<IconHeartFilled
					color={foregroundColor}
					style={[
						styles.marker,
						styles.markerFavorite,
						isFirstStop && styles.markerFirstStop,
						isFirstStop && styles.markerFirstStopFavorite,
						isDisabled && styles.markerDisabled,
						(isLastStop && !isFirstStop) ? styles.markerLastStopNext : null,
						isNextStop && !isFirstStop && !isLastStop && styles.markerMiddleNext,
					]}
				/>
			)}
			{!debugContext.flags.is_debug_mode && !isFavoriteStop && (!isFirstStop || !isNextStop) && (
				<View
					style={[
						styles.marker,
						isFirstStop && styles.markerFirstStop,
						isSelected && styles.markerSelected,
						isDisabled && styles.markerDisabled,
						(isLastStop && !isFirstStop) && styles.markerLastStopNext,
						isNextStop && !isFirstStop && !isLastStop && styles.markerMiddleNext,
						{ backgroundColor: foregroundColor },
					]}
				/>
			)}
		</View>
	);

	//
}
