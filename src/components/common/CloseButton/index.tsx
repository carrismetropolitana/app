/* * */

import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native';

/* * */

interface CloseButtonProps {
	onPress?: () => void
}

/* * */

export function CloseButton({ onPress }: CloseButtonProps) {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	const { t } = useTranslation('translation', { keyPrefix: 'common.CloseButton' });

	//
	// B. Render components

	return (
		<Button
			onPress={onPress ?? (() => navigation.goBack())}
			title={t('title')}
		/>
	);

	//
}
