/* eslint-disable @typescript-eslint/no-require-imports */

/* * */

import { type PropsWithChildren, useEffect, useState } from 'react';
import { Image, useColorScheme, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function AppSplashScreen({ children }: PropsWithChildren) {
	//

	//
	// A. Setup variables

	const styles = useStyles();
	const colorScheme = useColorScheme();

	const [isVisible, setIsVisible] = useState(false);

	//
	// B. Handle actions

	useEffect(() => {
		// Hide after 1.5 seconds
		const timeout = setTimeout(() => setIsVisible(false), 1_500);
		return () => clearTimeout(timeout);
	}, []);

	//
	// C. Render components

	if (isVisible) {
		return (
			<View style={styles.container}>
				{colorScheme === 'light'
					? <Image resizeMode="cover" source={require('#/app/splash-light.png')} style={styles.splashImage} />
					: <Image resizeMode="cover" source={require('#/app/splash-dark.png')} style={styles.splashImage} />}
				<View style={{ display: 'none' }}>{children}</View>
			</View>
		);
	}

	return children;

	//
}
