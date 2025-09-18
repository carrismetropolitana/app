/* * */

import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { LinesContextProvider } from '@/contexts/Lines.context';
import { LocationsContextProvider } from '@/contexts/Locations.context';
import { OperationalDateContextProvider } from '@/contexts/OperationalDate.context';
import { StopsContextProvider } from '@/contexts/Stops.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';

/* * */

export function DataProviders({ children }: { children: React.ReactNode }) {
	return (
		<OperationalDateContextProvider>
			<LocationsContextProvider>
				<AlertsContextProvider>
					<StopsContextProvider>
						<LinesContextProvider>
							<VehiclesContextProvider>
								{children}
							</VehiclesContextProvider>
						</LinesContextProvider>
					</StopsContextProvider>
				</AlertsContextProvider>
			</LocationsContextProvider>
		</OperationalDateContextProvider>
	);
}
