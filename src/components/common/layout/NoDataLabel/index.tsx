/* * */

import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface NoDataLabelProps {
	accessibilityHint?: string
	accessibilityLabel?: string
	text?: string
}

/* * */
export function NoDataLabel({ accessibilityHint, accessibilityLabel, text }: NoDataLabelProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'layout.NoDataLabel' });

	//
	// B. Render components

	return (
		<View accessibilityHint={accessibilityHint} accessibilityLabel={accessibilityLabel} accessible>
			<Text style={styles.text}>
				{text || t('default')}
			</Text>
		</View>
	);

	//
}
