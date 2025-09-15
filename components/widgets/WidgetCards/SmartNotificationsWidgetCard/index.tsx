/* * */

import { AccordionToggle } from '@/components/AccordionToggle';
import { LinesDetailContextProvider } from '@/contexts/LinesDetail.context';
import { useLocationsContext } from '@/contexts/Locations.context';
import { useStopsContext } from '@/contexts/Stops.context';
import { AccountWidget } from '@/types/account.types';
import { ListItem } from '@rn-vui/themed';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

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
	const locationsContext = useLocationsContext();

	const smartNotificationsData = data?.data.type === 'smart_notifications' ? data.data : undefined;
	const smartNotificationHour = DateTime.fromSeconds(smartNotificationsData?.start_time || 0).toFormat('HH:mm');

	const [patternId] = useState<null | string>(data?.data.type === 'smart_notifications' ? data.data.pattern_id : null);
	const [stopName, setStopName] = useState<string>('');
	const [stopMunicipality, setStopMunicipality] = useState<string>();

	const cardStyles = styles();

	const lineID = patternId?.split('_')[0] || '';

	useEffect(() => {
		if (stopsContext.flags.loading || !data || !stopsContext.actions.getStopById) return;
		fetchMunicipalities(smartNotificationsData?.stop_id || '');
		fetchStopName(smartNotificationsData?.stop_id || '');
	}, [stopsContext.flags.loading, data]);

	const fetchStopName = async (id: string) => {
		if (!id) return;
		const stopData = await stopsContext.actions.getStopById(id);
		if (stopData) {
			setStopName(stopData?.long_name || stopData?.short_name || 'Sem nome');
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
			const municipality = locationsContext.data.municipalities.find(m => m.id === stop.municipality_id);
			if (municipality) {
				setStopMunicipality(municipality.name);
			}
		}
	};

	//
	// B. Render Components
	return (
		<ListItem.Accordion
			containerStyle={!expanded ? cardStyles.cardClosed : cardStyles.cardOpen}
			content={(<SmartNotificationsWidgetCardHeader municipality={stopMunicipality || ''} startHour={smartNotificationHour} title={stopName || ''} />)}
			isExpanded={expanded}
			onPress={onToggle}
			icon={(
				<View style={{ alignItems: 'center', marginTop: -20 }}>
					<AccordionToggle expanded={expanded} size={24} isNotification />
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
