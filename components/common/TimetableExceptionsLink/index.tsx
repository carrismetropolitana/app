/* * */

import type { Exception } from '@/types/timetables.types';

import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { IconArrowUpRight } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	exceptionData: Exception
	selectedExceptionIds: string[]
	setSelectedExceptionIds: (values: string[]) => void
}

/* * */

export function TimetableExceptionsLink({
	exceptionData,
	selectedExceptionIds,
	setSelectedExceptionIds,
}: Props) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('common.TimetableExceptionsLink');
	const linesDetailContext = useLinesDetailContext();

	//
	// B. Transform data

	const isSelected = selectedExceptionIds.includes(exceptionData.exception_id);
	const isOthersSelected = !isSelected && selectedExceptionIds.length > 0;

	//
	// C. Handle actions

	const handlePressIn = () => setSelectedExceptionIds([exceptionData.exception_id]);
	const handlePressOut = () => setSelectedExceptionIds([]);
	const handleExceptionClick = () => linesDetailContext.actions.setActivePattern(exceptionData.pattern_version_id);

	//
	// D. Render components

	return (
		<Pressable
			onPress={handleExceptionClick}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
		>
			<Text style={[
				styles.container,
				isSelected && styles.containerIsSelected,
				isOthersSelected && styles.containerIsOthersSelected,
			]}
			>
				<Text style={styles.exceptionId}>{exceptionData.exception_id}</Text>
				<Text style={styles.patternHeadsign}>{exceptionData.pattern_headsign}</Text>
				<Text style={styles.routeLongName}>{exceptionData.route_long_name}</Text>
				<IconArrowUpRight style={styles.icon} />
			</Text>
		</Pressable>
	);

	//
}
