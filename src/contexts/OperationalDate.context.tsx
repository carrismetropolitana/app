/* * */

import { Dates } from '@tmlmobilidade/dates';
import { type OperationalDateInt, validateOperationalDateInt } from '@tmlmobilidade/types';

import { useLocalSearchParams } from 'expo-router';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface OperationalDateContextState {
	actions: {
		updateSelectedDate: (value: OperationalDateInt) => void
		updateSelectedDateFromFormat: (value: string, format?: string) => void
		updateSelectedDateFromJsDate: (value: Date) => void
		updateSelectedDateToLessOneDay: () => void
		updateSelectedDateToPlusOneDay: () => void
		updateSelectedDateToToday: () => void
		updateSelectedDateToTomorrow: () => void
	}
	data: {
		selected_date: Dates | undefined
		selected_date_display: string | undefined
		today: Dates
		tomorrow: Dates
	}
	flags: {
		today: boolean
		tomorrow: boolean
	}
}

/* * */

const OperationalDateContext = createContext<OperationalDateContextState | undefined>(undefined);

export function useOperationalDateContext() {
	const context = useContext(OperationalDateContext);
	if (!context) {
		throw new Error('useOperationalDateContext must be used within a OperationalDateContextProvider');
	}
	return context;
}

/* * */

export const OperationalDateContextProvider = ({ children }: PropsWithChildren) => {
	//

	//
	// A. Setup variables

	const params = useLocalSearchParams();
	const initialDate: OperationalDateInt = typeof params.date === 'string' ? validateOperationalDateInt(params.date) : Dates.now('Europe/Lisbon').operational_date_int;
	const [selectedDateQuery, setSelectedDateQuery] = useState<OperationalDateInt>(initialDate);

	useEffect(() => {
		if (typeof params.date === 'string') {
			const queryDate = validateOperationalDateInt(params.date);
			if (queryDate !== selectedDateQuery) setSelectedDateQuery(queryDate);
		}
	}, [params.date, selectedDateQuery]);

	//
	// B. Transform data

	const todayDate = Dates.now('Europe/Lisbon');

	const tomorrowDate = Dates.now('Europe/Lisbon').plus({ days: 1 });

	const selectedDate = useMemo(() => {
		return Dates.fromOperationalDate(String(selectedDateQuery), 'Europe/Lisbon');
	}, [selectedDateQuery]);

	//
	// C. Handle actions

	const updateSelectedDate = (value: OperationalDateInt) => {
		setSelectedDateQuery(value);
	};

	const updateSelectedDateFromFormat = (value: string, format = 'yyyy-MM-dd') => {
		const dateValue = Dates
			.fromFormat(value, format, 'Europe/Lisbon')
			.set({ hour: 15 });
		setSelectedDateQuery(dateValue.operational_date_int);
	};

	const updateSelectedDateFromJsDate = (value: Date) => {
		const dateValue = Dates
			.fromJSDate(value)
			.set({ hour: 15 });
		setSelectedDateQuery(dateValue.operational_date_int);
	};

	const updateSelectedDateToToday = () => {
		setSelectedDateQuery(todayDate.operational_date_int);
	};

	const updateSelectedDateToTomorrow = () => {
		setSelectedDateQuery(tomorrowDate.operational_date_int);
	};

	const updateSelectedDateToPlusOneDay = () => {
		if (!selectedDate) return;
		const dateValue = selectedDate?.plus({ days: 1 });
		setSelectedDateQuery(dateValue.operational_date_int);
	};

	const updateSelectedDateToLessOneDay = () => {
		if (!selectedDate) return;
		const dateValue = selectedDate?.minus({ days: 1 });
		setSelectedDateQuery(dateValue.operational_date_int);
	};

	//
	// D. Define context value

	const contextValue: OperationalDateContextState = useMemo(() => ({
		actions: {
			updateSelectedDate,
			updateSelectedDateFromFormat,
			updateSelectedDateFromJsDate,
			updateSelectedDateToLessOneDay,
			updateSelectedDateToPlusOneDay,
			updateSelectedDateToToday,
			updateSelectedDateToTomorrow,
		},
		data: {
			selected_date: selectedDate,
			selected_date_display: selectedDate?.toFormat('d LLL'),
			today: todayDate,
			tomorrow: tomorrowDate,
		},
		flags: {
			today: selectedDate?.operational_date_int === todayDate.operational_date_int,
			tomorrow: selectedDate?.operational_date_int === tomorrowDate.operational_date_int,
		},
	}), [
		todayDate,
		tomorrowDate,
		selectedDate,
	]);

	//
	// E. Render components

	return (
		<OperationalDateContext.Provider value={contextValue}>
			{children}
		</OperationalDateContext.Provider>
	);

	//
};
