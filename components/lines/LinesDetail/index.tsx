import { LinesDetailAlerts } from '@/components/lines/LinesDetailAlerts';
import { LinesDetailHeader } from '@/components/lines/LinesDetailHeader';
import { LinesDetailMetrics } from '@/components/lines/LinesDetailMetrics';
import { useThemeContext } from '@/contexts/Theme.context';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LinesDetail() {
	//

	//
	// A. Setup variables

	const themeContext = useThemeContext();

	//
	// B. Render component

	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<ScrollView>
				<LinesDetailHeader />
			</ScrollView>
		</SafeAreaView>

	);

	//
}

{ /* <LinesDetailAlerts />
<LinesDetailMetrics /> */ }
