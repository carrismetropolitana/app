/* * */

import Timetable from '@/components/common/Timetable';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import createTimetable from '@/utils/createTimetable';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import styles from './styles.module.css';

/* * */

export function PathWaypointTimetable() {
	//

	//
	// A. Setup variables

	const t = useTranslations('lines.PathWaypointTimetable');

	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();

	const showVariantsOnTimetable = true;

	//
	// B. Transform data

	const timetableData = useMemo(() => {
		// Setup variables
		const activePatternGroup = linesDetailContext.data.active_pattern;
		const secondaryPatternGroups = linesDetailContext.data.valid_patterns?.filter(patternGroup => patternGroup.version_id !== activePatternGroup?.version_id) || [];
		const mentionedRoutes = linesDetailContext.data.routes;
		const selectedStopId = linesDetailContext.data.active_waypoint?.stop_id;
		const selectedStopSequence = linesDetailContext.data.active_waypoint?.stop_sequence;
		const selectedOperationalDay = operationalDayContext.data.selected_day;
		// Check if all these variables are defined
		if (!activePatternGroup || !mentionedRoutes || !selectedStopId || selectedStopSequence === undefined || !selectedOperationalDay) {
			return null;
		}

		// Check if there are schedules for the selected operational day
		if (!activePatternGroup.valid_on.includes(selectedOperationalDay)) {
			// Find the closest valid date
			return activePatternGroup.valid_on.reduce((acc, curr) => {
				if (selectedOperationalDay <= curr && (acc === '' || curr < acc)) return curr;
				return acc;
			}, '');
		}

		// Check if the user has enabled complex schedules
		if (showVariantsOnTimetable) {
			return createTimetable(activePatternGroup, secondaryPatternGroups, mentionedRoutes, selectedStopId, selectedStopSequence, selectedOperationalDay);
		}
		else {
			return createTimetable(activePatternGroup, [], [], selectedStopId, selectedStopSequence, selectedOperationalDay);
		}
	}, [linesDetailContext.data.active_pattern, linesDetailContext.data.valid_patterns, linesDetailContext.data.active_waypoint, operationalDayContext.data.selected_day]);

	//
	// C. Handle actions

	function handleNextDateClick(date: Date) {
		operationalDayContext.actions.updateSelectedDayFromJsDate(date);
	}

	//
	// D. Render components

	if (!timetableData || typeof timetableData === 'string') {
		const nextDate = timetableData && DateTime.fromFormat(timetableData, 'yyyyMMdd').toJSDate();
		return (
			<div className={styles.container}>
				<p className={styles.noData}>{t('no_data')}</p>
				{nextDate && <p className={styles.nextDate} onClick={() => handleNextDateClick(nextDate)}>{t('next_date', { value: nextDate })}</p>}
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<p className={styles.title}>{t('title')}</p>
			<Timetable timetableData={timetableData} />
		</div>
	);

	//
}
