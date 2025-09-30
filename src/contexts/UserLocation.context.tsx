/* * */

import * as Location from 'expo-location';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface UserLocationContextState {
	actions: {
		requestPermission: () => Promise<void>
	}
	data: {
		location: Location.LocationObject | null
	}
	flags: {
		can_request: boolean
		has_permission: boolean
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

	const [canRequest, setCanRequest] = useState(false);
	const [hasPermission, setHasPermission] = useState(false);
	const [currentLocationState, setCurrentLocationState] = useState<Location.LocationObject | null>(null);

	//
	// B. Handle actions

	const requestPermission = async () => {
		const response = await Location.requestForegroundPermissionsAsync();
		setCanRequest(response.canAskAgain);
		setHasPermission(response.granted);
	};

	const checkPermissionStatus = async () => {
		const response = await Location.getForegroundPermissionsAsync();
		setCanRequest(response.canAskAgain);
		setHasPermission(response.granted);
	};

	useEffect(() => {
		checkPermissionStatus();
		const interval = setInterval(checkPermissionStatus, 10_000);
		return () => clearInterval(interval);
	}, []);

	//
	// C. Handle actions

	useEffect(() => {
		// Skip if no permission
		if (!hasPermission) return;
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
	}, [hasPermission]);

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
			can_request: canRequest,
			has_permission: hasPermission,
		},
	}), [
		canRequest,
		hasPermission,
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
