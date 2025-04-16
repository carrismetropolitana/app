/* * */

import { Text } from '@rneui/themed';
import { View } from 'react-native';
/* * */

interface StopWidgetCardHeaderProps {
	municipality: string
	title: string
}

/* * */

export function StopWidgetCardHeader({ municipality, title }: StopWidgetCardHeaderProps) {
	//

	//
	// A. Setup variables

	// B. Render Components

	return (
		<View>
			<Text>{title}</Text>
			<Text>{municipality}</Text>
		</View>
	);

	//
}
