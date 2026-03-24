/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { DateTime } from 'luxon';
import { Trans } from 'react-i18next';
import { Text } from 'react-native';

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
	const localeContext = useLocaleContext();
	const resolvedLocale = ['pt', 'pt-PT'].includes(localeContext.data.locale) ? 'pt-PT' : 'en-GB';

	//
	// B. Render components

	if (date && !isNaN(date.getTime())) {
		const formatted = DateTime.fromJSDate(date).setLocale(resolvedLocale).toLocaleString(DateTime.DATE_FULL);
		return (
			<Text style={[alertActivePeriodStyles.text, alertActivePeriodStyles[size === 'md' ? 'sm' : size]]}>
				<Trans
					components={{ parsedDate: <Text /> }}
					i18nKey={$ => $.alerts.AlertActivePeriod.end}
					values={{ parsedDate: formatted }}
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
	const localeContext = useLocaleContext();
	const resolvedLocale = ['pt', 'pt-PT'].includes(localeContext.data.locale) ? 'pt-PT' : 'en-GB';

	//
	// B. Render components

	if (date && !isNaN(date.getTime())) {
		const formatted = DateTime.fromJSDate(date).setLocale(resolvedLocale).toLocaleString(DateTime.DATE_FULL);

		return (
			<Text style={[alertActivePeriodStyles.text, size && alertActivePeriodStyles.sm]}>
				<Trans
					components={{ parsedDate: <Text /> }}
					i18nKey={$ => $.alerts.AlertActivePeriod.start}
					values={{ parsedDate: formatted }}
				/>
			</Text>
		);
	}

	//
}
