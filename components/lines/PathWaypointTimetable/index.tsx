/* * */

import Timetable from '@/components/common/Timetable';
import { useLinesDetailContext } from '@/contexts/LinesDetail.context';
import { useOperationalDayContext } from '@/contexts/OperationalDay.context';
import createTimetable from '@/utils/createTimetable';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export function PathWaypointTimetable() {
	const { t } = useTranslation('lines.PathWaypointTimetable');
	const linesDetailContext = useLinesDetailContext();
	const operationalDayContext = useOperationalDayContext();
	const showVariantsOnTimetable = true;

	const timetableData = useMemo(() => {
		const activePatternGroup = linesDetailContext.data.active_pattern;
		const secondaryPatternGroups = linesDetailContext.data.valid_patterns?.filter(patternGroup => patternGroup.version_id !== activePatternGroup?.version_id) || [];
		const mentionedRoutes = linesDetailContext.data.routes;
		const selectedStopId = linesDetailContext.data.active_waypoint?.stop_id;
		const selectedStopSequence = linesDetailContext.data.active_waypoint?.stop_sequence;
		const selectedOperationalDay = operationalDayContext.data.selected_day;
		if (!activePatternGroup || !mentionedRoutes || !selectedStopId || selectedStopSequence === undefined || !selectedOperationalDay) {
			return null;
		}
		if (!activePatternGroup.valid_on.includes(selectedOperationalDay)) {
			return activePatternGroup.valid_on.reduce((acc, curr) => {
				if (selectedOperationalDay <= curr && (acc === '' || curr < acc)) return curr;
				return acc;
			}, '');
		}
		if (showVariantsOnTimetable) {
			return createTimetable(activePatternGroup, secondaryPatternGroups, mentionedRoutes, selectedStopId, selectedStopSequence, selectedOperationalDay);
		}
		else {
			return createTimetable(activePatternGroup, [], [], selectedStopId, selectedStopSequence, selectedOperationalDay);
		}
	}, [
		linesDetailContext.data.active_pattern,
		linesDetailContext.data.valid_patterns,
		linesDetailContext.data.active_waypoint,
		operationalDayContext.data.selected_day,
	]);

	function handleNextDateClick(date: Date) {
		operationalDayContext.actions.updateSelectedDayFromJsDate(date);
	}

	if (!timetableData || typeof timetableData === 'string') {
		const nextDate = timetableData && DateTime.fromFormat(timetableData, 'yyyyMMdd').toJSDate();
		return (
			<View style={styles.container}>
				<Text style={styles.noData}>{t('no_data')}</Text>
				{nextDate && (
					<Pressable onPress={() => handleNextDateClick(nextDate)} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
						<Text style={styles.nextDate}>{t('next_date', { value: nextDate })}</Text>
					</Pressable>
				)}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{t('title')}</Text>
			<Timetable timetableData={timetableData} />
		</View>
	);

	//
}
