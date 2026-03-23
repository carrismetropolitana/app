/* * */

import { StopSelection } from '@/components/selection/stop/StopSelection';
import { router } from 'expo-router';

/* * */

export function StopsList() {
	//

	//
	// A. Handle actions

	const handleSelect = (stopId: string) => {
		router.push(`/(tabs)/(stops)/(stop-modal)/${stopId}`);
	};

	//
	// B. Render components

	return (
		<StopSelection
			onSelect={handleSelect}
			addToRecentsOnPress
			withSafeArea
		/>
	);

	//
}
