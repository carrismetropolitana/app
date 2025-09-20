/* * */

import { StopsScreen } from '@/components/screens/StopsScreen';
import { StopsDetailContextProvider } from '@/contexts/StopsDetail.context';
import { StopsListContextProvider } from '@/contexts/StopsList.context';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerShown: false,
			headerTitle: 'Stops',
		});
	}, [navigation]);

	//
	// C. Render components

	return (
		<StopsListContextProvider>
			<StopsDetailContextProvider>
				<StopsScreen />
			</StopsDetailContextProvider>
		</StopsListContextProvider>
	);

	//
}
