import { LinesDetailAlerts } from '@/components/lines/LinesDetailAlerts';
import { LinesDetailHeader } from '@/components/lines/LinesDetailHeader';
import { LinesDetailMetrics } from '@/components/lines/LinesDetailMetrics';
import { SafeAreaView } from 'react-native-safe-area-context';

export function LinesDetail() {
	//

	//
	// A. Render component

	return (
		<SafeAreaView>
			<LinesDetailHeader />
			{/* <LinesDetailAlerts />
			<LinesDetailMetrics /> */}
		</SafeAreaView>

	);

	//
}
