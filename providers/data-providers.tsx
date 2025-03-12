

/* * */

import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { LinesContextProvider } from '@/contexts/Lines.context';
import { LocationsContextProvider } from '@/contexts/Locations.context';
//import { OperationalDayContextProvider } from '@/contexts/OperationalDay.context';
//import { StopsContextProvider } from '@/contexts/Stops.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';

/* * */

export function DataProviders({ children }) {
	return (
		// <OperationalDayContextProvider>
			<LocationsContextProvider>
				<AlertsContextProvider>
					{/* <StopsContextProvider> */}
						<LinesContextProvider>
							<VehiclesContextProvider>
								{children}
							</VehiclesContextProvider>
						</LinesContextProvider>
					{/* </StopsContextProvider> */}
				</AlertsContextProvider>
			</LocationsContextProvider>
		// </OperationalDayContextProvider>
	);
}
