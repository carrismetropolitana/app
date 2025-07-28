/* * */

import { useThemeContext } from '@/contexts/Theme.context';
import { theming } from '@/theme/Variables';
import { Text } from '@rn-vui/themed';
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
	const themeContext = useThemeContext();

	const fullString = `${text} ${quantity} ${type}`;
	const fontColor = themeContext.theme.mode === 'light' ? theming.colorSystemText300 : theming.colorSystemText400;

	//
	// B. Setup Variables

	return (
		<View>
			<Text style={{ color: fontColor, fontSize: 12 }}>{fullString}</Text>
		</View>
	);

	//
}
