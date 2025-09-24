/* * */

import { useAccountContext } from '@/contexts/Account.context';
import { getServiceUrl } from '@/settings/service-urls';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

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

	const accountContext = useAccountContext();

	const [isLoading, setIsLoading] = useState(false);

	//
	// B. Transform data

	const imageUrl = useMemo(() => {
		if (!accountContext.data.account?.persona.image_id) return null;
		return `${getServiceUrl('accounts')}/personas/${accountContext.data.account.persona.image_id}`;
	}, [accountContext.data.account]);

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
	// C. Render Components

	if (imageUrl) {
		return (
			<View style={[styles.container, { borderColor: accentColor, borderWidth: borderWidth }]}>
				<View style={[styles.background, { backgroundColor: accentColor }]} />
				<Image
					fadeDuration={0}
					onLoadEnd={() => setIsLoading(false)}
					onLoadStart={() => setIsLoading(true)}
					resizeMode="contain"
					source={{ uri: imageUrl }}
					style={{ height: containerSize, width: containerSize }}
				/>
				{isLoading && <ActivityIndicator color={accentColor} size="large" style={styles.activityIndicator} />}
			</View>
		);
	}

	return (
		<Image
			resizeMode="contain"
			source={{ uri: 'images/no-persona-image' }}
			style={{ height: containerSize, width: containerSize }}
		/>
	);

	//
}
