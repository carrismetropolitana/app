/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { LineBadge } from '@/components/lines/LineBadge';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
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
	href?: string
	title?: boolean
}

/* * */
export default function StopDetailNextArrivals({ description, href, title }: Props) {
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
		() => (showAll ? timetable : timetable.slice(0, 3)),
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
			<View style={{ flex: 1, width: '100%' }}>
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
			</View>
		);
	};

	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			{title && <Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>}
			<>
				{arrivalsToShow.map(tripData => (
					<Link key={tripData.trip_id} href={`/vehicle/${tripData.vehicle_id}`} style={{ width: '100%' }}>
						<ArrivalRow key={tripData.trip_id} tripData={tripData} />
					</Link>
				))}

				{showAll && (
					<ListItem>
						<ListItem.Content>
							<NoDataLabel text={t('end_of_day')} fill />
						</ListItem.Content>
					</ListItem>
				)}

				{timetable.length > 3 && (
					<ListItem onPress={() => setShowAll(!showAll)} bottomDivider>
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
									{!showAll
										? t('NextArrivals.see_more')
										: t('NextArrivals.see_less')}
								</Text>
							)}
						</ListItem.Content>
					</ListItem>
				)}
			</>
			{description && <Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>}
		</View>
	);

	//
}
