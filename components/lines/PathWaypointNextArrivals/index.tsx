/* * */

import { LiveIcon } from '@/components/common/LiveIcon';
import { IconClockHour9 } from '@tabler/icons-react-native';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { styles } from './styles';

/* * */

export function PathWaypointNextArrivals({ realtimeArrivals, scheduledArrivals }: { realtimeArrivals: { type: 'realtime' | 'scheduled', unixTs: number }[], scheduledArrivals: { type: 'realtime' | 'scheduled', unixTs: number }[] }) {
	//

	//
	// A. Setup variables

	const { t } = useTranslation('translation', { keyPrefix: 'lines.PathStopNextArrivals' });

	const now = Date.now();
	const pathWaypointNextArrivalsStyles = styles();

	//
	// D. Render components

	if (realtimeArrivals.length === 0 && scheduledArrivals.length === 0) {
		return null;
	}

	return (
		<View style={pathWaypointNextArrivalsStyles.container}>
			<Text style={pathWaypointNextArrivalsStyles.title}>{t('title')}</Text>
			<View style={pathWaypointNextArrivalsStyles.arrivalsWrapper}>
				{realtimeArrivals.length > 0 && (
					<View style={pathWaypointNextArrivalsStyles.realtimeArrivalsWrapper}>
						<LiveIcon />
						<View style={pathWaypointNextArrivalsStyles.realtimeArrivalsList}>
							{realtimeArrivals.map(realtimeArrival => realtimeArrival != undefined && (
								<View key={realtimeArrival.unixTs}>
									<Text style={pathWaypointNextArrivalsStyles.realtimeArrival}>{formatDelta(realtimeArrival.unixTs - now)}</Text>
								</View>
							))}
						</View>
					</View>
				)}

				{scheduledArrivals.length > 0 && (
					<View style={pathWaypointNextArrivalsStyles.scheduledArrivalsWrapper}>
						<IconClockHour9 size={14} />
						<View style={pathWaypointNextArrivalsStyles.scheduledArrivalsList}>
							{scheduledArrivals.slice(0, realtimeArrivals.length > 0 ? 3 : 4).map(scheduledArrival => scheduledArrival != undefined && (
								<View key={scheduledArrival.unixTs}>
									<Text style={pathWaypointNextArrivalsStyles.scheduledArrival}>{dayjs(scheduledArrival.unixTs).format('HH:mm')}</Text>
								</View>
							))}
						</View>
					</View>
				)}

			</View>
		</View>
	);

	//
}

/* * */

function formatDelta(ms: number) {
	let toReturn = '';
	const seconds = Math.floor(ms / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	if (minutes <= 0) {
		return 'A chegar';
	}

	if (hours > 0) {
		toReturn += `${hours} hora${hours > 1 ? 's' : ''} `;
	}
	if (minutes > 0) {
		toReturn += `${minutes % 60} min`;
	}
	return toReturn;
}
