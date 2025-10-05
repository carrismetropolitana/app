/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useSystemVariables } from '@/theme/global';
import { IconHeart, IconHeartFilled, IconHeartOff } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface FavoriteToggleProps {
	color?: string
	isActive: boolean | null
	onToggle: () => void
}

/* * */

export function FavoriteToggle({ color, isActive, onToggle }: FavoriteToggleProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const systemVariables = useSystemVariables();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'common.FavoriteToggle' });

	//
	// B. Handle actions

	const handleSetupAccount = () => {
		Alert.alert(
			t('alert.title'),
			t('alert.description'),
			[
				{
					style: 'cancel',
					text: t('alert.cancel') },
				{
					onPress: accountContext.actions.createAccount,
					text: t('alert.confirm'),
				},
			],
		);
	};

	const handleToggle = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		onToggle();
	};

	//
	// C. Render components

	if (accountContext.flags.anonymous) {
		return (
			<TouchableOpacity onPressIn={handleSetupAccount} style={styles.container}>
				<IconHeartOff color={systemVariables.text[400]} size={28} />
			</TouchableOpacity>
		);
	}

	if (isActive) {
		return (
			<TouchableOpacity onPressIn={handleToggle} style={styles.container}>
				<IconHeartFilled color={color} size={28} />
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity onPressIn={handleToggle} style={styles.container}>
			<IconHeart color={systemVariables.text[300]} size={28} />
		</TouchableOpacity>
	);

	//
}
