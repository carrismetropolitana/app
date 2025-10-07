/* * */

import { type PatternSelectionProps } from '@/components/selection/pattern/PatternSelection';
import { PatternSelectionMainList } from '@/components/selection/pattern/PatternSelectionMainList';

/* * */

export function PatternSelectionMain({ onSelect, ...props }: PatternSelectionProps) {
	//

	//
	// A. Handle actions

	const handleSelect = (patternId: string) => {
		if (onSelect) onSelect(patternId);
	};

	//
	// B. Render components

	return <PatternSelectionMainList onSelect={handleSelect} {...props} />;

	//
}
