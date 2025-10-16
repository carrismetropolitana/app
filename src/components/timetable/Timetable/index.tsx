/* * */

// import TimetableExceptions from '@/components/timetable/TimetableExceptions';
import { TimetableSchedules } from '@/components/timetable/TimetableSchedules';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { type Timetable } from '@/types/timetables.types';
import { useState } from 'react';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TimetableProps {
	timetableData: Timetable
}

/* * */

export function Timetable({ timetableData }: TimetableProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineDetailContext = useLineDetailContext();

	const [selectedExceptionId, setSelectedExceptionId] = useState<string>();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TimetableSchedules
				onSelectExceptionId={setSelectedExceptionId}
				onSelectTripIds={lineDetailContext.actions.selectTripIds}
				selectedExceptionId={selectedExceptionId}
				selectedTripIds={lineDetailContext.data.selected_trip_ids}
				timetableData={timetableData}
			/>
			{/* <TimetableExceptions
				onSelectExceptionId={setSelectedExceptionId}
				selectedExceptionId={selectedExceptionId}
				timetableData={timetableData}
			/> */}
		</View>
	);

	//
}
