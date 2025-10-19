/* * */

import { SelectOperationalDate } from '@/components/common/SelectOperationalDate';
import { useAccessibilityContext } from '@/contexts/Accessibility.context';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function LineDetailSelectOperationalDate() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accessibilityContext = useAccessibilityContext();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.LineDetailSelectOperationalDate' });

	//
	// B. Render components

	return (
		<View style={styles.container}>

			{accessibilityContext.flags.screen_reader && (
				<Text style={styles.title}>{t('title')}</Text>
			)}

			<SelectOperationalDate />

		</View>
	);

	//
}
