/* * */

import { PatternSelectionContextProvider } from '@/components/selection/pattern/context/PatternSelection.context';
import { PatternSelectionMain } from '@/components/selection/pattern/PatternSelectionMain';

/* * */

export interface PatternSelectionProps {
	addToRecentsOnPress?: boolean
	onSelect: (lineId: string) => void
	replaceChevron?: React.ReactNode
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function PatternSelection(props: PatternSelectionProps) {
	return (
		<PatternSelectionContextProvider>
			<PatternSelectionMain {...props} />
		</PatternSelectionContextProvider>
	);
}
