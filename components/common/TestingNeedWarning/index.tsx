import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

export const TestingNeedWarning = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'TestingNeedWarning' });
	const testingNeedWarningStyles = styles();
	return (
		<View style={testingNeedWarningStyles.warningContainer}>
			<Text style={testingNeedWarningStyles.warningTitle}>{t('warningTitle')}</Text>
			<Text style={testingNeedWarningStyles.warningText}>{t('warningText')}</Text>
		</View>
	);
};
