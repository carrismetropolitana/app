/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { use } from 'i18next';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';
/* * */

interface StopWidgetCardHeaderProps {
	municipality: string
	title: string
}

/* * */

export function StopWidgetCardHeader({ municipality, title }: StopWidgetCardHeaderProps) {
	//

	//
	// A. Setup variables

	const headerStyles = styles();
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'stopWidgetCard.stopWidgetCardHeader' });

	//
	// B. Render Components

	return (
		<View style={headerStyles.container}>
			<Text accessibilityHint={t('titleAccessibilityHint')} accessibilityLabel={t('titleAccessibilityLabel', { title })} accessibilityLanguage={localeContext.data.locale} style={headerStyles.headerTitle}>{title}</Text>
			<Text accessibilityHint={t('subtitleAccessibilityHint', { municipality })}accessibilityLabel={t('subtitleAccessibilityLabel', { municipality })} accessibilityLanguage={localeContext.data.locale} style={headerStyles.headerSubtitle}>{municipality}</Text>
		</View>
	);

	//
}
