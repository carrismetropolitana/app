/* * */

import { StopsScreen } from '@/components/screens/StopsScreen';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { StopsListContextProvider } from '@/contexts/StopsList.context';

/* * */

export default function Page() {
	return (
		<StopsListContextProvider>
			<StopsDetailContextProvider>
				<StopsScreen />
			</StopsDetailContextProvider>
		</StopsListContextProvider>
	);
}
