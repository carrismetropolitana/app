/* * */

import { Text } from '@rneui/themed';
import { View } from 'react-native';

import { styles } from './styles';
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
	const headerStyles = styles();
	//
	// B. Render Components

	return (
		<View style={headerStyles.container}>
			<Text style={headerStyles.headerTitle}>{title}</Text>
			<Text style={headerStyles.headerSubtitle}>{municipality}</Text>
		</View>
	);

	//
}
