/* * */

import { useProfileContext } from '@/contexts/Profile.context';
import { Routes } from '@/utils/routes';
import { useMemo } from 'react';
import { Image, View } from 'react-native';

import { styles } from './styles';

/* * */

export interface UserPersonaImageProps {
	size: 'lg' | 'md'
}

/* * */

export function UserPersonaImage({ size = 'md' }: UserPersonaImageProps) {
	//

	//
	// A. Setup variables

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

	if (!imageUrl) {
		return (
			<View style={[profileImageStyles.container, { borderColor: accentColor, borderWidth: borderWidth }]}>
				<View style={[profileImageStyles.background, { backgroundColor: accentColor }]} />
				<Image
					resizeMode="contain"
					source={{ uri: imageUrl }}
					style={{ height: containerSize, width: containerSize }}
				/>
			</View>
		);
	}

	return (
		<Image
			resizeMode="contain"
			source={{ uri: '/images/no-persona-image' }}
			style={{ height: containerSize, width: containerSize }}
		/>
	);

	//
}
