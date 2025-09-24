/* * */

import { Dates } from '@/core-replica/dates';
import { type OperationalDate } from '@/types/operational-date';
import { useLocalSearchParams } from 'expo-router';
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface OperationalDateContextState {
	actions: {
		updateSelectedDate: (value: OperationalDate) => void
		updateSelectedDateFromFormat: (value: string, format?: string) => void
		updateSelectedDateFromJsDate: (value: Date) => void
		updateSelectedDateToLessOneDay: () => void
		updateSelectedDateToPlusOneDay: () => void
		updateSelectedDateToToday: () => void
		updateSelectedDateToTomorrow: () => void
	}
	data: {
		selected_date: Dates | null
		today: Dates
		tomorrow: Dates
	}
	flags: {
		is_today_selected: boolean
		is_tomorrow_selected: boolean
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
	const initialDate = typeof params.date === 'string' ? params.date : Dates.now('Europe/Lisbon').operational_date;
	const [selectedDateQuery, setSelectedDateQuery] = useState<string>(initialDate);

	useEffect(() => {
		if (typeof params.date === 'string' && params.date !== selectedDateQuery) {
			setSelectedDateQuery(params.date);
		}
	}, [params.date]);

	//
	// B. Transform data

	const todayDate = Dates
		.now('Europe/Lisbon');

	const tomorrowDate = Dates
		.now('Europe/Lisbon')
		.plus({ days: 1 });

	const selectedDate = useMemo(() => {
		return Dates.fromOperationalDate(selectedDateQuery, 'Europe/Lisbon');
	}, [selectedDateQuery]);

	//
	// C. Handle actions

	const updateSelectedDate = (value: string) => {
		const dateValue = Dates
			.fromOperationalDate(value, 'Europe/Lisbon')
			.set({ hour: 15 });
		setSelectedDateQuery(dateValue.operational_date);
	};

	const updateSelectedDateFromFormat = (value: string, format = 'yyyy-MM-dd') => {
		const dateValue = Dates
			.fromFormat(value, format, 'Europe/Lisbon')
			.set({ hour: 15 });
		setSelectedDateQuery(dateValue.operational_date);
	};

	const updateSelectedDateFromJsDate = (value: Date) => {
		const dateValue = Dates
			.fromJSDate(value)
			.set({ hour: 15 });
		setSelectedDateQuery(dateValue.operational_date);
	};

	const updateSelectedDateToToday = () => {
		setSelectedDateQuery(todayDate.operational_date);
	};

	const updateSelectedDateToTomorrow = () => {
		setSelectedDateQuery(tomorrowDate.operational_date);
	};

	const updateSelectedDateToPlusOneDay = () => {
		if (!selectedDate) return;
		const dateValue = selectedDate?.plus({ days: 1 });
		setSelectedDateQuery(dateValue.operational_date);
	};

	const updateSelectedDateToLessOneDay = () => {
		if (!selectedDate) return;
		const dateValue = selectedDate?.minus({ days: 1 });
		setSelectedDateQuery(dateValue.operational_date);
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
			today: todayDate,
			tomorrow: tomorrowDate,
		},
		flags: {
			is_today_selected: selectedDate?.operational_date === todayDate.operational_date,
			is_tomorrow_selected: selectedDate?.operational_date === tomorrowDate.operational_date,
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
