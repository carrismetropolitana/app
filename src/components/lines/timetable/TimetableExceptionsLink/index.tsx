/* * */

import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { type Exception } from '@/types/timetables.types';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface TimetableExceptionsLinkProps {
	exceptionData: Exception
}

/* * */

export function TimetableExceptionsLink({ exceptionData }: TimetableExceptionsLinkProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const lineDetailContext = useLineDetailContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.TimetableExceptionsLink' });

	//
	// B. Handle actions

	const handleExceptionClick = () => {
		lineDetailContext.actions.selectPatternId(exceptionData.pattern_id);
	};

	//
	// C. Render components

	return (
		<TouchableOpacity onPress={handleExceptionClick}>
			<Text style={styles.text}>
				<Text style={styles.id}>{exceptionData.exception_id + ')'}</Text>
				<Text> </Text>
				<Text>{t('route_label')}</Text>
				<Text> </Text>
				<Text style={styles.value}>{exceptionData.route_long_name}</Text>
				<Text> </Text>
				<Text>{t('direction_label')}</Text>
				<Text> </Text>
				<Text style={[styles.value, { textDecorationLine: 'underline' }]}>{exceptionData.pattern_headsign}</Text>
			</Text>
		</TouchableOpacity>
	);

	//
}
