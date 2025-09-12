/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { styles } from './styles';

/* * */

interface NoDataLabelProps {
	fill?: boolean
	text?: string
	withMinHeight?: boolean
}

/* * */
export function NoDataLabel({ text }: NoDataLabelProps) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'layout.NoDataLabel' });
	const noDataLabelStyles = styles();
	const localeContext = useLocaleContext();

	//
	// B. Render Components

	return (
		<Text
			accessibilityHint={t('noDataAccessibilityHint')}
			accessibilityLabel={t('noDataAccessibilityLabel')}
			accessibilityLanguage={localeContext.locale}
			style={noDataLabelStyles.text}
		>
			{text || t('default')}
		</Text>
	);

	//
}
