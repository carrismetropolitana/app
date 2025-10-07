/* * */

import { CloseButton } from '@/components/common/CloseButton';
import { StopSelection } from '@/components/selection/stop/StopSelection';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';

/* * */

export default function Page() {
	//

	//
	// A. Setup variables

	const navigation = useNavigation();
	const localSearchParams = useLocalSearchParams<{ return_to: string }>();

	//
	// B. Handle actions

	useEffect(() => {
		navigation.setOptions({
			headerRight: () => <CloseButton />,
			headerShown: true,
			headerTitle: 'teste',
			presentation: 'modal',
		});
	}, [navigation]);

	const handleSelect = (stopId: string) => {
		router.dismissTo({
			params: { stop_id: stopId },
			pathname: localSearchParams.return_to,
		});
	};

	//
	// C. Render components

	return (
		<StopSelection
			onSelect={handleSelect}
			addToRecentsOnPress
		/>
	);

	//
}
