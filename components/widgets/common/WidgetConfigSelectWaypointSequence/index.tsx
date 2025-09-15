/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WidgetConfigSelectWaypointSequenceProps {
	sequence: number
}

/* * */

export function WidgetConfigSelectWaypointSequence({ sequence }: WidgetConfigSelectWaypointSequenceProps) {
	return (
		<View style={useStyles().container}>
			<Text style={useStyles().text}>{sequence}</Text>
		</View>
	);
}
