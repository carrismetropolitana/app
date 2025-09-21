/* * */

import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';

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
		<KeyboardAvoidingView behavior="position">
			<ScrollView>
				<View style={styles.container}>
					{children}
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);

	//
}
