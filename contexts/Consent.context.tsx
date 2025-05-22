/* * */

// import { expireAllCookies } from '@/utils/expire-all-cookies.util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import { createContext, useContext, useEffect, useState } from 'react';
/* * */

const DECISION_EXPIRATION_IN_DAYS_YES = 365;
const DECISION_EXPIRATION_IN_DAYS_NO = 10;

const ASYNC_STORAGE_KEYS = {
	decision_date: 'consent|decision_date',
	enabled_analytics: 'consent|enabled_analytics',
	enabled_functional: 'consent|enabled_functional',
};

/* * */

type AvailableConsentOption = 'analytics' | 'functional';

/* * */

interface ConsentContextState {
	actions: {
		ask: () => void
		disable: (options: AvailableConsentOption[]) => void
		enable: (options: AvailableConsentOption[]) => void
		reset: () => void
	}
	data: {
		ask_for_consent: boolean
		enabled_analytics: boolean
		enabled_functional: boolean
		init_status: boolean
	}
}

/* * */

const ConsentContext = createContext<ConsentContextState | undefined>(undefined);

export function useConsentContext() {
	const context = useContext(ConsentContext);
	if (!context) {
		throw new Error('useConsentContext must be used within a ConsentContextProvider');
	}
	return context;
}

/* * */

export const ConsentContextProvider = ({ children }) => {
	//

	//
	// A. Setup variables

	const [dataEnabledAnalyticsState, setDataEnabledAnalyticsState] = useState<ConsentContextState['data']['enabled_analytics']>(false);
	const [dataEnabledFunctionalState, setDataEnabledFunctionalState] = useState<ConsentContextState['data']['enabled_functional']>(false);

	const [consentSystemInitStatus, setConsentSystemInitStatus] = useState<boolean>(false);
	const [asyncStorageDecisionDateValue, setAsyncStorageDecisionDateValue] = useState<null | string>(null);
	const [asyncStorageEnabledAnalyticsValue, setAsyncStorageEnabledAnalyticsValue] = useState<null | string>(null);
	const [asyncStorageEnabledFunctionalValue, setAsyncStorageEnabledFunctionalValue] = useState<null | string>(null);

	const [askForConsent, setAskForConsent] = useState<boolean>(false);

	//
	// B. Fetch data

	useEffect(() => {
		// Get previously stored decision values from async storage
		// on a regular interval to accomodate changes made in other tabs.
		const interval = setInterval(async () => {
			if (typeof AsyncStorage === 'undefined') return;
			const decisionDate = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.decision_date);
			const enabledAnalytics = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.enabled_analytics);
			const enabledFunctional = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.enabled_functional);
			setAsyncStorageDecisionDateValue(decisionDate);
			setAsyncStorageEnabledAnalyticsValue(enabledAnalytics);
			setAsyncStorageEnabledFunctionalValue(enabledFunctional);
			setConsentSystemInitStatus(true);
		}, 1000);
		return () => clearInterval(interval);
	});

	useEffect(() => {
		//

		//
		// Ensure the consent system has been initialized
		// before proceeding with the consent validation.

		if (!consentSystemInitStatus) return;

		//
		// In order to validate proper consent,
		// we need to perform a series of checks to each stored value.
		// If any of the checks fail, we reset the consent state.
		// First check if any of the stored values are missing.

		if (!asyncStorageDecisionDateValue || !asyncStorageEnabledAnalyticsValue || !asyncStorageEnabledFunctionalValue) {
			reset();
			return;
		}

		if (asyncStorageEnabledAnalyticsValue !== 'yes' && asyncStorageEnabledAnalyticsValue !== 'no') {
			reset();
			return;
		}

		if (asyncStorageEnabledFunctionalValue !== 'yes' && asyncStorageEnabledFunctionalValue !== 'no') {
			reset();
			return;
		}

		//
		// Next, check if the stored date is in a valid format.

		const decisionDateData = DateTime.fromFormat(asyncStorageDecisionDateValue, 'yyyyMMdd');

		if (!decisionDateData.isValid) {
			reset();
			return;
		}

		//
		// Next, check if the stored decision date has not expired.

		const daysSinceLastDecision = DateTime.now().diff(decisionDateData, 'days');

		const yesDecisionIsExpired = daysSinceLastDecision.days > DECISION_EXPIRATION_IN_DAYS_YES;
		if ((asyncStorageEnabledAnalyticsValue === 'yes' && yesDecisionIsExpired) || (asyncStorageEnabledFunctionalValue === 'yes' && yesDecisionIsExpired)) {
			reset();
			return;
		}

		const noDecisionIsExpired = daysSinceLastDecision.days > DECISION_EXPIRATION_IN_DAYS_NO;
		if ((asyncStorageEnabledAnalyticsValue === 'no' && noDecisionIsExpired) || (asyncStorageEnabledFunctionalValue === 'no' && noDecisionIsExpired)) {
			reset();
			return;
		}

		//
		// Finally, set the local state.

		setDataEnabledAnalyticsState(asyncStorageEnabledAnalyticsValue === 'yes');
		setDataEnabledFunctionalState(asyncStorageEnabledFunctionalValue === 'yes');
		setAskForConsent(false);

		//
	}, [consentSystemInitStatus, asyncStorageDecisionDateValue, asyncStorageEnabledAnalyticsValue, asyncStorageEnabledFunctionalValue]);

	//
	// C. Handle actions

	const ask = () => {
		setAskForConsent(true);
	};

	const disable = (options: AvailableConsentOption[]) => {
		AsyncStorage.setItem(ASYNC_STORAGE_KEYS.decision_date, DateTime.now().toFormat('yyyyMMdd'));
		if (options.includes('analytics')) AsyncStorage.setItem(ASYNC_STORAGE_KEYS.enabled_analytics, 'no');
		if (options.includes('functional')) AsyncStorage.setItem(ASYNC_STORAGE_KEYS.enabled_functional, 'no');
	};

	const enable = (options: AvailableConsentOption[]) => {

		AsyncStorage.setItem(ASYNC_STORAGE_KEYS.decision_date, DateTime.now().toFormat('yyyyMMdd'));

		console.log(ASYNC_STORAGE_KEYS.decision_date, DateTime.now().toFormat('yyyyMMdd'));
		if (options.includes('analytics')) AsyncStorage.setItem(ASYNC_STORAGE_KEYS.enabled_analytics, 'yes');
		if (options.includes('functional')) AsyncStorage.setItem(ASYNC_STORAGE_KEYS.enabled_functional, 'yes');
	};

	const reset = () => {
		// Clear local storage
		AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.decision_date);
		AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.enabled_analytics);
		AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.enabled_functional);
		// Clear cookies
		// expireAllCookies();
		// Reset local state
		setAskForConsent(true);
	};

	//
	// D. Define context value

	const contextValue: ConsentContextState = {
		actions: {
			ask,
			disable,
			enable,
			reset,
		},
		data: {
			ask_for_consent: askForConsent,
			enabled_analytics: dataEnabledAnalyticsState,
			enabled_functional: dataEnabledFunctionalState,
			init_status: consentSystemInitStatus,
		},
	};

	//
	// E. Render components

	return (
		<ConsentContext.Provider value={contextValue}>
			{children}
		</ConsentContext.Provider>
	);

	//
};
