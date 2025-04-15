/* * */

import { Text } from '@rneui/themed';
import { View } from 'react-native';

/* * */

interface Props {
	quantity: number
	text: string
	type: string
}

/* * */
export default function Counter({ quantity, text, type }: Props) {
	//

	//

	// A. Setup Styles

	const fullString = `${text} ${quantity} ${type}`;

	//
	// B. Setup Variables

	return (
		<View>
			<Text>{fullString}</Text>
		</View>
	);

	//
}
