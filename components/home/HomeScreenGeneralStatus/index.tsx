/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function HomeScreenGeneralStatus() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text>General Status Component</Text>
		</View>
	);

	//
}
