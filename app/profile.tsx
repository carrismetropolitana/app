/* * */

import ProfileScreen from '@/components/screens/ProfileScreen';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Profile() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	useEffect(() => {
		navigation.setOptions({
			headerTitle: '',
			presentation: 'formSheet',
			sheetAllowedDetents: ['fitToContents', 'large'],
			sheetExpandsWhenScrolledToEdge: true,
			sheetGrabberVisible: true,
			sheetInitialDetentIndex: 0,
		});
	}, [navigation]);

	//
	// B. Render components

	return (
		<LinesDetailContextProvider>
			<StopsDetailContextProvider>
				<BottomSheetModalProvider>
					<ProfileScreen />
				</BottomSheetModalProvider>
			</StopsDetailContextProvider>
		</LinesDetailContextProvider>
	);

	//
}
