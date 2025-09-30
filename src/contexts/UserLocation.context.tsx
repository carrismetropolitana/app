/* * */

import * as Location from 'expo-location';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface UserLocationContextState {
	actions: {
		requestPermission: () => Promise<Location.LocationPermissionResponse>
	}
	data: {
		location: Location.LocationObject | null
	}
	flags: {
		enabled: boolean
	}
}

/* * */

const UserLocationContext = createContext<undefined | UserLocationContextState>(undefined);

export function useUserLocationContext() {
	const context = useContext(UserLocationContext);
	if (!context) {
		throw new Error('useUserLocationContext must be used within a UserLocationContextProvider');
	}
	return context;
}

/* * */

export const UserLocationContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [permissionStatus, requestPermission] = Location.useForegroundPermissions();

	const [currentLocationState, setCurrentLocationState] = useState<Location.LocationObject | null>(null);

	//
	// B. Transform data

	const isPermissionGranted = useMemo(() => {
		if (!permissionStatus) return false;
		return permissionStatus.status === 'granted';
	}, [permissionStatus]);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no permission
		if (!isPermissionGranted) return;
		// Subscribe to location updates
		const options = {
			accuracy: Location.Accuracy.Balanced,
			distanceInterval: 10,
			timeInterval: 10_000,
		};
		// Setup the watcher
		const watch = Location.watchPositionAsync(options, location => setCurrentLocationState(location));
		// Cleanup the watcher
		return () => {
			watch.then(subscription => subscription.remove());
		};
	}, [isPermissionGranted]);

	//
	// D. Context value

	const contextValue: UserLocationContextState = useMemo(() => ({
		actions: {
			requestPermission,
		},
		data: {
			location: currentLocationState,
		},
		flags: {
			enabled: isPermissionGranted,
		},
	}), [
		isPermissionGranted,
		currentLocationState,
	]);

	//
	// E. Render components

	return (
		<UserLocationContext.Provider value={contextValue}>
			{children}
		</UserLocationContext.Provider>
	);

	//
};
