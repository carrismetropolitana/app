/* * */

import { useLinesContext } from '@/contexts/Lines.context';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { AccountWidget } from '@/types/account.types';
import { Routes } from '@/utils/routes';
import { Pattern } from '@carrismetropolitana/api-types/network';
import { ListItem } from '@rn-vui/themed';
import { IconBell } from '@tabler/icons-react-native';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

import { SmartNotificationWidgetCardBody } from '../SmartNotificationsWidgetCardBody';
import { SmartNotificationsWidgetCardHeader } from '../SmartNotificationsWidgetCardHeader';
import { SmartNotificationsWidgetCardToolbar } from '../SmartNotificationsWidgetCardToolbar';
import { styles } from './styles';

/* * */

interface SmartNotificationWidgetCardProps {
	data?: AccountWidget
	expanded?: boolean
	onToggle?: () => void
}

/* * */

export function SmartNotificationWidgetCard({ data, expanded = true, onToggle }: SmartNotificationWidgetCardProps) {
	//

	//
	// A. Setup variables

	const stopsContext = useStopsContext();
	const linesContext = useLinesContext();

	const smartNotificationsData = data?.data.type === 'smart_notifications' ? data.data : undefined;
	const smartNotificationHour = DateTime.fromSeconds(smartNotificationsData?.start_time || 0).toFormat('HH:mm');
	const pulseAnim = useRef(new Animated.Value(1)).current;
	const [patternId] = useState<null | string>(data?.data.type === 'smart_notifications' ? data.data.pattern_id : null);
	const [stopName, setStopName] = useState<string>('');
	const [stopMunicipality, setStopMunicipality] = useState<string>();

	const cardStyles = styles();

	const lineID = patternId?.split('_')[0] || '';

	useEffect(() => {
		if (stopsContext.flags.is_loading || !data || !stopsContext.actions.getStopById) return;
		fetchStopName(patternId || '');
		fetchMunicipalities(smartNotificationsData?.stop_id || '');
	}, [stopsContext.flags.is_loading, data]);

	const fetchStopName = async (id: string) => {
		if (!id) return;
		const response = await fetch(`${Routes.API}/patterns/${id}`);
		const data: Pattern[] = await response.json();
		if (data) {
			setStopName(data[0].headsign);
		}
	};

	const fetchMunicipalities = (id: string) => {
		if (!id) return;
		const stop = stopsContext.actions.getStopById(id);
		if (!stop) {
			console.error(`Stop data not found for id: ${id}`);
			return;
		}
		if (stop.municipality_id) {
			const municipality = linesContext.data.municipalities.find(m => m.id === stop.municipality_id);
			if (municipality) {
				setStopMunicipality(municipality.name);
			}
		}
	};

	//
	// B. Transform Data

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					duration: 800,
					toValue: 1.15,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					duration: 800,
					toValue: 1,
					useNativeDriver: true,
				}),
			]),
		).start();
	}, [pulseAnim]);

	//
	// D. Render Components

	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			isExpanded={expanded}
			onPress={onToggle}
			content={(
				<SmartNotificationsWidgetCardHeader municipality={stopMunicipality || ''} startHour={smartNotificationHour} title={stopName || ''} />
			)}
			icon={(
				<View style={{ alignItems: 'center', marginTop: -20 }}>
					<Animated.View
						style={[cardStyles.gradientCircle, { backgroundColor: '#daf0ef', position: 'absolute', transform: [{ scale: pulseAnim }], zIndex: 0 }]}
					/>
					<View style={[cardStyles.innerCircle, { alignSelf: 'center', position: 'absolute', zIndex: 1 }]}>
						<IconBell color="#fff" size={32} />
						<View style={cardStyles.notificationDot} />
					</View>
				</View>
			)}
		>
			<View style={cardStyles.cardBody}>
				{data && <SmartNotificationsWidgetCardToolbar data={data} />}
				<LinesDetailContextProvider>
					<SmartNotificationWidgetCardBody lineId={lineID} />
				</LinesDetailContextProvider>
			</View>
		</ListItem.Accordion>
	);

	//
}
