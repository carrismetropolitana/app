/* * */

import { UserPersona } from '@/components/profile/persona/UserPersona';
import { useProfileContext } from '@/contexts/Profile.context';
import { Button, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

export function ProfileViewPersona() {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const userDetailsStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'UserOverview' });

	//
	// B. Transform data

	const userDisplayName = useMemo(() => {
		// Return a friendly greeting if no name is set
		if (!profileContext?.data.profile?.profile?.first_name) return 'Olá 👋';
		// Return a personalized greeting otherwise
		return `Olá ${profileContext?.data.profile?.profile?.first_name}!`;
	}, [profileContext?.data.profile?.profile]);

	//
	// C. Render components

	return (
		<View style={userDetailsStyles.container}>
			<UserPersona size="lg" />
			<Text style={userDetailsStyles.displayName}>
				{userDisplayName}
			</Text>
			<Text style={[userDetailsStyles.activity, { color: profileContext.data.accent_color || '' }]}>
				{profileContext?.data.profile?.profile?.activity ?? t('default_activity')}
			</Text>
			<Button
				buttonStyle={userDetailsStyles.button}
				containerStyle={userDetailsStyles.buttonContainer}
				onPress={() => router.push('/profile/edit')}
				title={t('edit_profile')}
				titleStyle={userDetailsStyles.buttonTitle}
			/>
		</View>
	);

	//
};
