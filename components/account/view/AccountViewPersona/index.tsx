/* * */

import { UserPersona } from '@/components/account/persona/UserPersona';
import { useAccountContext } from '@/contexts/Account.context';
import { Button, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewPersona() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation('translation', { keyPrefix: 'account.AccountViewPersona' });

	//
	// B. Transform data

	const userDisplayName = useMemo(() => {
		// Return a friendly greeting if no name is set
		if (!accountContext?.data.account?.profile?.first_name) return 'Olá 👋';
		// Return a personalized greeting otherwise
		return `Olá ${accountContext?.data.account?.profile?.first_name.trim()}!`;
	}, [accountContext?.data.account?.profile]);

	const activityDisplay = useMemo(() => {
		// Return the default label if no activity is set
		if (!accountContext?.data.account?.profile?.activity) return t('activity.default');
		// Return the chosen activity label otherwise
		return t(`activity.${accountContext?.data.account.profile.activity}`);
	}, [accountContext?.data.account?.profile]);

	const accentColor = useMemo(() => {
		// Return the default label if no accent color is set
		if (!accountContext?.data.account?.persona?.accent_color) return '#000000';
		// Return the chosen accent color otherwise
		return accountContext?.data.account?.persona?.accent_color;
	}, [accountContext?.data.account?.persona]);

	//
	// C. Render components

	return (
		<View style={styles.container}>
			<UserPersona size="lg" />
			<Text style={styles.displayName}>
				{userDisplayName}
			</Text>
			<Text style={[styles.activity, { color: accentColor }]}>
				{activityDisplay}
			</Text>
			<Button
				buttonStyle={styles.button}
				containerStyle={styles.buttonContainer}
				onPress={() => router.push('/account/profile')}
				title={t('edit_profile')}
				titleStyle={styles.buttonTitle}
			/>
			<Text>{accountContext?.data.account?._id}</Text>
		</View>
	);

	//
};
