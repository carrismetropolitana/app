/* * */

import type { Minute, Timetable } from '@/types/timetables.types';

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

/* * */

interface TimetableSchedulesMinuteProps {
	isHighlighted: boolean
	minuteData: Minute
	onClick?: () => void
	selectedExceptionIds: string[]
	setSelectedExceptionIds: (values: string[]) => void
}

interface TimetableSchedulesProps {
	selectedExceptionIds: string[]
	setSelectedExceptionIds: (values: string[]) => void
	timetableData: Timetable
}

/* * */

export default function TimetableSchedules({ selectedExceptionIds, setSelectedExceptionIds, timetableData }: TimetableSchedulesProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('common.TimetableSchedules');
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<View style={styles.column}>
				<Text style={styles.hour}>{t('hours')}</Text>
				<Text style={styles.minute}>{t('minutes')}</Text>
			</View>
			{timetableData.hours.map(hourData => (
				<View key={hourData.hour_value} style={styles.column}>
					<Text style={styles.hour}>{hourData.hour_label}</Text>
					{hourData.minutes.map(minuteData => (
						<TimetableSchedulesMinute
							key={minuteData.minute_value}
							minuteData={minuteData}
							onClick={() => linesDetailContext.actions.setHighlightedTripIds(minuteData.trip_ids)}
							selectedExceptionIds={selectedExceptionIds}
							setSelectedExceptionIds={setSelectedExceptionIds}
							isHighlighted={Boolean(
								linesDetailContext.data.highlighted_trip_ids
								&& minuteData.trip_ids.some(tripId =>
									linesDetailContext.data.highlighted_trip_ids?.includes(tripId),
								),
							)}
						/>
					))}
				</View>
			))}
		</View>
	);

	//
}

/* * */

function TimetableSchedulesMinute({ isHighlighted, minuteData, onClick, selectedExceptionIds, setSelectedExceptionIds }: TimetableSchedulesMinuteProps) {
	//

	//
	// A. Transform data

	const isSelected = selectedExceptionIds.some(exceptionId => minuteData.exception_ids.includes(exceptionId));

	//
	// B. Handle actions

	const handlePressIn = () => {
		setSelectedExceptionIds(minuteData.exception_ids);
	};

	const handlePressOut = () => {
		setSelectedExceptionIds([]);
	};

	//
	// C. Render components

	return (
		<Pressable
			onPress={onClick}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			style={({ pressed }) => [
				styles.minute,
				minuteData.exception_ids.length > 0 && styles.minuteWithException,
				isSelected && styles.minuteIsSelected,
				!isSelected && selectedExceptionIds.length > 0 && styles.minuteIsOthersSelected,
				isHighlighted && styles.minuteIsHighlighted,
				pressed && { opacity: 0.8 },
			]}
		>
			<Text>
				{minuteData.minute_label}
				{minuteData.exception_ids.length > 0
				&& minuteData.exception_ids.map(exceptionId => (
					<Text key={exceptionId} style={styles.exception}>
						{exceptionId}
					</Text>
				))}
			</Text>
		</Pressable>
	);

	//
}
