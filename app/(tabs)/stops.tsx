/* * */

import StopsScreen from '@/components/screens/StopsScreen';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

/* * */

export default function Stops() {
	//

	//
	// A. Render Components

	return (
		<StopsDetailContextProvider>
			<BottomSheetModalProvider>
				<StopsScreen />
			</BottomSheetModalProvider>
		</StopsDetailContextProvider>
	);

	//
}
