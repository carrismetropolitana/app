/* * */

import { LinesSelectionListSections, type LinesSelectionListSectionsProps } from '@/components/lines/list/LinesSelectionListSections';
import { LinesListContextProvider } from '@/contexts/LinesList.context';

/* * */

export function LinesSelectionList(props: LinesSelectionListSectionsProps) {
	return (
		<LinesListContextProvider>
			<LinesSelectionListSections {...props} />
		</LinesListContextProvider>
	);
}
