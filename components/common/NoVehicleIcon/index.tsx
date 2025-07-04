/* * */

import { View, ViewStyle } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	style?: ViewStyle
}

/* * */

export function NoVehicleIcon({ style }: Props) {
	//

	//
	const noVehicleIconStyles = styles();

	//
	// B.Render components

	return (
		<View style={[noVehicleIconStyles.container, style && style]}>
			<View style={noVehicleIconStyles.ripple} />
			<View style={noVehicleIconStyles.dot} />
		</View>
	);

	//
}
