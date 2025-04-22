/* * */

import LinesScreen from '@/components/screens/LinesScreen';
import { LinesListContextProvider } from '@/contexts/LinesList.context';

/* * */
export default function Lines() {
	//

	//
	// A . Render components

	return (
		<LinesListContextProvider>
			<LinesScreen />
		</LinesListContextProvider>
	);

	//
};
