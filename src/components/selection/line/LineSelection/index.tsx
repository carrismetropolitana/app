/* * */

import { LineSelectionMain } from '@/components/selection/line/LineSelectionMain';
import { LineSelectionContextProvider } from '@/components/selection/line/context/LineSelection.context';

/* * */

export interface LineSelectionProps {
	addToRecentsOnPress?: boolean
	onSelect: (lineId: string) => void
	replaceChevron?: React.ReactNode
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function LineSelection(props: LineSelectionProps) {
	return (
		<LineSelectionContextProvider>
			<LineSelectionMain {...props} />
		</LineSelectionContextProvider>
	);
}
