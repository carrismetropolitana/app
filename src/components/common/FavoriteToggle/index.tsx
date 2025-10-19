/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { useSystemVariables } from '@/theme/global';
import { IconHeart, IconHeartFilled, IconHeartOff } from '@tabler/icons-react-native';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, TouchableOpacity } from 'react-native';

import { useStyles } from './styles';

/* * */

interface FavoriteToggleProps {
	color?: string
	isActive?: boolean | null
	onToggle: (value: boolean) => void
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

	const [localState, setLocalState] = useState(isActive ? true : false);

	//
	// B. Handle actions

	useEffect(() => {
		// Update local state when isActive prop changes
		setLocalState(isActive ? true : false);
	}, [isActive]);

	useEffect(() => {
		// Notify parent component of state change
		// Local state is required otherwise the component
		// would be rerendered multiple times and cause issues with Accessibility.
		onToggle(localState);
	}, [localState]);

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
		setLocalState(prev => !prev);
	};

	//
	// C. Render components

	if (accountContext.flags.anonymous) {
		return (
			<TouchableOpacity
				accessibilityHint={t('anonymous.accessibility_hint')}
				accessibilityLabel={t('anonymous.accessibility_label')}
				accessibilityRole="togglebutton"
				onPressIn={handleSetupAccount}
				style={styles.container}
			>
				<IconHeartOff color={systemVariables.text[400]} size={28} />
			</TouchableOpacity>
		);
	}

	if (localState) {
		return (
			<TouchableOpacity
				accessibilityHint={t('enabled.accessibility_hint')}
				accessibilityLabel={t('enabled.accessibility_label')}
				accessibilityRole="togglebutton"
				accessibilityState={{ checked: true }}
				onPressIn={handleToggle}
				style={styles.container}
			>
				<IconHeartFilled color={color} size={28} />
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			accessibilityHint={t('disabled.accessibility_hint')}
			accessibilityLabel={t('disabled.accessibility_label')}
			accessibilityRole="togglebutton"
			accessibilityState={{ checked: false }}
			onPressIn={handleToggle}
			style={styles.container}
		>
			<IconHeart color={systemVariables.text[300]} size={28} />
		</TouchableOpacity>
	);

	//
}
