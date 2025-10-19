/* * */

import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface WaypointHeaderProps {
	id: string
	location?: string
	name: string
	ttsName?: string
}

/* * */

export function WaypointHeader({ id, location, name, ttsName }: WaypointHeaderProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	//
	// B. Render components

	return (
		<View
			accessibilityLabel={ttsName}
			accessible={true}
			style={styles.container}
		>
			<Text style={styles.stopName}>{name}</Text>
			<Text style={styles.subHeader}>
				{location}
				<Text style={styles.divider}> • </Text>
				#{id}
			</Text>
		</View>
	);

	//
}
