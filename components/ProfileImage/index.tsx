/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Avatar } from '@rn-vui/themed';
import React, { useMemo } from 'react';
import { Image } from 'react-native';

import { styles } from './styles';

/* * */

interface ProfileImageProps {
	borderWidth?: number
	color?: string
	backgroundColor?: string
	height?: number
	size?: number
	type: 'local' | 'url'
	width?: number
}

/* * */
export function ProfileImage({ borderWidth = 3, color = theming.colorBrand, height = 50, size = 50, type, width = 50, backgroundColor = theming.colorBrand }: ProfileImageProps) {
	//

	//
	// A. Setup variables

	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const defaultImage = require('assets/images/no-persona-image.png');
	const profileContext = useProfileContext();
	const profileImageStyles = styles();
	const profileImage = useMemo(() => {
		return profileContext.data.profile?.profile?.profile_image ? `${Routes.DEV_API_ACCOUNTS}/persona/${profileContext.data.profile?.profile?.profile_image}` : defaultImage;
	}, [profileContext.data.profile?.profile?.profile_image]);

	//
	// B. Render Components

	if (type === 'url' && typeof profileImage === 'string' && profileContext.data.profile?.profile?.profile_image?.trim().charAt(0) === 'b') {
		return  <Avatar containerStyle={[profileImageStyles.avatarContainer, { borderColor: color, borderWidth: borderWidth , backgroundColor: backgroundColor}]} size={size} source={{ uri: profileImage || '' }} rounded />
	}
	return (
		<Image resizeMode="contain" source={defaultImage} style={{width: width, height: height}} />
	);

	//
}
