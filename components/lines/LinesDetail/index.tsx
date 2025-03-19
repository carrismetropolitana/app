import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export function LinesDetail() {
	//
	// A. Setup variables
	// id comes form context
	//
	// B. Render component

	return (
		<SafeAreaProvider>
			<SafeAreaView>
				<Text>LINE ID: </Text>
			</SafeAreaView>
		</SafeAreaProvider>
	);

	//
}
