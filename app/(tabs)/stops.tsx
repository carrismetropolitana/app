/* * */

import { StopsScreen } from '@/components/screens/StopsScreen';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { StopsListContextProvider } from '@/contexts/StopsList.context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

/* * */

export default function Page() {
	return (
		<StopsListContextProvider>
			<StopsDetailContextProvider>
				<BottomSheetModalProvider>
					<StopsScreen />
				</BottomSheetModalProvider>
			</StopsDetailContextProvider>
		</StopsListContextProvider>
	);
}
