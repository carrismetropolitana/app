/* * */

import { LineDisplay } from '@/components/lines/LineDisplay';
import { useDebugContext } from '@/contexts/Debug.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { Arrival, ArrivalStatus } from '@/types/stops.types';
import { Text } from '@rn-vui/themed';
import { Link } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import StopDetailNextArrivals from '../StopDetailNextArrivals';
import styles from './styles.module.css';

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
	const stopsDetailContext = useStopsDetailContext();
	const locationsContext = useLocationsContext();

	const operationalDateContext = useOperationalDayContext();
	const selectedDate = operationalDateContext.data.selected_day;

	//
	// B. Transform data

	const isSelected = useMemo(() => {
		const isSameTripId = stopsDetailContext.data.active_trip_id === arrivalData.trip_id;
		const isSameStopSequence = stopsDetailContext.data.active_stop_sequence === arrivalData.stop_sequence;
		return isSameTripId && isSameStopSequence;
	}, [stopsDetailContext.data.active_trip_id, stopsDetailContext.data.active_stop_sequence, arrivalData.trip_id, arrivalData.stop_sequence]);

	// This is needed to avoid rerendering the component when the time changes
	const thisPattern = stopsDetailContext.data.valid_pattern_groups?.find(pattern => pattern.id === arrivalData.pattern_id);

	//
	// C. Handle actions

	const handleSelectTrip = useCallback(() => {
		if (isSelected) {
			stopsDetailContext.actions.resetActiveTripId();
			return;
		}
		stopsDetailContext.actions.setActiveTripId(arrivalData.trip_id, arrivalData.stop_sequence);
	}, [arrivalData.trip_id, arrivalData.stop_sequence, stopsDetailContext.actions.setActiveTripId]);

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
					<StopDetailNextArrivals
						href={`/line/${arrivalData.line_id}`}
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
						{/* <Link className={styles.openLinePage} href={`/lines/${arrivalData.line_id}?&day=${selectedDate ? selectedDate : ''}&active_pattern_id=${thisPattern?.id}`} onPress={e => e.stopPropagation()} target="_blank">{t('open_line_page')}</Link> */}
						{thisPattern.locality_ids.length > 0 && (
							<View className={styles.localitiesListWrapper}>
								{/* <Text className={styles.localitiesLabel}>{t('localities.label')}</Text> */}
								<Text>
									{thisPattern.locality_ids.map((localityId, index) => (
										<View key={index}>
											{index > 0 && <View className={styles.localitySeparator}> • </View>}
											<View className={styles.localityName}>{locationsContext.actions.getLocalityById(localityId)?.name}</View>
										</View>
									))}
								</Text>
							</View>
						)}
					</View>
				)}

			</View>
		</TouchableOpacity>
	);
}
