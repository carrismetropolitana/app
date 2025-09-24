/* * */

import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { LinesContextProvider } from '@/contexts/Lines.context';
import { LocationsContextProvider } from '@/contexts/Locations.context';
import { OperationalDateContextProvider } from '@/contexts/OperationalDate.context';
import { StopsContextProvider } from '@/contexts/Stops.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';
import { type PropsWithChildren } from 'react';

/* * */

export function DataProviders({ children }: PropsWithChildren) {
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
