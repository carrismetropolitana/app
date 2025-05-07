/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { LineBadge } from '@/components/lines/LineBadge';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { NextArrivalStop } from '@/types/timetables.types';
import { ListItem, Text } from '@rneui/themed';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailNextArrivals() {
	//

	//
	// A. Setup variables

	const [showAll, setShowAll] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const stopDetailNextArrivals = styles();
	const stopsDetailContext = useStopsDetailContext();

	const timetable = stopsDetailContext.data.timetable_realtime_future ?? [];

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

	const arrivalsToShow = useMemo(
		() => (showAll ? timetable : timetable.slice(0, 5)),
		[showAll, timetable],
	);

	//
	// C. Render components

	if (!arrivalsToShow.length) {
		return (
			<View style={stopDetailNextArrivals.sectionWrapper}>
				<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>
				<NoDataLabel text={t('end_of_day')} fill />
				<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
			</View>
		);
	}

	const ArrivalRow = ({ tripData }) => {
		const formatted = allFormattedArrivals.map[tripData.scheduled_arrival_unix];

		return (
			<ListItem key={tripData.trip_id} bottomDivider>
				<ListItem.Content>
					<ListItem.Title>
						<View style={stopDetailNextArrivals.arrivalContainer}>
							<LineBadge lineId={tripData.line_id} size="lg" />
							<Text style={stopDetailNextArrivals.headsign}>{tripData.headsign}</Text>
							<View style={{ flex: 1 }} />
							{formatted && (
								<View style={stopDetailNextArrivals.rippleContainer}>
									<View style={stopDetailNextArrivals.ripple}>
										<View style={stopDetailNextArrivals.dot} />
									</View>
									<Text style={stopDetailNextArrivals.arrival}>{formatted.label}</Text>
								</View>
							)}
						</View>
					</ListItem.Title>
				</ListItem.Content>
				<ListItem.Chevron />
			</ListItem>
		);
	};

	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>
			<>
				{arrivalsToShow.map(tripData => (
					<ArrivalRow key={tripData.trip_id} tripData={tripData} />
				))}

				{showAll && (
					<ListItem>
						<ListItem.Content>
							<NoDataLabel text={t('end_of_day')} fill />
						</ListItem.Content>
					</ListItem>
				)}

				{timetable.length > 5 && (
					<ListItem onPress={() => setShowAll(!showAll)} bottomDivider>
						<ListItem.Content>
							<Text style={stopDetailNextArrivals.see_more}>
								{!showAll
									? t('see_more', { defaultValue: 'Ver mais' })
									: t('see_less', { defaultValue: 'Ver menos' })}
							</Text>
						</ListItem.Content>
					</ListItem>
				)}
			</>
			<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
		</View>
	);

	//
}
