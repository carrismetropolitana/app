/* * */

import { PatternSelectionContextProvider } from '@/components/selection/pattern/context/PatternSelection.context';
import { PatternSelectionMain } from '@/components/selection/pattern/PatternSelectionMain';
import { type OperationalDate } from '@tmlmobilidade/types';

/* * */

export interface PatternSelectionProps {
	onSelect: (patternId: string) => void
	replaceChevron?: React.ReactNode
	selectedLineId?: string
	selectedOperationalDate?: OperationalDate
	selectedPatternId?: string
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function PatternSelection(props: PatternSelectionProps) {
	return (
		<PatternSelectionContextProvider
			selectedLineId={props.selectedLineId}
			selectedOperationalDate={props.selectedOperationalDate}
		>
			<PatternSelectionMain {...props} />
		</PatternSelectionContextProvider>
	);
}
