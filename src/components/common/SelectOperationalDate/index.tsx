/* * */

import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import { Dates } from '@/core-replica';
import { useSystemVariables } from '@/theme/global';
import { IconCalendar } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { useStyles } from './styles';

/* * */

export function SelectOperationalDate() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const operationalDateContext = useOperationalDateContext();

	const { t } = useTranslation('translation', { keyPrefix: 'common.SelectOperationalDate' });

	const [showDatePicker, setShowDatePicker] = useState(false);

	//
	// B. Transform data

	const isToday = operationalDateContext.flags.today;
	const isTomorrow = operationalDateContext.flags.tomorrow;
	const isOtherDate = !isToday && !isTomorrow;

	const minDate = useMemo(() => {
		return Dates
			.fromOperationalDate(operationalDateContext.data.today.operational_date, 'Europe/Lisbon')
			.js_date;
	}, [operationalDateContext.data.today]);

	//
	// C. Handle actions

	const handleSelectToday = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		operationalDateContext.actions.updateSelectedDateToToday();
	};

	const handleSelectTomorrow = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		operationalDateContext.actions.updateSelectedDateToTomorrow();
	};

	const handleConfirm = (value: Date) => {
		setShowDatePicker(false);
		operationalDateContext.actions.updateSelectedDateFromJsDate(value);
	};

	//
	// D. Render components

	return (
		<>

			<View style={styles.container}>

				<TouchableOpacity
					accessibilityHint={t('today.accessibility_hint')}
					accessibilityState={{ checked: isToday ? true : false }}
					onPress={handleSelectToday}
					style={[styles.button, isToday && styles.buttonIsSelected]}
				>
					<Text style={[styles.label, isToday && styles.labelIsSelected]}>
						{t('today.label')}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityHint={t('tomorrow.accessibility_hint')}
					accessibilityState={{ checked: isTomorrow ? true : false }}
					onPress={handleSelectTomorrow}
					style={[styles.button, isTomorrow && styles.buttonIsSelected]}
				>
					<Text style={[styles.label, isTomorrow && styles.labelIsSelected]}>
						{t('tomorrow.label')}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityHint={t('other_date.accessibility_hint')}
					accessibilityLabel={t('other_date.accessibility_label', { date: operationalDateContext.data.selected_date_display })}
					onPress={() => setShowDatePicker(true)}
					style={[styles.button, isOtherDate && styles.buttonIsSelected]}
				>
					<IconCalendar color={isOtherDate ? systemVariables.text[100] : systemVariables.text[200]} size={18} />
					<Text numberOfLines={1} style={[styles.label, isOtherDate && styles.labelIsSelected]}>
						{operationalDateContext.data.selected_date_display}
					</Text>
				</TouchableOpacity>

			</View>

			<DateTimePickerModal
				date={operationalDateContext.data.selected_date?.js_date}
				isVisible={showDatePicker}
				minimumDate={minDate}
				mode="date"
				onCancel={() => setShowDatePicker(false)}
				onConfirm={handleConfirm}
				pickerStyleIOS={{ alignItems: 'center' }}
			/>

		</>
	);

	//
}
