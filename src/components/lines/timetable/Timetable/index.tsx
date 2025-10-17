/* * */

import { TimetableExceptions } from '@/components/lines/timetable/TimetableExceptions';
import { TimetableSchedules } from '@/components/lines/timetable/TimetableSchedules';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { type Timetable } from '@/types/timetables.types';
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

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<TimetableSchedules
				data={timetableData}
				onSelectTripIds={lineDetailContext.actions.selectTripIds}
				selectedTripIds={lineDetailContext.data.selected_trip_ids}
			/>
			<TimetableExceptions data={timetableData.exceptions} />
		</View>
	);

	//
}
