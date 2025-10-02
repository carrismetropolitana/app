/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { getServiceUrl } from '@/settings/service-urls';
import { useMemo } from 'react';
import { Image, useColorScheme, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export interface UserPersonaImageProps {
	size: 'lg' | 'md'
}

/* * */

export function UserPersonaImage({ size = 'md' }: UserPersonaImageProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const colorScheme = useColorScheme();

	const accountContext = useAccountContext();

	//
	// B. Transform data

	const imageUrl = useMemo(() => {
		if (!accountContext.data.account?.persona.image_id) return null;
		return `${getServiceUrl('accounts')}/personas/${accountContext.data.account.persona.image_id}`;
	}, [accountContext.data.account?.persona.image_id]);

	const accentColor = useMemo(() => {
		return accountContext.data.account?.persona.accent_color ?? '#FFDD00';
	}, [accountContext.data.account?.persona.accent_color]);

	const containerSize = useMemo(() => {
		if (size === 'lg') return 200;
		return 50;
	}, [size]);

	const borderWidth = useMemo(() => {
		if (size === 'lg') return 10;
		return 3;
	}, [size]);

	//
	// C. Render components

	if (imageUrl) {
		return (
			<View style={[styles.container, { borderColor: accentColor, borderWidth: borderWidth }]}>
				<View style={[styles.background, { backgroundColor: accentColor }]} />
				<Image
					fadeDuration={0}
					resizeMode="contain"
					source={{ uri: imageUrl }}
					style={{ height: containerSize, width: containerSize }}
				/>
			</View>
		);
	}

	return (
		<View style={[styles.container, { borderWidth: borderWidth }]}>
			{colorScheme === 'light'
				? <Image resizeMode="contain" source={require('#/persona/anonymous-light.png')} style={{ height: containerSize, width: containerSize }} />
				: <Image resizeMode="contain" source={require('#/persona/anonymous-dark.png')} style={{ height: containerSize, width: containerSize }} />}
		</View>
	);

	//
}
