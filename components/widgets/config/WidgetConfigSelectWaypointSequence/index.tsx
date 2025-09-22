/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectWaypointSequenceProps {
	sequence: number
}

/* * */

export function WidgetConfigSelectWaypointSequence({ sequence }: WidgetConfigSelectWaypointSequenceProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View style={styles.container}>
			<Text style={styles.text}>{sequence}</Text>
		</View>
	);

	//
}
