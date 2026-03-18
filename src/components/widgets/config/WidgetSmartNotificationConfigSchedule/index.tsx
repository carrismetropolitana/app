/* * */

import { WidgetSmartNotificationConfigScheduleTimeInput } from '@/components/widgets/config/WidgetSmartNotificationConfigScheduleTimeInput';
import { WidgetSmartNotificationConfigScheduleWeekdaysInput } from '@/components/widgets/config/WidgetSmartNotificationConfigScheduleWeekdaysInput';
import { WidgetSmartNotification } from '@/schemas/widgets';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigScheduleProps {
	endTime: number
	onEndTimeChange: (value: number) => void
	onStartTimeChange: (value: number) => void
	onToggleWeekday: (weekday: WidgetSmartNotification['properties']['weekdays'][number]) => void
	selectedWeekdays: WidgetSmartNotification['properties']['weekdays'][number][]
	startTime: number
}

/* * */

export function WidgetSmartNotificationConfigSchedule({ endTime, onEndTimeChange, onStartTimeChange, onToggleWeekday, selectedWeekdays, startTime }: WidgetSmartNotificationConfigScheduleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<WidgetSmartNotificationConfigScheduleTimeInput
				onChange={onStartTimeChange}
				title={t($ => $.widgets.WidgetSmartNotificationConfigSchedule.start_time_title)}
				value={startTime}
			/>
			<WidgetSmartNotificationConfigScheduleTimeInput
				onChange={onEndTimeChange}
				title={t($ => $.widgets.WidgetSmartNotificationConfigSchedule.end_time_title)}
				value={endTime}
			/>
			{startTime >= endTime && (
				<Text style={styles.error}>
					{t($ => $.widgets.WidgetSmartNotificationConfigSchedule.invalid_time_range)}
				</Text>
			)}
			<WidgetSmartNotificationConfigScheduleWeekdaysInput
				onToggleWeekday={onToggleWeekday}
				selectedWeekdays={selectedWeekdays}
				title={t($ => $.widgets.WidgetSmartNotificationConfigSchedule.weekdays_title)}
			/>
		</View>
	);

	//
};
