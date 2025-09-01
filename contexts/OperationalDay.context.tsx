/* * */

import type { OperationalDate } from '@/types/operational-date';

import { Dates } from '@/utils/dates/dates';
import { useLocalSearchParams } from 'expo-router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/* * */

interface OperationalDayContextState {
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

const OperationalDayContext = createContext<OperationalDayContextState | undefined>(undefined);

export function useOperationalDayContext() {
	const context = useContext(OperationalDayContext);
	if (!context) {
		throw new Error('useOperationalDayContext must be used within a OperationalDayContextProvider');
	}
	return context;
}

/* * */

export const OperationalDayContextProvider = ({ children }: { children: React.ReactNode }) => {
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

	const contextValue: OperationalDayContextState = {
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
	};

	//
	// E. Render components

	return (
		<OperationalDayContext.Provider value={contextValue}>
			{children}
		</OperationalDayContext.Provider>
	);

	//
};
