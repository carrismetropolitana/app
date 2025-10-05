/* * */

import Timetable from '@/components/common/Timetable';
import { useLineDetailContext } from '@/contexts/LineDetail.context';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useOperationalDateContext } from '@/contexts/OperationalDate.context';
import createTimetable from '@/utils/createTimetable';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export function PathWaypointTimetable() {
	const { t } = useTranslation('translation', { keyPrefix: 'lines.PathWaypointTimetable' });
	const localeContext = useLocaleContext();
	const lineDetailContext = useLineDetailContext();
	const operationalDateContext = useOperationalDateContext();
	const timeTableStyles = styles();
	const showVariantsOnTimetable = true;

	const timetableData = useMemo(() => {
		const activePatternGroup = lineDetailContext.data.active_pattern;
		const secondaryPatternGroups = lineDetailContext.data.valid_patterns?.filter(patternGroup => patternGroup.version_id !== activePatternGroup?.version_id) || [];
		const mentionedRoutes = lineDetailContext.data.routes;
		const selectedStopId = lineDetailContext.data.active_waypoint?.stop_id;
		const selectedStopSequence = lineDetailContext.data.active_waypoint?.stop_sequence;
		const selectedOperationalDate = operationalDateContext.data.selected_date?.operational_date;
		if (!activePatternGroup || !mentionedRoutes || !selectedStopId || selectedStopSequence === undefined || !selectedOperationalDate) {
			return null;
		}
		if (!activePatternGroup.valid_on.includes(selectedOperationalDate)) {
			return activePatternGroup.valid_on.reduce((acc, curr) => {
				if (selectedOperationalDate <= curr && (acc === '' || curr < acc)) return curr;
				return acc;
			}, '');
		}
		if (showVariantsOnTimetable) {
			return createTimetable(activePatternGroup, secondaryPatternGroups, mentionedRoutes, selectedStopId, selectedStopSequence, selectedOperationalDate);
		}
		else {
			return createTimetable(activePatternGroup, [], [], selectedStopId, selectedStopSequence, selectedOperationalDate);
		}
	}, [lineDetailContext.data.active_pattern, lineDetailContext.data.valid_patterns, lineDetailContext.data.active_waypoint, operationalDateContext.data.selected_date]);

	function handleNextDateClick(date: Date) {
		operationalDateContext.actions.updateSelectedDateFromJsDate(date);
	}

	if (!timetableData || typeof timetableData === 'string') {
		const nextDate = timetableData && DateTime.fromFormat(timetableData, 'yyyyMMdd').toJSDate();
		return (
			<View style={timeTableStyles.container}>
				<Text
					accessibilityHint={t('noDataAccessibilityHint')}
					accessibilityLabel={t('noDataAccessibilityLabel')}
					accessibilityLanguage={localeContext.data.locale}
					accessibilityRole="text"
					style={timeTableStyles.noData}
				>{t('no_data')}
				</Text>
				{nextDate && (
					<Pressable onPress={() => handleNextDateClick(nextDate)} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
						<Text
							accessibilityHint={t('nextDateAccessibilityHint')}
							accessibilityLabel={t('nextDateAccessibilityLabel', { value: nextDate })}
							accessibilityLanguage={localeContext.data.locale}
							accessibilityRole="text"
							style={timeTableStyles.nextDate}
						>{t('next_date', { value: nextDate })}
						</Text>
					</Pressable>
				)}
			</View>
		);
	}

	return (
		<View style={timeTableStyles.container}>
			<Text
				accessibilityHint={t('timetableAccessibilityHint')}
				accessibilityLabel={t('timetableAccessibilityLabel')}
				accessibilityLanguage={localeContext.data.locale}
				accessibilityRole="text"
				style={timeTableStyles.title}
			>{t('title')}
			</Text>
			<Timetable timetableData={timetableData} />
		</View>
	);

	//
}
