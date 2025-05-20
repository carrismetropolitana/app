/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import { ButtonGroup, Text } from '@rn-vui/themed';
import { IconCalendar } from '@tabler/icons-react-native';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

/* * */

import { styles } from './styles';

/* * */

export function SelectOperationalDay() {
	//

	//
	// A. Setup Variables

	const { t } = useTranslation('translation', { keyPrefix: 'common.SelectOperationalDay' });
	const localeContext = useLocaleContext();
	const operationalDayContext = useOperationalDayContext();

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showPicker, setShowPicker] = useState(false);

	const selectStyles = styles();

	const buttons = [
		{ element: () => <Text style={selectedIndex === 0 ? selectStyles.textSelected : selectStyles.text}>{t('today')}</Text> },
		{ element: () => <Text style={selectedIndex === 1 ? selectStyles.textSelected : selectStyles.text}>{t('tomorrow')}</Text> },
		{ element: () => (
			<View style={{ alignItems: 'center', flexDirection: 'row' }}>
				<IconCalendar size={16} />
				<Text style={selectedIndex === 2 ? selectStyles.textSelected : selectStyles.text}>
					{operationalDayContext.data.selected_day_jsdate
						? DateTime.fromJSDate(operationalDayContext.data.selected_day_jsdate).setLocale(localeContext.locale).toLocaleString(DateTime.DATE_MED).replaceAll('de', '').replaceAll('.', '').toLocaleUpperCase()
						: DateTime.now().setLocale(localeContext.locale).toLocaleString(DateTime.DATE_MED)}
				</Text>
			</View>
		),
		},
	];

	//
	// B. Fetch Data

	useEffect(() => {
		if (selectedIndex === 0) {
			operationalDayContext.actions.updateSelectedDayToToday();
		}
		else if (selectedIndex === 1) {
			operationalDayContext.actions.updateSelectedDayToTomorrow();
		}
	}, [
		selectedIndex,
	]);

	//
	// C . Handle Actions

	const handlePress = (i: number) => {
		setSelectedIndex(i);

		if (i === 2) {
			setShowPicker(true);
		}
	};

	const handleConfirm = (picked: Date) => {
		setShowPicker(false);
		setSelectedIndex(2);
		operationalDayContext.actions.updateSelectedDayFromJsDate(picked);
	};
	const handleCancel = () => setShowPicker(false);

	//

	return (
		<View style={selectStyles.container}>
			<ButtonGroup
				buttons={buttons}
				containerStyle={selectStyles.operationalDayContainer}
				innerBorderStyle={{ width: 0 }}
				onPress={handlePress}
				selectedButtonStyle={selectStyles.buttonSelected}
				selectedIndex={selectedIndex}
			/>
			<DateTimePickerModal
				date={operationalDayContext.data.selected_day_jsdate ?? undefined}
				isVisible={showPicker}
				locale={localeContext.locale}
				mode="date"
				onCancel={handleCancel}
				onConfirm={handleConfirm}
			/>
		</View>
	);
}
