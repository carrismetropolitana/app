/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useSystemVariables } from '@/theme/global';
import { IconCheck } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function MoreScreenLocaleSwitch() {
	//

	//
	// A. Setup variables

	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'more.MoreScreenLocaleSwitch' });

	//
	// B. Render components

	return (
		<View accessibilityHint={t('hint')} style={useStyles().container}>

			<TouchableOpacity
				disabled={localeContext.locale === 'en'}
				onPress={localeContext.actions.changeToEnglish}
				style={[useStyles().button, { opacity: localeContext.locale === 'en' ? 0.5 : 1 }]}
			>
				{localeContext.locale === 'en' && <IconCheck color={useSystemVariables().text[100]} />}
				<Text style={useStyles().buttonLabel}>
					{t('en')}
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				disabled={localeContext.locale === 'pt'}
				onPress={localeContext.actions.changeToPortuguese}
				style={[useStyles().button, { opacity: localeContext.locale === 'pt' ? 0.5 : 1 }]}
			>
				{localeContext.locale === 'pt' && <IconCheck color={useSystemVariables().text[100]} />}
				<Text style={useStyles().buttonLabel}>
					{t('pt')}
				</Text>
			</TouchableOpacity>

		</View>
	);

	//
}
