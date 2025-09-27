/* * */

import { type WidgetSmartNotification } from '@/types/widget.types';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetSmartNotificationConfigScheduleWeekdaysInputProps {
	onToggleWeekday: (weekday: WidgetSmartNotification['week_days'][number]) => void
	selectedWeekdays: WidgetSmartNotification['week_days']
	title: string
}

/* * */

export function WidgetSmartNotificationConfigScheduleWeekdaysInput({ onToggleWeekday, selectedWeekdays, title }: WidgetSmartNotificationConfigScheduleWeekdaysInputProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'widgets.WidgetSmartNotificationConfigScheduleWeekdaysInput' });

	const availableWeekdays: WidgetSmartNotification['week_days'] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.weekdaysWrapper}>
				{availableWeekdays.map(item => (
					<TouchableOpacity
						key={item}
						accessibilityLabel={t(`weekdays.long.${item}`)}
						accessibilityRole="togglebutton"
						accessibilityState={{ checked: selectedWeekdays.includes(item) }}
						onPress={() => onToggleWeekday(item)}
					>
						<Text style={[styles.weekday, selectedWeekdays.includes(item) && styles.weekdaySelected]}>
							{t(`weekdays.short.${item}`)}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	//
};
