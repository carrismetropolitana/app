/* * */

import { LinesScreen } from '@/components/screens/LinesScreen';
import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { LinesListContextProvider } from '@/contexts/LinesList.context';

/* * */

export default function Page() {
	return (
		<LinesListContextProvider>
			<AlertsContextProvider>
				<LinesScreen />
			</AlertsContextProvider>
		</LinesListContextProvider>

	);
};
