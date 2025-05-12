/* * */

import React from 'react';
import { Image, Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export default function OfflineScreen() {
	//

	//
	// A. Render Components

	return (
		<View style={styles.container}>
			<Image
				resizeMode="contain"
				// eslint-disable-next-line @typescript-eslint/no-require-imports
				source={require('../../assets/images/adaptive-icon.png')}
				style={styles.image}
			/>
			<Text style={styles.title}>You’re Offline</Text>
			<Text style={styles.subtitle}>
				Check your internet connection and try again.
			</Text>
		</View>
	);

	//
}
