/* * */

import { usePatternSelectionContext } from '@/components/selection/pattern/context/PatternSelection.context';
import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { PatternSelectionMainList } from '@/components/selection/pattern/PatternSelectionMainList';
import { PatternSelectionMainToolbar } from '@/components/selection/pattern/PatternSelectionMainToolbar';

/* * */

export function PatternSelectionMain({ addToRecentsOnPress, onSelect, withSafeArea, withSearchAutoFocus, ...props }: PatternSelectionProps) {
	//

	//
	// A. Setup variables

	const patternSelectionContext = usePatternSelectionContext();

	//
	// B. Handle actions

	const handleSelect = (lineId: string) => {
		if (addToRecentsOnPress) patternSelectionContext.actions.addToRecent(lineId);
		if (onSelect) onSelect(lineId);
	};

	//
	// C. Render components

	return (
		<>
			<PatternSelectionMainToolbar withSafeArea={withSafeArea} withSearchAutoFocus={withSearchAutoFocus} />
			<PatternSelectionMainList onSelect={handleSelect} {...props} />
		</>
	);

	//
}
