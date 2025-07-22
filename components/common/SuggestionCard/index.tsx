import { Surface } from '@/components/common/layout/Surface';
import { Text } from '@rn-vui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

export const SuggestionCard = () => {
	const { t } = useTranslation('translation', { keyPrefix: 'homepage.SuggestionCard' });
	const suggestionCardStyles = styles();
	return (
		<Surface>
			<View style={suggestionCardStyles.wrapper}>
				<Text style={suggestionCardStyles.headerEmoji}>✨</Text>
				<Text style={suggestionCardStyles.title}> {t('SuggestionCardTitle')} </Text>
				<Text style={suggestionCardStyles.description}>{t('SuggestionCardDescription')}</Text>
			</View>
		</Surface>
	);
};
