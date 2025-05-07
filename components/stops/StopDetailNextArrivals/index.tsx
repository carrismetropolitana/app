/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { LineBadge } from '@/components/lines/LineBadge';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { NextArrivalStop } from '@/types/timetables.types';
import { ListItem, Text } from '@rneui/themed';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailNextArrivals() {
	//

	//
	// A. Setup variables
	const [allFormattedArrivals, setFormattedArrivals] = useState<NextArrivalStop[]>([]);
	const [showAll, setShowAll] = useState(false);

	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const stopDetailNextArrivals = styles();
	const stopsDetailContext = useStopsDetailContext();

	//
	// B. Transform data
	useEffect(() => {
		const formatArrivals = () => {
			const nowInSeconds = DateTime.now().toSeconds();
			const allFormattedArrivalsResult: NextArrivalStop[] = [];
			if (!stopsDetailContext.data.timetable_realtime_future) return;
			for (const arrival of stopsDetailContext.data.timetable_realtime_future) {
				if (arrival.scheduled_arrival_unix == null) {
					continue;
				}

				const secondsUntilArrival = Math.floor(arrival.scheduled_arrival_unix - nowInSeconds);
				const minutesUntilArrival = Math.floor(secondsUntilArrival / 60);
				const hoursUntilArrival = Math.floor(minutesUntilArrival / 60);

				let labelResult = '';
				if (minutesUntilArrival <= 0) {
					labelResult = t('NextArrivals.arriving');
				}
				if (hoursUntilArrival > 0) {
					labelResult += `${hoursUntilArrival} ${t('NextArrivals.hours')} `;
				}
				if (minutesUntilArrival > 0) {
					labelResult += `${minutesUntilArrival % 60} ${t('NextArrivals.minutes')}`;
				}

				allFormattedArrivalsResult.push({
					estimated_arrival_hours: hoursUntilArrival,
					estimated_arrival_minutes: minutesUntilArrival,
					estimated_arrival_seconds: secondsUntilArrival,
					estimated_arrival_unix: arrival.scheduled_arrival_unix,
					label: labelResult.trim(),
				});
			}

			setFormattedArrivals(allFormattedArrivalsResult);

		//
		};

		formatArrivals();

		const interval = setInterval(formatArrivals, 1000);

		return () => clearInterval(interval);
	}, [stopsDetailContext.data.timetable_realtime_future]);
	//

	//
	// C. Render components

	const arrivalsToShow = showAll
		? stopsDetailContext.data.timetable_realtime_future
		: stopsDetailContext.data.timetable_realtime_future?.slice(0, 5);

	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>
			{arrivalsToShow && arrivalsToShow.length > 0 && (
				<>
					{arrivalsToShow.map(tripData => (
						<ListItem key={tripData.trip_id} bottomDivider>
							<ListItem.Content>
								<ListItem.Title>
									<View style={stopDetailNextArrivals.arrivalContainer}>
										<LineBadge lineId={tripData.line_id} size="lg" />
										<Text style={stopDetailNextArrivals.headsign}>{tripData.headsign}</Text>
										{allFormattedArrivals.filter(formattedArrival => formattedArrival.estimated_arrival_unix === tripData.scheduled_arrival_unix).map(formattedArrival => (
											<Text key={formattedArrival.estimated_arrival_unix} style={stopDetailNextArrivals.arrival}>
												{formattedArrival.label}
											</Text>
										))}
									</View>
								</ListItem.Title>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					))}

					{showAll && (
						<ListItem>
							<ListItem.Content>
								<NoDataLabel text={t('end_of_day')} fill />
							</ListItem.Content>
						</ListItem>
					)}

					{((stopsDetailContext.data.timetable_realtime_future?.length ?? 0) > 5) && (
						<ListItem onPress={() => setShowAll(!showAll)} bottomDivider>
							<ListItem.Content>
								{!showAll
									? <Text style={{ color: '#007AFF', textAlign: 'center', width: '100%' }}>{t('see_more', { defaultValue: 'Ver mais' })}</Text>
									: <Text style={{ color: '#007AFF', textAlign: 'center', width: '100%' }}>{t('see_less', { defaultValue: 'Ver menos' })}</Text>}
							</ListItem.Content>
						</ListItem>
					)}

				</>
			)}
			<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
		</View>
	);

	//
}
