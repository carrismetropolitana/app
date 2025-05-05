/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { Routes } from '@/utils/routes';
import { Avatar } from '@rneui/themed';
import { Image } from 'react-native';

import { styles as useStyles } from './styles';

/* * */

interface ProfileImageProps {
	height?: number
	size?: number
	type: 'local' | 'url'
	width?: number
}

/* * */
export function ProfileImage({ height, size, type, width }: ProfileImageProps) {
	//

	//
	// A. Setup variables
	const styles = useStyles();
	const profileContext = useProfileContext();
	const profileImage = profileContext.data.profile?.profile?.profile_image && `${Routes.DEV_API_ACCOUNTS}/persona/` + profileContext.data.profile?.profile?.profile_image;
	const defaultImage = '@/assets/images/no-persona-image.png';

	// B. Render Components
	return (
		<>
			{type === 'url'
				? (
					<Avatar
						containerStyle={styles.avatarContainer}
						size={size}
						source={{ uri: profileImage || defaultImage }}
						rounded
					/>
				)
				: (
					<Image
						height={width}
						width={height}
						source={
							// eslint-disable-next-line
							require(defaultImage)
						}
					/>
				)}
		</>
	);

	//
}
