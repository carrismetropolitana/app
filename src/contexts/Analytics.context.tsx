/* * */

import pjson from '@/package.json';
import * as Amplitude from '@amplitude/analytics-react-native';
import { createContext, useContext, useEffect } from 'react';

/* * */

const AMPLITUDE_API_KEY = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

interface AnalyticsContextState {
	actions: {
		capture: (eventName: string, eventProps?: Record<string, unknown>) => void
		setUserId: (userId: string) => void
		// setUserProperties: (props: Record<string, unknown>) => void
	}
}

/* * */

const AnalyticsContext = createContext<AnalyticsContextState | undefined>(undefined);

export function useAnalyticsContext() {
	const context = useContext(AnalyticsContext);
	if (!context) {
		throw new Error('useAnalyticsContext must be used within a AnalyticsContextProvider');
	}
	return context;
}

/* * */

export const AnalyticsContextProvider = ({ children }: { children: React.ReactNode }) => {
	//

	//
	// A. Setup variables

	// B. Transform Data

	useEffect(() => {
		Amplitude.init(AMPLITUDE_API_KEY || '', undefined, { disableCookies: true, serverZone: 'EU' });
	}, []);

	//
	// C. Handle Actions

	const getDefaultProps = () => ({
		app_version: pjson.version,
		event_date: new Date().toISOString(),
	});

	const capture = (eventName: string, eventProps: Record<string, unknown> = {}) => {
		Amplitude.track(eventName, { ...getDefaultProps(), ...eventProps });
	};

	const setUserId = (userId: string) => {
		Amplitude.setUserId(userId);
	};

	// const setUserProperties = (props: Record<string, unknown>) => {
	// 	const identifyObj = new Amplitude.Identify();
	// 	Object.entries(props).forEach(([key, value]) => {
	// 		identifyObj.set(key, value);
	// 	});
	// 	Amplitude.identify(identifyObj);
	// };

	//
	// D. Define Context Value

	const contextValue: AnalyticsContextState = {
		actions: {
			capture,
			setUserId,
			// setUserProperties,
		},
	};

	//
	// E. Render Components

	return (
		<AnalyticsContext.Provider value={contextValue}>
			{children}
		</AnalyticsContext.Provider>
	);

	//
};
