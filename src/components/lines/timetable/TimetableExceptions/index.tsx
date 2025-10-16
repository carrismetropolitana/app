/* * */

import { TimetableExceptionsLink } from '@/components/lines/timetable/TimetableExceptionsLink';
import { type Timetable } from '@/types/timetables.types';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	selectedExceptionIds: string[]
	setSelectedExceptionIds: (values: string[]) => void
	timetableData: Timetable
}

export default function TimetableExceptions({
	selectedExceptionIds,
	setSelectedExceptionIds,
	timetableData,
}: Props) {
	if (!timetableData.exceptions.length) {
		return null;
	}

	return (
		<View style={styles.container}>
			{timetableData.exceptions.map(exceptionData => (
				<TimetableExceptionsLink
					key={exceptionData.exception_id}
					exceptionData={exceptionData}
					selectedExceptionIds={selectedExceptionIds}
					setSelectedExceptionIds={setSelectedExceptionIds}
				/>
			))}
		</View>
	);
}
