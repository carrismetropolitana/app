/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useSystemVariables } from '@/theme/global';
import { IconCheck } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function MoreLocaleSwitch() {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const localeContext = useLocaleContext();

	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreLocaleSwitch' });

	//
	// B. Render components

	return (
		<View accessibilityHint={t('hint')} style={styles.container}>

			<TouchableOpacity
				disabled={localeContext.locale === 'en'}
				onPress={localeContext.actions.changeToEnglish}
				style={[styles.button, { opacity: localeContext.locale === 'en' ? 0.5 : 1 }]}
			>
				{localeContext.locale === 'en' && <IconCheck color={systemVariables.text[100]} />}
				<Text style={styles.buttonLabel}>
					{t('en')}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				disabled={localeContext.locale === 'pt'}
				onPress={localeContext.actions.changeToPortuguese}
				style={[styles.button, { opacity: localeContext.locale === 'pt' ? 0.5 : 1 }]}
			>
				{localeContext.locale === 'pt' && <IconCheck color={systemVariables.text[100]} />}
				<Text style={styles.buttonLabel}>
					{t('pt')}
				</Text>
			</TouchableOpacity>

		</View>
	);

	//
}
