/* * */

import { Text } from '@rn-vui/themed';
import { Trans, useTranslation } from 'react-i18next';

import { styles } from './styles';

/* * */

interface AlertActivePeriodEndProps {
	date?: Date
	size?: 'md' | 'sm'
}

interface AlertActivePeriodStartProps {
	date?: Date
	size?: 'md' | 'sm'
}

/* * */

export function AlertActivePeriodEnd({ date, size = 'md' }: AlertActivePeriodEndProps) {
	//

	//
	// A. Setup variables

	const alertActivePeriodStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'alerts.AlertActivePeriod' });

	//
	// B. Render components
	console.log(date);
	if (date && !isNaN(date.getTime())) {
		return (
			<Text style={[alertActivePeriodStyles.text, alertActivePeriodStyles[size === 'md' ? 'sm' : size]]}>
				<Trans
					components={{ parsedDate: <Text /> }}
					i18nKey="end"
					ns="alerts.AlertActivePeriod"
					values={{ end: date }}
				/>
			</Text>
		);
	}

	//
}

/* * */

export function AlertActivePeriodStart({ date, size = 'md' }: AlertActivePeriodStartProps) {
	//

	//
	// A. Setup variables

	const alertActivePeriodStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'alerts.AlertActivePeriod' });

	//
	// B. Render components

	if (date && !isNaN(date.getTime())) {
		return (
			<Text style={[alertActivePeriodStyles.text, size && alertActivePeriodStyles.sm]}>
				<Trans
					components={{ parsedDate: <Text /> }}
					i18nKey="start"
					ns="alerts.AlertActivePeriod"
					values={{ start: date }}
				/>
			</Text>
		);
	}

	//
}
