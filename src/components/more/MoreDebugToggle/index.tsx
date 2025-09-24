/* * */

import { useDebugContext } from '@/contexts/Debug.context';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

export function MoreDebugToggle() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const debugContext = useDebugContext();

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreDebugToggle' });

	//
	// B. Render components

	return (
		<TouchableOpacity
			accessibilityHint={t('hint')}
			onPress={debugContext.actions.toggleDebugMode}
		>
			<Text style={styles.toggle}>
				{debugContext.flags.is_debug_mode ? `${t('active')}` : `${t('inactive')}`}
			</Text>
		</TouchableOpacity>
	);

	//
}
