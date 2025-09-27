/* * */

import { AlertsContextProvider } from '@/contexts/Alerts.context';
import { DebugContextProvider } from '@/contexts/Debug.context';
import { LinesContextProvider } from '@/contexts/Lines.context';
import { LocationsContextProvider } from '@/contexts/Locations.context';
import { OperationalDateContextProvider } from '@/contexts/OperationalDate.context';
import { StopsContextProvider } from '@/contexts/Stops.context';
import { VehiclesContextProvider } from '@/contexts/Vehicles.context';
import { type PropsWithChildren } from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

/* * */

export function DataProviders({ children }: PropsWithChildren) {
	//

	//
	// A. Setup variables

	const swrSettings: SWRConfiguration = {
		async fetcher(...args: Parameters<typeof fetch>) {
			const res = await fetch(...args);
			if (!res.ok) {
				const errorDetails = await res.json();
				const error = new Error(errorDetails.message || 'An error occurred while fetching data.');
				const customError = {
					...error,
					description: errorDetails.description || 'No additional information was provided by the API.',
					status: res.status,
				};
				throw customError;
			}
			return res.json();
		},
		refreshInterval: 900_000,
		revalidateOnFocus: true,
		revalidateOnMount: true,
	};

	//
	// B. Render components

	return (
		<SWRConfig value={swrSettings}>
			<DebugContextProvider>
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
			</DebugContextProvider>
		</SWRConfig>
	);

	//
}
