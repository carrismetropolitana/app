/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';

import { styles } from './styles';

/* * */

interface Props {
	longName?: string
	size?: 'lg' | 'md'
}

/* * */

export function StopDisplayName({ longName, size = 'md' }: Props) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'stop.StopDisplay' });
	const localeContext = useLocaleContext();
	const longNameStyles = [size === 'lg' ? styles.lg : styles.md];

	//
	// B. Render components

	return longName && (
		<Text
			accessibilityHint={t('stopDisplayNameAccessibilityHint')}
			accessibilityLabel={t('stopDisplayNameAccessibilityLabel')}
			accessibilityLanguage={localeContext.data.locale}
			accessibilityRole="search"
			style={longNameStyles}
		>
			{longName}
		</Text>
	);
	//
}
