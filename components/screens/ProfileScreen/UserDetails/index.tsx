/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { Account, AccountWidget } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Button, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import styles from './styles';

/* * */

interface Props {
	widgetList: AccountWidget[]
}

export const UserDetails = ({ widgetList }: Props) => {
	//

	//
	// A. Setup Variables

	const profileContext = useProfileContext();
	const userDetailsStyles = styles();
	const [profile, setProfile] = useState<Account | null>(null);
	const [accentColor, setAccentColor] = useState<null | string>(null);

	//
	// B. Handle Actions

	useEffect(() => {
		setProfile(profileContext.data.profile || null);
		setAccentColor(profileContext.data?.accent_color || null);
	}, [profileContext]);

	//
	// C. Render Components

	return (
		<>
			<View style={userDetailsStyles.userSection}>
				{profile?.profile?.profile_image ? (
					<ProfileImage backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4)'} borderWidth={10} color={accentColor || ''} size={200} type="url" />
				) : (
					<ProfileImage height={200} type="local" width={200} />
				)}
				<Text style={userDetailsStyles.userFullNameText}>{profile?.profile?.first_name} {profile?.profile?.last_name}</Text>
				<Button buttonStyle={userDetailsStyles.button} containerStyle={userDetailsStyles.buttonContainer} onPress={() => router.push('/profileEdit')} title="Editar Perfil" titleStyle={userDetailsStyles.buttonTitle} />
			</View>
			<View style={userDetailsStyles.favoritesListSection}>
				<Section heading="Personalizar widgets" />
				{!widgetList.length && <NoDataLabel text="Sem widgets" fill />}
			</View>
		</>
	);

	//
};
