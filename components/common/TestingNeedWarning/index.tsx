import { useLocaleContext } from '@/contexts/Locale.context';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

export const TestingNeedWarning = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'TestingNeedWarning' });
	const localeContext = useLocaleContext();
	const testingNeedWarningStyles = styles();
	return (
		<View style={testingNeedWarningStyles.warningContainer}>
			<Text
				accessibilityHint={t('TestingNeedWarningTitleAccessibilityHint')}
				accessibilityLabel={t('TestingNeedWarningTitleAccessibilityLabel')}
				accessibilityLanguage={localeContext.locale}
				style={testingNeedWarningStyles.warningTitle}
			>{t('warningTitle')}
			</Text>
			<Text
				accessibilityHint={t('TestingNeedWarningTextAccessibilityHint')}
				accessibilityLabel={t('TestingNeedWarningTextAccessibilityLabel')}
				accessibilityLanguage={localeContext.locale}
				style={testingNeedWarningStyles.warningText}
			>{t('warningText')}
			</Text>
		</View>
	);
};
