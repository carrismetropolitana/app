import { LinesDetailHeader } from '@/components/lines/LinesDetailHeader';
import { LinesDetailPath } from '@/components/lines/LinesDetailPath';
import { useThemeContext } from '@/contexts/Theme.context';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export function LinesDetail() {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();

	//
	// B. Render component

	return (
		<ScrollView>
			<View style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background }}>
				<LinesDetailHeader />
				<LinesDetailPath />
			</View>
		</ScrollView>

	);

	//
}
