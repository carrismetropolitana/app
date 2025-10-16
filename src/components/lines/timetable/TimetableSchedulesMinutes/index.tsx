/* * */

import { type Minute } from '@/types/timetables.types';
import { Pressable, Text } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TimetableSchedulesMinuteProps {
	isHighlighted: boolean | undefined
	minuteData: Minute
	onClick?: () => void
	onSelectExceptionId?: (values: string[]) => void
	selectedExceptionIds?: string[]
}

/* * */

export function TimetableSchedulesMinute({ isHighlighted, minuteData, onClick, onSelectExceptionId, selectedExceptionIds }: TimetableSchedulesMinuteProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const isSelected = false; // selectedExceptionIds.some(exceptionId => minuteData.exception_ids.includes(exceptionId));

	//
	// B. Handle actions

	//
	// C. Render components

	return (
		<Pressable onPress={onClick}>
			<Text style={styles.minute}>
				{minuteData.minute_label}
				{minuteData.exception_ids?.length > 0 && minuteData.exception_ids.map(exceptionId => (
					<Text key={exceptionId} style={styles.exception}>
						{exceptionId}
					</Text>
				))}
			</Text>
		</Pressable>
	);

	//
}
