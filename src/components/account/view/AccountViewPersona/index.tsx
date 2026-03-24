/* * */

import { UserPersona } from '@/components/account/persona/UserPersona';
import { useAccountContext } from '@/contexts/Account.context';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AccountViewPersona() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const accountContext = useAccountContext();

	const { t } = useTranslation();

	//
	// B. Transform data

	const userDisplayName = useMemo(() => {
		if (!accountContext?.data.account?.profile?.first_name) return 'Olá 👋';
		return `Olá ${accountContext?.data.account?.profile?.first_name.trim()}!`;
	}, [accountContext?.data.account?.profile]);

	const activityDisplay = useMemo(() => {
		if (!accountContext?.data.account?.profile?.activity) return t($ => $.account.AccountViewPersona.activity.default);
		return t($ => $.account.AccountViewPersona.activity[accountContext?.data.account?.profile?.activity || 'default']);
	}, [accountContext?.data.account?.profile?.activity, t]);

	const accentColor = useMemo(() => {
		if (!accountContext?.data.account?.persona?.accent_color) return '#000000';
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
			<TouchableOpacity onPress={() => router.push('/account/profile')}>
				<Text style={styles.button}>{t($ => $.account.AccountViewPersona.edit_profile)}</Text>
			</TouchableOpacity>
		</View>
	);

	//
};
