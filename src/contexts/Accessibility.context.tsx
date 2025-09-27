/* * */

import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/* * */

interface AccessibilityContextState {
	flags: {
		screen_reader: boolean
	}
}

/* * */

const AccessibilityContext = createContext<AccessibilityContextState | undefined>(undefined);

export function useAccessibilityContext() {
	const context = useContext(AccessibilityContext);
	if (!context) {
		throw new Error('useAccessibilityContext must be used within a AccessibilityContextProvider');
	}
	return context;
}

/* * */

export const AccessibilityContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

	//
	// B. Handle actions

	useEffect(() => {
		const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', (state) => {
			setScreenReaderEnabled(state);
		});
		return () => subscription.remove();
	}, []);

	//
	// C. Define context value

	const contextValue: AccessibilityContextState = useMemo(() => ({
		flags: {
			screen_reader: screenReaderEnabled,
		},
	}), [screenReaderEnabled]);

	//
	// D. Render components

	return (
		<AccessibilityContext.Provider value={contextValue}>
			{children}
		</AccessibilityContext.Provider>
	);

	//
};
