/* * */

import { type PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';

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
		<ScrollView>
			<View style={styles.container}>
				{children}
			</View>
		</ScrollView>
	);

	//
}
