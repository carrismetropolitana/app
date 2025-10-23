/* * */

import { LiveIcon } from '@/components/arrivals/LiveIcon';
import { useLocaleContext } from '@/contexts/Locale.context';
import { Dates } from '@/core-replica';
import { IconClockHour9 } from '@tabler/icons-react-native';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useStyles } from './styles';

/* * */

interface PathWaypointNextArrivalsProps {
	realtimeArrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
	scheduledArrivals: { type: 'realtime' | 'scheduled', unixTs: number }[]
}

/* * */

export function PathWaypointNextArrivals({ realtimeArrivals, scheduledArrivals }: PathWaypointNextArrivalsProps) {
	//

	//
	// A. Setup variables

	const styles = useStyles();

	const localeContext = useLocaleContext();

	const now = Date.now();

	const { t } = useTranslation('translation', { keyPrefix: 'lines.PathStopNextArrivals' });

	//
	// B. Transform data

	const formatDelta = (ms: number) => {
		let toReturn = '';
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (minutes <= 0) {
			return t('arriving');
		}

		if (hours > 0) {
			toReturn += `${hours} hora${hours > 1 ? 's' : ''} `;
		}
		if (minutes > 0) {
			toReturn += `${minutes % 60} min`;
		}
		return toReturn;
	};

	//
	// C. Render components

	if (realtimeArrivals.length === 0 && scheduledArrivals.length === 0) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text
				accessibilityHint={t('nextArrivalsTitleAccessibilityHint')}
				accessibilityLabel={t('nextArrivalsTitleAccessibilityLabel')}
				accessibilityLanguage={localeContext.data.locale}
				accessibilityRole="header"
				style={styles.title}
			>
				{t('title')}
			</Text>
			<View style={styles.arrivalsWrapper}>
				{realtimeArrivals.length > 0 && (
					<View style={styles.realtimeArrivalsWrapper}>
						<LiveIcon />
						<View style={styles.realtimeArrivalsList}>
							{realtimeArrivals.map(realtimeArrival => realtimeArrival != undefined && (
								<View key={realtimeArrival.unixTs}>
									<Text
										accessibilityHint={t('nextArrivalsRealtimeAccessibilityHint')}
										accessibilityLabel={t('nextArrivalsRealtimeAccessibilityLabel', formatDelta(realtimeArrival.unixTs - now))}
										accessibilityLanguage={localeContext.data.locale}
										accessibilityRole="text"
										style={styles.realtimeArrival}
									>
										{formatDelta(realtimeArrival.unixTs - now)}
									</Text>
								</View>
							))}
						</View>
					</View>
				)}

				{scheduledArrivals.length > 0 && (
					<View style={styles.scheduledArrivalsWrapper}>
						<IconClockHour9 size={14} />
						<View style={styles.scheduledArrivalsList}>
							{scheduledArrivals.slice(0, realtimeArrivals.length > 0 ? 3 : 4).map(scheduledArrival => scheduledArrival != undefined && (
								<View key={scheduledArrival.unixTs}>
									<Text
										accessibilityHint={t('nextArrivalsRealtimeAccessibilityHint')}
										accessibilityLabel={t('nextArrivalsRealtimeAccessibilityLabel', Dates.fromUnixTimestamp(scheduledArrival.unixTs).toFormat('HH:mm'))}
										accessibilityLanguage={localeContext.data.locale}
										accessibilityRole="text"
										style={styles.scheduledArrival}
									>
										{Dates.fromUnixTimestamp(scheduledArrival.unixTs).toFormat('HH:mm')}
									</Text>
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
