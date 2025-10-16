/* * */

import { TimetableSchedulesMinute } from '@/components/lines/timetable/TimetableSchedulesMinutes';
import { type Timetable } from '@/types/timetables.types';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TimetableSchedulesProps {
	onSelectExceptionId: (value: string | undefined) => void
	onSelectTripIds: (tripIds: string[] | undefined) => void
	selectedExceptionId: string | undefined
	selectedTripIds: string[] | undefined
	timetableData: Timetable
}

/* * */

export function TimetableSchedules({ onSelectExceptionId, onSelectTripIds, selectedExceptionId, selectedTripIds, timetableData }: TimetableSchedulesProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'common.TimetableSchedules' });

	//
	// B. Render components

	return (
		<View style={styles.container}>

			<View style={styles.column}>
				<Text style={[styles.hourBase, styles.hourFirst]}>{t('hours')}</Text>
				<Text style={styles.minuteBase}>{t('minutes')}</Text>
			</View>

			{timetableData.hours.map((hourData, index) => (
				<View key={hourData.hour_value} style={styles.column}>
					<Text style={[styles.hourBase, index === timetableData.hours.length - 1 && styles.hourLast]}>
						{hourData.hour_label}
					</Text>
					{hourData.minutes.map(minuteData => (
						<TimetableSchedulesMinute
							key={minuteData.minute_value}
							isHighlighted={selectedTripIds && minuteData.trip_ids.some(tripId => selectedTripIds.includes(tripId))}
							minuteData={minuteData}
							onClick={() => onSelectTripIds(minuteData.trip_ids)}
							// selectedExceptionId={selectedExceptionId}
							// onSelectExceptionId={onSelectExceptionId}
						/>
					))}
				</View>
			))}

		</View>
	);

	//
}
