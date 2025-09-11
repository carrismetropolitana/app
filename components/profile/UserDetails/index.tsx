/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/profile/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Button, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface UserDetailsProps {
	widgetList: AccountWidget[]
}

/* * */

export function UserDetails({ widgetList }: UserDetailsProps) {
	//

	//
	// A. Setup variables

	const profileContext = useProfileContext();
	const userDetailsStyles = styles();
	const { t } = useTranslation('translation', { keyPrefix: 'userdetails' });

	//
	// B. Render Components

	return (
		<>
			<View style={userDetailsStyles.userSection}>
				{profileContext?.data.profile?.profile?.profile_image ? (
					<ProfileImage
						backgroundColor={profileContext.data.accent_color ? dimAvatarBackground(profileContext.data.accent_color) : 'rgba(253,183,26,0.4)'}
						borderWidth={10}
						color={profileContext.data.accent_color}
						size={200}
						type="url"
					/>
				) : (
					<ProfileImage height={200} type="local" width={200} />
				)}
				<Text style={userDetailsStyles.userFullNameText}>{profileContext?.data.profile?.profile?.first_name} {profileContext?.data.profile?.profile?.last_name}</Text>
				<Text style={[userDetailsStyles.userActivityText, { color: profileContext.data.accent_color || '' }]}>{profileContext?.data.profile?.profile?.activity?.toUpperCase()}</Text>
				<Button buttonStyle={userDetailsStyles.button} containerStyle={userDetailsStyles.buttonContainer} onPress={() => router.push('/profile/edit')} title={t('editProfileButtonTitle')} titleStyle={userDetailsStyles.buttonTitle} />
			</View>
			<View style={userDetailsStyles.favoritesListSection}>
				<Section heading={t('personalizeWidgetsSectionTitle')} />
				{!widgetList.length && <NoDataLabel text={t('noWidgetsLabel')} fill />}
			</View>
		</>
	);

	//
};
