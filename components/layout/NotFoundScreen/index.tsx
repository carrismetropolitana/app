/* * */

import { Link, usePathname } from 'expo-router';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

export function NotFoundScreen() {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const pathname = usePathname();

	//
	// B. Render Components

	return (
		<View style={styles.container}>
			<Text>This screen doesn't exist.</Text>
			<Text>{pathname}</Text>
			<Link href="/" style={styles.link}>
				<Text>Go to home screen!</Text>
			</Link>
		</View>
	);

	//
}
