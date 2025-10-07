/* * */

import { StopSelection } from '@/components/selection/stop/StopSelection';
import { router } from 'expo-router';

/* * */

export function StopsList() {
	//

	//
	// A. Handle actions

	const handleSelect = (stopId: string) => {
		router.push(`/stops/${stopId}`);
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
