/* * */

import { View } from 'react-native';

import { loaderStyles } from './styles';

/* * */

export function Loader({ fixed = false, full = false, maxed = false, size = 30, visible = false }) {
	//

	//

	if (!visible) return <View />;

	// Setup spinner

	const Spinner = () => <View style={[loaderStyles.spinner, { borderWidth: size / 7, height: size, width: size }]} />;

	// If

	if (full) {
		return (
			<View style={loaderStyles.full}>
				<Spinner />
			</View>
		);
	}

	// If
	if (maxed) {
		return (
			<View style={loaderStyles.maxed}>
				<Spinner />
			</View>
		);
	}

	// If
	if (fixed) {
		return (
			<View style={loaderStyles.fixed}>
				<Spinner />
			</View>
		);
	}

	return <Spinner />;

	//
}
