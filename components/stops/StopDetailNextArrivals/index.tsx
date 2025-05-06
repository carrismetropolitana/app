/* * */

import { NoDataLabel } from '@/components/common/layout/NoDataLabel';
import { useStopsDetailContext } from '@/contexts/StopsDetail.context';
import { ListItem, Text } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

/* * */

export default function StopDetailNextArrivals() {
	//

	//
	// A. Setup variables
	const { t } = useTranslation('translation', { keyPrefix: 'stops.StopDetails' });

	const stopDetailNextArrivals = styles();
	const stopsDetailContext = useStopsDetailContext();
	//
	// B. Render components
	return (
		<View style={stopDetailNextArrivals.sectionWrapper}>
			<Text style={stopDetailNextArrivals.sectionHeading}>{t('heading')}</Text>
			{stopsDetailContext.data.timetable_realtime_future && stopsDetailContext.data.timetable_realtime_future.length > 0 && (
				<>
					{stopsDetailContext.data.timetable_realtime_future.map(tripData => (
						<ListItem key={tripData.trip_id} bottomDivider>
							<ListItem.Content>
								<ListItem.Title>{tripData.headsign}</ListItem.Title>
								<ListItem.Subtitle>{tripData.estimated_arrival_unix ? 'realtime' : 'scheduled'}</ListItem.Subtitle>
							</ListItem.Content>
							<ListItem.Chevron />
						</ListItem>
					))}
					<ListItem>
						<ListItem.Content>
							<NoDataLabel text={t('end_of_day')} fill />
						</ListItem.Content>
					</ListItem>

				</>
			)}
			<Text style={stopDetailNextArrivals.upcomingCirculationsDescription}>{t('description')}</Text>
		</View>
	);

	//
}
