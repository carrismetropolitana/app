/* * */

import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import { useStyles } from './styles';

/* * */

export function MoreAppVersion() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const { t } = useTranslation('translation', { keyPrefix: 'MoreAppVersion' });

	//
	// B. Render components

	return (
		<Text aria-label={t('label')} style={styles.version}>
			{Constants.expoConfig?.version}
		</Text>
	);

	//
}
