/* * */

import { LinesSelectionListMain, type LinesSelectionListMainProps } from '@/components/lines/list/LinesSelectionListMain';
import { LinesListContextProvider } from '@/contexts/LinesList.context';

/* * */

export function LinesSelectionList(props: LinesSelectionListMainProps) {
	return (
		<LinesListContextProvider>
			<LinesSelectionListMain {...props} />
		</LinesListContextProvider>
	);
}
