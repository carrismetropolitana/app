/* * */

import { VirtualizedListing } from '@/components/common/VitualizedList';
import { useLinesContext } from '@/contexts/Lines.context';
import { SafeAreaView } from 'react-native';

/* * */
export default function LinesScreen() {
	//

	//
	// A. Setup variables

	const linesContext = useLinesContext();
	const lines = linesContext.data.lines;

	//
	// C. Render components

	return (
		<SafeAreaView>
			<VirtualizedListing data={lines} items={30} size="lg" variant="lines" />
		</SafeAreaView>
	);

	//
}
