/* * */

import { LineDisplay } from '@/components/lines/LineDisplay';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { Arrival, ArrivalStatus } from '@/types/stops.types';
import { Text } from '@rn-vui/themed';
import { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';

import styles from './styles.module.css';

import StopDetailArrivals from '../detail/StopDetailArrivals';

/* * */

interface Props {
	arrivalData: Arrival
	status: ArrivalStatus
}

/* * */

export function StopsDetailContentTimetableRow({ arrivalData, status }: Props) {
	//

	//
	// A. Setup variables

	// const t = useTranslation('stops.StopsDetailContentTimetableRow');
	const stopDetailContext = useStopDetailContext();
	const locationsContext = useLocationsContext();

	//
	// B. Transform data

	const isSelected = useMemo(() => {
		const isSameTripId = stopDetailContext.data.active_trip_id === arrivalData.trip_id;
		const isSameStopSequence = stopDetailContext.data.active_stop_sequence === arrivalData.stop_sequence;
		return isSameTripId && isSameStopSequence;
	}, [stopDetailContext.data.active_trip_id, stopDetailContext.data.active_stop_sequence, arrivalData.trip_id, arrivalData.stop_sequence]);

	// This is needed to avoid rerendering the component when the time changes
	const thisPattern = stopDetailContext.data.valid_pattern_groups?.find(pattern => pattern.id === arrivalData.pattern_id);

	//
	// C. Handle actions

	const handleSelectTrip = useCallback(() => {
		if (isSelected) {
			stopDetailContext.actions.resetActiveTripId();
			return;
		}
		stopDetailContext.actions.setActiveTripId(arrivalData.trip_id, arrivalData.stop_sequence);
	}, [arrivalData.trip_id, arrivalData.stop_sequence, stopDetailContext.actions.setActiveTripId]);

	//
	// D. Render components

	if (!thisPattern) {
		return null;
	}

	return (
		<TouchableOpacity onPress={handleSelectTrip}>
			<View className={`${styles.container} ${styles[status]} ${isSelected && styles.isSelected}`}>
				<View className={styles.summary}>
					<LineDisplay
						color={thisPattern.color}
						longName={thisPattern.headsign}
						shortName={thisPattern.line_id}
						textColor={thisPattern.text_color}
					/>
					<StopDetailArrivals
						href={`/lines/${arrivalData.line_id}`}
						title={arrivalData.headsign}
					/>
				</View>

				{/* {isSelected && debugContext.flags.is_debug_mode && (
				<View className={styles.details}>
					<StopsDetailContentTimetableRowDebug arrivalData={arrivalData} />
				</View>
			)} */}

				{isSelected && (
					<View className={styles.details}>
						{thisPattern.locality_ids.length > 0 && (
							<View className={styles.localitiesListWrapper}>
								{thisPattern.locality_ids.map((localityId, index) => (
									<View key={index}>
										{index > 0 && <View className={styles.localitySeparator}><Text> • </Text></View>}
										<View className={styles.localityName}>
											<Text>{locationsContext.actions.getLocalityById(localityId)?.name}</Text>
										</View>
									</View>
								))}
							</View>
						)}
					</View>
				)}

			</View>
		</TouchableOpacity>
	);
}
