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
		<TouchableOpacity
			accessibilityHint={t('accessibility_hint')}
			onPress={handleExceptionClick}
			accessibilityLabel={t('accessibility_label', {
				destination: exceptionData.pattern_headsign,
				index: exceptionData.exception_id.toUpperCase(),
				route_long_name: exceptionData.route_long_name,
			})}
		>
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
