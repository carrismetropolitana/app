/* * */

import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { type Timetable } from '@/types/timetables.types';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TimetableSchedulesProps {
	data: Timetable
	onSelectTripIds: (tripIds: string[] | undefined) => void
	selectedTripIds: string[] | undefined
}

/* * */

export function TimetableSchedules({ data, onSelectTripIds, selectedTripIds }: TimetableSchedulesProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accessibilityContext = useAccessibilityContext();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View style={[
			styles.container,
			accessibilityContext.flags.screen_reader && styles.containerVertical,
		]}
		>
			<View style={[
				styles.column,
				accessibilityContext.flags.screen_reader && styles.columnVertical,
			]}
			>
				<Text
					accessible={false}
					style={[
						styles.hourBase,
						styles.hourFirst,
						accessibilityContext.flags.screen_reader && styles.hourVertical,
					]}
				>
					{t($ => $.common.TimetableSchedules.hours)}
				</Text>
				<Text accessible={false} style={styles.minuteBase}>{t($ => $.common.TimetableSchedules.minutes)}</Text>
			</View>
			{data.hours.map((hourData, index) => (
				<View
					key={hourData.hour_value}
					style={[
						styles.column,
						accessibilityContext.flags.screen_reader && styles.columnVertical,
					]}
				>

					<Text
						accessible={false}
						style={[
							styles.hourBase,
							index === data.hours.length - 1 && styles.hourLast,
							accessibilityContext.flags.screen_reader && styles.hourVertical,
						]}
					>
						{hourData.hour_label}
					</Text>

					{hourData.minutes.map((minuteData) => {
						const isSelectedMinute = selectedTripIds && selectedTripIds.length > 0 && minuteData.trip_ids?.some(tripId => selectedTripIds.includes(tripId));
						return (
							<Pressable
								key={minuteData.minute_value}
								accessibilityHint={t($ => $.common.TimetableSchedules.accessibility_hint)}
								onPress={() => onSelectTripIds(minuteData.trip_ids)}
								accessibilityLabel={minuteData.exception_ids?.length > 0
									? t($ => $.common.TimetableSchedules.accessibility_label.exception, {
										destination: data.exceptions.find(exception => exception.exception_id === minuteData.exception_ids[0])?.pattern_headsign,
										hour: hourData.hour_label,
										minute: minuteData.minute_label,
										route_long_name: data.exceptions.find(exception => exception.exception_id === minuteData.exception_ids[0])?.route_long_name,
									})
									: t($ => $.common.TimetableSchedules.accessibility_label.primary, {
										hour: hourData.hour_label,
										minute: minuteData.minute_label,
									})}
								style={[
									styles.minuteContainer,
									isSelectedMinute && styles.minuteContainerIsSelected,
								]}
							>

								<Text
									style={[
										styles.minuteBase,
										index === data.hours.length - 1 && styles.minuteLast,
										minuteData.exception_ids?.length > 0 && styles.minuteException,
										isSelectedMinute && styles.minuteIsSelected,
									]}
								>
									{minuteData.minute_label}
								</Text>

								{minuteData.exception_ids?.length > 0 && minuteData.exception_ids.map(exceptionId => (
									<Text
										key={exceptionId}
										style={[
											styles.minuteExceptionIndex,
											isSelectedMinute && styles.minuteExceptionIsSelected,
										]}
									>
										{exceptionId}
									</Text>
								))}

							</Pressable>
						);
					})}

				</View>
			))}
		</View>
	);

	//
}
