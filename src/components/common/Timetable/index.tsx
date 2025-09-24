/* * */

import type { Timetable } from '@/types/timetables.types';

import TimetableExceptions from '@/components/common/TimetableExceptions';
import TimetableSchedules from '@/components/common/TimetableSchedules';
import { useState } from 'react';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	timetableData: Timetable
}

/* * */

export default function TimetableComponent({ timetableData }: Props) {
	//

	//
	// A. Setup variables

	const [selectedExceptionIds, setSelectedExceptionIds] = useState<string[]>([]);

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TimetableSchedules
				selectedExceptionIds={selectedExceptionIds}
				setSelectedExceptionIds={setSelectedExceptionIds}
				timetableData={timetableData}
			/>
			<TimetableExceptions
				selectedExceptionIds={selectedExceptionIds}
				setSelectedExceptionIds={setSelectedExceptionIds}
				timetableData={timetableData}
			/>
		</View>
	);

	//
}
