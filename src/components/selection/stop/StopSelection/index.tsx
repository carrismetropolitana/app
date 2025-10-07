/* * */

import { StopSelectionContextProvider } from '@/components/selection/stop/context/StopSelection.context';
import { StopSelectionMain } from '@/components/selection/stop/StopSelectionMain';

/* * */

export interface StopSelectionProps {
	addToRecentsOnPress?: boolean
	onSelect: (stopId: string) => void
	replaceChevron?: React.ReactNode
	withSafeArea?: boolean
	withSearchAutoFocus?: boolean
}

/* * */

export function StopSelection(props: StopSelectionProps) {
	return (
		<StopSelectionContextProvider>
			<StopSelectionMain {...props} />
		</StopSelectionContextProvider>
	);
}
