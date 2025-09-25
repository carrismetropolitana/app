/* * */

import { StopsSelection } from '@/components/stops/selection/StopsSelection';
import { type Stop } from '@carrismetropolitana/api-types/network';
import { router } from 'expo-router';

/* * */

export function StopsList() {
	//

	//
	// A. Handle actions

	const handlePress = (item: Stop) => {
		router.push(`/stops/${item.id}`);
	};

	//
	// B. Render components

	return (
		<StopsSelection
			onPress={handlePress}
			addToRecentsOnPress
			withSafeArea
		/>
	);

	//
}
