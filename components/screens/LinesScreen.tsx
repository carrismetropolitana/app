/* * */

import { VirtualizedListing } from '@/components/common/VitualizedList';
import { useLinesContext } from '@/contexts/Lines.context';
import { useThemeContext } from '@/contexts/Theme.context';
import { SafeAreaView } from 'react-native';

import { Surface } from '../common/layout/Surface';

/* * */
export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const themeContext = useThemeContext();
	const lines = linesContext.data.lines;

	//
	// C. Render components

	return (
		<SafeAreaView style={{ backgroundColor: themeContext.theme.mode === 'light' ? themeContext.theme.lightColors?.background : themeContext.theme.darkColors?.background, flex: 1 }}>
			<Surface>
				<VirtualizedListing data={lines} items={30} size="lg" variant="lines" />
			</Surface>
		</SafeAreaView>
	);

	//
}
