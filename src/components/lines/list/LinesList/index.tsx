/* * */

import { LineSelection } from '@/components/selection/line/LineSelection';
import { router } from 'expo-router';

/* * */

export function LinesList() {
	//

	//
	// A. Handle actions

	const handleSelect = (lineId: string) => {
		router.push(`/(modals)/(line-modal)/${lineId}`);
	};

	//
	// B. Render components

	return (
		<LineSelection
			onSelect={handleSelect}
			addToRecentsOnPress
			withSafeArea
		/>
	);

	//
}
