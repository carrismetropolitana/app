/* * */

import { View, ViewStyle } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	style?: ViewStyle
}

/* * */

export function LiveIcon({ style }: Props) {
	//

	//
	const liveIconStyles = styles();

	//
	// B.Render components

	return (
		<View style={[liveIconStyles.container, style && style]}>
			<View style={liveIconStyles.ripple} />
			<View style={liveIconStyles.dot} />
		</View>
	);

	//
}
