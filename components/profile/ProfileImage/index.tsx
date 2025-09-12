/* eslint-disable @typescript-eslint/no-require-imports */
/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import dimAvatarBackground from '@/utils/dimAvatarBackground';
import { Routes } from '@/utils/routes';
import { Avatar } from '@rn-vui/themed';
import React, { useMemo } from 'react';
import { Image } from 'react-native';

import { styles } from './styles';

/* * */

interface ProfileImageProps {
	size: 'lg' | 'md'
}

/* * */

export function ProfileImage({ size = 'md' }: ProfileImageProps) {
	//

	//
	// A. Setup variables

	const defaultImage = require('assets/images/no-persona-image.png');
	const profileContext = useProfileContext();
	const profileImageStyles = styles();

	//
	// B. Transform data

	const imageUrl = useMemo(() => {
		if (!profileContext.data.profile?.profile?.profile_image) return null;
		return `${Routes.API_ACCOUNTS}/persona/${profileContext.data.profile?.profile?.profile_image}`;
	}, [profileContext.data.profile?.profile?.profile_image]);

	const accentColor = useMemo(() => {
		if (!profileContext.data.accent_color) return '#000000';
		return profileContext.data.accent_color;
	}, [profileContext.data.accent_color]);

	const dimmedAccentColor = useMemo(() => {
		if (!profileContext.data.accent_color) return '#000000';
		return dimAvatarBackground(profileContext.data.accent_color);
	}, [profileContext.data.accent_color]);

	const containerSize = useMemo(() => {
		if (size === 'lg') return 200;
		return 50;
	}, [size]);

	const borderWidth = useMemo(() => {
		if (size === 'lg') return 10;
		return 3;
	}, [size]);

	//
	// C. Render Components

	if (imageUrl) {
		return (
			<Avatar
				containerStyle={[profileImageStyles.avatarContainer, { backgroundColor: dimmedAccentColor, borderColor: accentColor, borderWidth: borderWidth }]}
				size={containerSize}
				source={{ uri: imageUrl }}
				rounded
			/>
		);
	}

	return (
		<Image
			resizeMode="contain"
			source={defaultImage}
			style={{ height: containerSize, width: containerSize }}
		/>
	);

	//
}
