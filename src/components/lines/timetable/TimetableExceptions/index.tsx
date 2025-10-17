/* * */

import { TimetableExceptionsLink } from '@/components/lines/timetable/TimetableExceptionsLink';
import { type Exception } from '@/types/timetables.types';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface TimetableExceptionsProps {
	data: Exception[]
}

export function TimetableExceptions({ data }: TimetableExceptionsProps) {
	//

	if (!data?.length) {
		return null;
	}

	return (
		<View style={styles.container}>
			{data.map(item => (
				<TimetableExceptionsLink
					key={item.exception_id}
					exceptionData={item}
				/>
			))}
		</View>
	);

	//
}
