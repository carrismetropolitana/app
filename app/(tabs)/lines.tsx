/* * */

import LinesScreen from '@/components/screens/LinesScreen';
import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { LinesListContextProvider } from '@/contexts/LinesList.context';

/* * */
export default function Lines() {
	//

	//
	// A . Render components

	return (

		<LinesListContextProvider>
			<AlertsContextProvider>
				<LinesScreen />
			</AlertsContextProvider>
		</LinesListContextProvider>

	);

	//
};
