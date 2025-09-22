import { LiveIcon } from '@/components/common/LiveIcon';
import { LineBadge } from '@/components/lines/LineBadge';
import { useLocaleContext } from '@/contexts/Locale.context';
import { theming } from '@/theme/Variables';
import { ListItem, Text } from '@rn-vui/themed';
import { IconClock } from '@tabler/icons-react-native';
import { use } from 'i18next';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { styles } from './styles';

interface StopArrivalRowProps {
	formatted: {
		estimated_arrival_hours: number
		estimated_arrival_minutes: number
		estimated_arrival_seconds: number
		estimated_arrival_unix: number
		label: string
	}
	status: 'realtime' | 'scheduled'
	tripData: {
		headsign: string
		line_id: string
		pattern_id?: string
		scheduled_arrival_unix: number
		trip_id: string
		vehicle_id?: string
	}
}

export const StopArrivalRow = ({ formatted, status, tripData }: StopArrivalRowProps) => {
	//

	//
	// A. Setup variables

	const stopDetailNextArrivals = styles();

	const localeContext = useLocaleContext();
	const { t } = useTranslation('translations', { keyPrefix: 'common' });

	//
	// B. Render Components
	return (
		<View style={{ flex: 1, width: '100%' }}>
			<ListItem bottomDivider>
				<ListItem.Content>
					<ListItem.Title>
						<View style={stopDetailNextArrivals.arrivalContainer}>
							<LineBadge lineId={tripData.line_id} size="lg" withAlertIcon />
							<Text accessibilityHint={t('next_arrival_row_realtime_hint')} accessibilityLabel={t('next_arrival_row_realtime_label', { headsign: tripData.headsign })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={stopDetailNextArrivals.headsign}>{tripData.headsign}</Text>
							<View style={{ flex: 1 }} />
							{formatted && status === 'realtime' && (
								<View style={stopDetailNextArrivals.rippleContainer}>
									<LiveIcon />
									<Text accessibilityHint={t('next_arrival_row_realtime_time_hint')} accessibilityLabel={t('next_arrival_row_realtime_time_label', { headsign: formatted })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={stopDetailNextArrivals.arrival}>{formatted.label}</Text>
								</View>
							)}
							{formatted && status === 'scheduled' && (
								<View style={stopDetailNextArrivals.rippleContainer}>
									<IconClock color={theming.colorSystemText300} size={24} />
									<Text accessibilityHint={t('next_arrival_row_scheduled_time_hint')} accessibilityLabel={t('next_arrival_row_scheduled_time_label', { headsign: DateTime.fromSeconds(formatted.estimated_arrival_unix).toFormat('HH:mm') })} accessibilityLanguage={localeContext.data.locale} accessibilityRole="text" style={stopDetailNextArrivals.arrivalScheduled}>{DateTime.fromSeconds(formatted.estimated_arrival_unix).toFormat('HH:mm')}</Text>
								</View>
							)}
						</View>
					</ListItem.Title>
				</ListItem.Content>
				<ListItem.Chevron iconStyle={{ fontSize: 24 }} />
			</ListItem>
		</View>
	);

	//
};
