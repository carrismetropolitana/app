/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { StopArrivalRow } from '@/components/stops/StopArrivalRow';
import { useLocaleContext } from '@/contexts/Locale.context';
import { useStopDetailContext } from '@/contexts/StopDetail.context';
import { NextArrivalStop } from '@/types/timetables.types';
import { ListItem, Text } from '@rn-vui/themed';
import { Link } from 'expo-router';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

interface Props {
	description?: boolean
	descriptionEnabled?: boolean
	href?: string
	patternIds?: string[]
	title?: boolean
}

/* * */
export default function StopDetailNextArrivalsByPatternID({ description, descriptionEnabled, href, patternIds, title }: Props) {
	//

	//
	// A. Setup variables

	const [showAll, setShowAll] = useState(false);
	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const stopDetailNextArrivals = styles();
	const stopDetailContext = useStopDetailContext();
	const localeContext = useLocaleContext();

	const timetable = stopDetailContext.data.timetable_realtime_future ?? [];

	//
	// B. Transform data

	const allFormattedArrivals = useMemo(() => {
		const nowInSeconds = DateTime.now().toSeconds();
		const result: NextArrivalStop[] = [];
		const map: Record<number, NextArrivalStop> = {};
		for (const arrival of timetable) {
			if (arrival.scheduled_arrival_unix == null) continue;
			const secondsUntilArrival = Math.floor(arrival.scheduled_arrival_unix - nowInSeconds);
			const minutesUntilArrival = Math.floor(secondsUntilArrival / 60);
			const hoursUntilArrival = Math.floor(minutesUntilArrival / 60);

			let labelResult = '';
			if (minutesUntilArrival <= 0) labelResult = t('NextArrivals.arriving');
			if (hoursUntilArrival > 0) labelResult += `${hoursUntilArrival} ${t('NextArrivals.hours')} `;
			if (minutesUntilArrival > 0) labelResult += `${minutesUntilArrival % 60} ${t('NextArrivals.minutes')}`;

			const formatted = {
				estimated_arrival_hours: hoursUntilArrival,
				estimated_arrival_minutes: minutesUntilArrival,
				estimated_arrival_seconds: secondsUntilArrival,
				estimated_arrival_unix: arrival.scheduled_arrival_unix,
				label: labelResult.trim(),
			};
			result.push(formatted);
			map[arrival.scheduled_arrival_unix] = formatted;
		}
		return { map, result };
	}, [timetable, t]);

	const arrivalsToShow = useMemo(() => {
		let filtered = timetable;
		if (patternIds && patternIds.length > 0) {
			filtered = timetable.filter(arrival => arrival.pattern_id && patternIds.includes(arrival.pattern_id));
		}
		if (showAll) return filtered;
		if (filtered.length > 5) return filtered.slice(0, 5);
		return filtered;
	}, [showAll, timetable, patternIds]);

	const memoizedArrivals = useMemo(() => arrivalsToShow.map((tripData) => {
		const status = tripData.estimated_arrival_unix && tripData.estimated_arrival_unix !== tripData.scheduled_arrival_unix ? 'realtime' : 'scheduled';
		const formatted = allFormattedArrivals.map[tripData.scheduled_arrival_unix];
		return (
			<View key={tripData.trip_id} style={{ width: '100%' }}>
				{status === 'realtime' && (
					<Link accessibilityHint={t('next_arrivals_realtime_hint')} accessibilityLabel={t('next_arrivals_realtime_label')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="link" href={`/vehicles/${tripData.vehicle_id}`} style={{ width: '100%' }}>
						<StopArrivalRow
							formatted={formatted}
							status={status}
							tripData={{
								...tripData,
								vehicle_id: tripData.vehicle_id ?? undefined,
							}}
						/>
					</Link>
				)}
				{status === 'scheduled' && (
					<Link accessibilityHint={t('next_arrivals_scheduled_hint')} accessibilityLabel={t('next_arrivals_scheduled_label')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="link" href={`/lines/${tripData.line_id}`} style={{ width: '100%' }}>
						<StopArrivalRow
							formatted={formatted}
							status={status}
							tripData={{
								...tripData,
								vehicle_id: tripData.vehicle_id ?? undefined,
							}}
						/>
					</Link>
				)}
			</View>
		);
	}), [arrivalsToShow, allFormattedArrivals, stopDetailNextArrivals]);

	//
	// C. Render components

	if (!arrivalsToShow.length) {
		return (
			<View accessibilityHint={t('no_data_accessibility_hint')} accessibilityLabel={t('no_data_accessibility_label')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={stopDetailNextArrivals.sectionWrapper}>
				<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>
				<NoDataLabel text={t('end_of_day')} />
				<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
			</View>
		);
	}

	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			{title && <Text accessibilityHint={t('title_accessibility_hint')} accessibilityLabel={t('title_accessibility_label')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>}
			{memoizedArrivals}
			{(patternIds && patternIds.length > 0 && timetable.filter(arrival => arrival.pattern_id && patternIds.includes(arrival.pattern_id)).length > 3) && (
				<ListItem accessibilityHint={t('show_hide_all_nextArrivals_accessibility_hint')} accessibilityLabel={t('show_hide_all_nextArrivals_accessibility_label')} accessibilityLanguage={localeContext.data.locale} accessibilityRole="button" accessibilityState={{ expanded: showAll }} onPress={() => setShowAll(!showAll)} bottomDivider>
					<ListItem.Content>
						{href && (
							<Link href={href} style={stopDetailNextArrivals.see_more}>
								<Text>
									{!showAll
										? t('NextArrivals.see_more')
										: t('NextArrivals.see_less')}
								</Text>
							</Link>
						)}
						{!href && (
							<Text style={stopDetailNextArrivals.see_more}>
								{!showAll ? t('NextArrivals.see_more') : t('NextArrivals.see_less')}
							</Text>
						)}
					</ListItem.Content>
					<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
				</ListItem>
			)}

			{descriptionEnabled && <Text accessibilityHint={t('description_accessibility_hint')} accessibilityLabel={t('description_accessibility_label')} accessibilityLanguage={localeContext.data.locale} style={stopDetailNextArrivals.upcomingCirculationsDescription}>{description ? description : t('description') }</Text>}
		</View>
	);

	//
}
