/* * */

import { type LineSelectionProps } from '@/components/selection/line/LineSelection';
import { LineSelectionMainList } from '@/components/selection/line/LineSelectionMainList';
import { LineSelectionMainToolbar } from '@/components/selection/line/LineSelectionMainToolbar';
import { useLineSelectionContext } from '@/components/selection/line/context/LineSelection.context';

/* * */

export function LineSelectionMain({ addToRecentsOnPress, onSelect, withSafeArea, withSearchAutoFocus, ...props }: LineSelectionProps) {
	//

	//
	// A. Setup variables

	const lineSelectionContext = useLineSelectionContext();

	//
	// B. Handle actions

	const handleSelect = (lineId: string) => {
		if (addToRecentsOnPress) lineSelectionContext.actions.addToRecent(lineId);
		if (onSelect) onSelect(lineId);
	};

	//
	// C. Render components

	return (
		<>
			<LineSelectionMainToolbar withSafeArea={withSafeArea} withSearchAutoFocus={withSearchAutoFocus} />
			<LineSelectionMainList onSelect={handleSelect} {...props} />
		</>
	);

	//
}
