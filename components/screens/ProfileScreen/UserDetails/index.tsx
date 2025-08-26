/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { Section } from '@/components/common/layout/Section';
import { ProfileImage } from '@/components/ProfileImage';
import { useProfileContext } from '@/contexts/Profile.context';
import { AccountWidget } from '@/types/account.types';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Button, Text } from '@rn-vui/themed';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
	const { accent_color: accentColor, profile } = profileContext.data;
	const { t } = useTranslation('translation', { keyPrefix: 'userdetails' });

	//
	// B. Render Components

	return (
		<>
			<View style={userDetailsStyles.userSection}>
				{profile?.profile?.profile_image ? (
					<ProfileImage
						key={accentColor}
						backgroundColor={accentColor ? dimAvatarBackground(accentColor) : 'rgba(253,183,26,0.4)'}
						borderWidth={10}
						color={accentColor || ''}
						size={200}
						type="url"
					/>
				) : (
					<ProfileImage height={200} type="local" width={200} />
				)}
				<Text style={userDetailsStyles.userFullNameText}>{profile?.profile?.first_name} {profile?.profile?.last_name}</Text>
				<Text style={[userDetailsStyles.userActivityText, { color: accentColor || '' }]}>{profile?.profile?.activity?.toUpperCase()}</Text>
				<Button buttonStyle={userDetailsStyles.button} containerStyle={userDetailsStyles.buttonContainer} onPress={() => router.push('/profileEdit')} title={t('editProfileButtonTitle')} titleStyle={userDetailsStyles.buttonTitle} />
			</View>
			<View style={userDetailsStyles.favoritesListSection}>
				<Section heading={t('personalizeWidgetsSectionTitle')} />
				{!widgetList.length && <NoDataLabel text={t('noWidgetsLabel')} fill />}
			</View>
		</>
	);

	//
};
