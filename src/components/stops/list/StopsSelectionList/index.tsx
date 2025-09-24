/* * */

import { StopsSelectionListMain, type StopsSelectionListMainProps } from '@/components/stops/list/StopsSelectionListMain';
import { StopsListContextProvider } from '@/contexts/StopsList.context';

/* * */

export function StopsSelectionList(props: StopsSelectionListMainProps) {
	return (
		<StopsListContextProvider>
			<StopsSelectionListMain {...props} />
		</StopsListContextProvider>
	);
}
