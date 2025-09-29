/* * */

import { getCurrentPositionAsync, type LocationObject, requestForegroundPermissionsAsync } from 'expo-location';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface UserLocationContextState {
	actions: {
		requestPermission: () => Promise<void>
	}
	data: {
		location: LocationObject | null
	}
	flags: {
		enabled: boolean
		loading: boolean
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

	const [isInit, setIsInit] = useState<boolean>(true);

	const [permissionGrantedState, setPermissionGrantedState] = useState<boolean>(false);
	const [currentLocationState, setCurrentLocationState] = useState<LocationObject | null>(null);

	//
	// B. Handle actions

	useEffect(() => {
		// Update user location every 30 seconds
		const interval = setInterval(async function () {
			// Skip if not initialized
			if (!isInit) return;
			// Skip if permission not granted
			if (!permissionGrantedState) return;
			// Update current location
			const location = await getCurrentPositionAsync({ accuracy: 6 });
			setCurrentLocationState(location);
		}, 5_000);
		return () => clearInterval(interval);
	}, [permissionGrantedState]);

	async function requestPermission() {
		// Get current location permission
		const foregroundPermissions = await requestForegroundPermissionsAsync();
		// If not granted, set permission state and exit
		if (foregroundPermissions.status !== 'granted') {
			setPermissionGrantedState(false);
			setIsInit(true);
			return;
		}
		// If granted update states
		setPermissionGrantedState(true);
		setIsInit(true);
	}

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
			enabled: isInit && permissionGrantedState,
			loading: !isInit,
		},
	}), [
		isInit,
		currentLocationState,
		permissionGrantedState,
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
