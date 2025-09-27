/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectWaypointBadgeProps {
	sequence: number
}

/* * */

export function WidgetConfigSelectWaypointBadge({ sequence }: WidgetConfigSelectWaypointBadgeProps) {
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
