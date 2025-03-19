/* * */

import { LinesDetail } from '@/components/lines/LinesDetail';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useLocalSearchParams } from 'expo-router';

/* * */

export default function Page() {
	const { line_id } = useLocalSearchParams<{ line_id: string }>();

	console.log('line_id', line_id);
	return (
		<LinesDetailContextProvider lineId={line_id}>
			<LinesDetail />
		</LinesDetailContextProvider>
	);
}
