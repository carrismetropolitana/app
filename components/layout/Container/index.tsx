/* * */

import { type PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from './styles';

/* * */

export function Container({ children }: PropsWithChildren) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<SafeAreaView style={styles.safeArea}>
			<ScrollView>
				<View style={styles.container}>
					{children}
				</View>
			</ScrollView>
		</SafeAreaView>
	);

	//
}
