/* * */

import { WidgetSmartNotificationConfigScheduleTimeInput } from '@/components/widgets/smart-notifications/WidgetSmartNotificationConfigScheduleTimeInput';
import { WidgetSmartNotificationConfigScheduleWeekdaysInput } from '@/components/widgets/smart-notifications/WidgetSmartNotificationConfigScheduleWeekdaysInput';
import { WidgetSmartNotification } from '@/types/widget.types';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigScheduleProps {
	endTime: number
	onEndTimeChange: (value: number) => void
	onStartTimeChange: (value: number) => void
	onToggleWeekday: (weekday: WidgetSmartNotification['week_days'][number]) => void
	selectedWeekdays: WidgetSmartNotification['week_days']
	startTime: number
}

/* * */

export function WidgetSmartNotificationConfigSchedule({ endTime, onEndTimeChange, onStartTimeChange, onToggleWeekday, selectedWeekdays, startTime }: WidgetSmartNotificationConfigScheduleProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetSmartNotificationConfigSchedule' });

	//
	// B. Render components

	return (
		<View style={useStyles().container}>
			<WidgetSmartNotificationConfigScheduleTimeInput
				onChange={onStartTimeChange}
				title={t('start_time_title')}
				value={startTime}
			/>
			<WidgetSmartNotificationConfigScheduleTimeInput
				onChange={onEndTimeChange}
				title={t('end_time_title')}
				value={endTime}
			/>
			<WidgetSmartNotificationConfigScheduleWeekdaysInput
				onToggleWeekday={onToggleWeekday}
				selectedWeekdays={selectedWeekdays}
				title={t('weekdays_title')}
			/>
		</View>
	);

	//
};
