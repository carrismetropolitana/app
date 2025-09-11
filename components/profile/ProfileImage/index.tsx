/* eslint-disable @typescript-eslint/no-require-imports */
/* * */

import { useLocaleContext } from '@/contexts/Locale.context';
import { useProfileContext } from '@/contexts/Profile.context';
import { theming } from '@/theme/Variables';
import { Routes } from '@/utils/routes';
import { Avatar } from '@rn-vui/themed';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';

import { styles } from './styles';

/* * */

interface ProfileImageProps {
	backgroundColor?: string
	borderWidth?: number
	color?: string
	height?: number
	size?: number
	type: 'local' | 'url'
	width?: number
}

/* * */
export function ProfileImage({ backgroundColor = theming.colorBrand, borderWidth = 3, color = theming.colorBrand, height = 50, size = 50, type, width = 50 }: ProfileImageProps) {
	//

	//
	// A. Setup variables

	const defaultImage = require('assets/images/no-persona-image.png');
	const profileContext = useProfileContext();
	const localeContext = useLocaleContext();
	const { t } = useTranslation('translation', { keyPrefix: 'profileImage' });
	const profileImageStyles = styles();
	const profileImage = useMemo(() => {
		return profileContext.data.profile?.profile?.profile_image ? `${Routes.API_ACCOUNTS}/persona/${profileContext.data.profile?.profile?.profile_image}` : defaultImage;
	}, [profileContext.data.profile?.profile?.profile_image]);
	const profileImageDescription = useMemo(() => {
		const raw = profileContext.data.profile?.profile?.profile_image;
		if (typeof raw === 'string' && raw.includes('|')) {
			const noExt = raw.replace(/\.[^|]+$/, '');
			return noExt.split('|').filter(Boolean).join(', ');
		}
	}, [profileContext.data.profile?.profile?.profile_image]);

	//
	// B. Render Components

	if (type === 'url' && typeof profileImage === 'string' && profileContext.data.profile?.profile?.profile_image?.trim().charAt(0) === 'b') {
		return (
			<View accessibilityHint={t('accessibilityHint', { profileImageDescription })} accessibilityLabel={t('accessibilityLabel')} accessibilityLanguage={localeContext.locale} accessibilityRole="image">
				<Avatar containerStyle={[profileImageStyles.avatarContainer, { backgroundColor: backgroundColor, borderColor: color, borderWidth: borderWidth }]} size={size} source={{ uri: profileImage || '' }} rounded />
			</View>
		);
	}
	return (
		<Image resizeMode="contain" source={defaultImage} style={{ height: height, width: width }} />
	);

	//
}
