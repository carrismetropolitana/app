/* * */

import { type Timetable } from '@/types/timetables.types';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

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

					<Text style={[
						styles.hourBase,
						index === timetableData.hours.length - 1 && styles.hourLast,
					]}
					>
						{hourData.hour_label}
					</Text>

					{hourData.minutes.map(minuteData => (
						<Pressable key={minuteData.minute_value} onPress={() => onSelectTripIds(minuteData.trip_ids)} style={styles.minuteContainer}>
							<Text style={[
								styles.minuteBase,
								index === timetableData.hours.length - 1 && styles.minuteLast,
								minuteData.exception_ids?.length > 0 && styles.minuteException,
							]}
							>
								{minuteData.minute_label}
							</Text>
							{minuteData.exception_ids?.length > 0 && minuteData.exception_ids.map(exceptionId => (
								<Text key={exceptionId} style={styles.minuteExceptionIndex}>
									{exceptionId}
								</Text>
							))}
						</Pressable>
					))}

				</View>
			))}

		</View>
	);

	//
}
