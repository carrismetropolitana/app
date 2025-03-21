// /* * */

// import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
// // import { DatePickerInput } from '@mantine/dates';
// // import { IconCalendarEvent } from '@tabler/icons-react';
// import SegmentedControl from '@react-native-segmented-control/segmented-control';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { selectOperationDayStyles } from './styles';

// /* * */

// export function SelectOperationalDay() {
// 	//

// 	//
// 	// A. Setup variables

// 	// const { t } = useTranslation('translations', { keyPrefix: 'common.SelectOperationalDay' });
// 	// const operationalDayContext = useOperationalDayContext();
// 	const [selectedIndex, setSelectedIndex] = useState(0);
// 	// const [selectedSegmentedControlOption, setSelectedSegmentedControlOption] = useState<string | undefined>();

// 	// const segementedControlOptions = [
// 	// {
// 	// 	label: t('today'),
// 	// 	value: 'today',
// 	// },
// 	// {
// 	// 	label: t('tomorrow'),
// 	// 	value: 'tomorrow',
// 	// },
// 	// {
// 	// 	label: (
// 	// 		<DatePickerInput
// 	// 			classNames={{ input: selectOperationDayStyles.datePickerInput, section: selectOperationDayStyles.datePickerSection, wrapper: selectOperationDayStyles.datePickerWrapper }}
// 	// 			data-selected={!operationalDayContext.flags.is_today_selected && !operationalDayContext.flags.is_tomorrow_selected}
// 	// 			dropdownType="modal"
// 	// 			leftSection={<IconCalendarEvent />}
// 	// 			onChange={operationalDayContext.actions.updateSelectedDayFromJsDate}
// 	// 			size="lg"
// 	// 			value={operationalDayContext.data.selected_day_jsdate}
// 	// 			valueFormat="DD MMM YYYY"
// 	// 			variant="unstyled"
// 	// 		/>
// 	// 	),
// 	// 	value: 'custom_date',
// 	// },
// 	// ];

// 	//
// 	// B. Transform data

// 	// useEffect(() => {
// 	// 	if (operationalDayContext.flags.is_today_selected) {
// 	// 		setSelectedSegmentedControlOption('today');
// 	// 	}
// 	// 	else if (operationalDayContext.flags.is_tomorrow_selected) {
// 	// 		setSelectedSegmentedControlOption('tomorrow');
// 	// 	}
// 	// 	else if (!operationalDayContext.flags.is_today_selected && !operationalDayContext.flags.is_tomorrow_selected) {
// 	// 		setSelectedSegmentedControlOption('custom_date');
// 	// 	}
// 	// }, [operationalDayContext.flags.is_today_selected, operationalDayContext.flags.is_tomorrow_selected]);

// 	//
// 	// C. Handle actions

// 	// const handleSegmentedControlChange = (value: string) => {
// 	// 	if (value === 'today') {
// 	// 		operationalDayContext.actions.updateSelectedDayToToday();
// 	// 	}
// 	// 	else if (value === 'tomorrow') {
// 	// 		operationalDayContext.actions.updateSelectedDayToTomorrow();
// 	// 	}
// 	// };

// 	//
// 	// D. Render components

// 	return (
// 		<SegmentedControl
// 			selectedIndex={selectedIndex}
// 			values={['One', 'Two']}
// 			onChange={(event) => {
// 				setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
// 			}}
// 		/>
// 		// <SegmentedControl
// 	// onChange={handleSegmentedControlChange}
// 	// selectedIndex={0}
// 	// values={['hoje', 'amanhã', 'custom_date']}

// 	// classNames={{
// 	// 	control: selectOperationDayStyles.segmentedControlDateInputOverrideControl,
// 	// 	label: selectOperationDayStyles.segmentedControlDateInputOverrideLabel,
// 	// }}
// 	// />
// 	);

// 	//
// }
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

export function SelectOperationalDay() {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			<Text>OOOO</Text>
			{/* <SegmentedControl
				onChange={event => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
				selectedIndex={selectedIndex}
				values={['One', 'Two']}
			/> */}
		</View>
	);
}
